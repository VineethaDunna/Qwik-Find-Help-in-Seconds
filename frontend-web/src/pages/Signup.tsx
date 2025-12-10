import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import {
	User,
	Briefcase,
	ArrowRight,
	ArrowLeft,
	Mail,
	Lock,
	Phone,
	MapPin,
	CheckCircle,
	Plus,
	X,
	UploadCloud,
	Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
	register as apiRegister,
	fetchServices as apiFetchServices,
	updateUserProfile,
	updateWorkerProfile,
	updateWorkerServices,
} from "@/services/api";
import { supabase } from "@/lib/supabaseClient";

// ---- types ----
type Role = "user" | "worker" | null;

interface Service {
	id: string;
	name: string;
}

interface StepProps {
	currentStep: number;
	totalSteps: number;
}

// ---- small presentational components ----
const ProgressIndicator = ({ currentStep, totalSteps }: StepProps) => {
	return (
		<div className='flex items-center justify-center gap-2 mb-6'>
			{Array.from({ length: totalSteps }).map((_, index) => {
				const isDone = index < currentStep;
				const isActive = index === currentStep;
				return (
					<div
						key={index}
						aria-hidden
						className={cn(
							"h-2 rounded-full transition-all duration-300",
							isDone
								? "w-10 bg-primary"
								: isActive
								? "w-8 bg-primary/60"
								: "w-2 bg-border"
						)}
					/>
				);
			})}
		</div>
	);
};

// default avatar images (public urls — replace with project assets if needed)
const DEFAULT_AVATARS = [
	"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
];

const Signup: React.FC = () => {
	const [step, setStep] = useState(0);
	const [role, setRole] = useState<Role>(null);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<string | null>(null);
	const navigate = useNavigate();

	const [servicesList, setServicesList] = useState<Service[]>([]);
	const [showCustomInput, setShowCustomInput] = useState(false);

	// form state
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		phone: "",
		location: "",
		servicesSelected: [] as string[],
		hourlyRate: "",
		customServiceInput: "",
		bio: "",
		experienceYears: "",
		availability: "available",
		chosenAvatarUrl: DEFAULT_AVATARS[0],
		uploadedFileName: "",
	});

	const totalSteps = role === "worker" ? 3 : 2;
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	// load services once
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const svcs = await apiFetchServices();
				if (mounted && Array.isArray(svcs)) {
					setServicesList(svcs);
				}
			} catch (err) {
				console.warn("fetch services failed", err);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	// small helpers
	const updateField = (patch: Partial<typeof formData>) =>
		setFormData((prev) => ({ ...prev, ...patch }));

	function toggleServiceId(serviceId: string) {
		setFormData((prev) => {
			const has = prev.servicesSelected.includes(serviceId);
			return {
				...prev,
				servicesSelected: has
					? prev.servicesSelected.filter((s) => s !== serviceId)
					: [...prev.servicesSelected, serviceId],
			};
		});
	}

	const handleAddCustomService = async () => {
		const title = formData.customServiceInput.trim();
		if (!title) return;
		setLoading(true);
		try {
			const { data, error } = await supabase
				.from("services")
				.insert({ name: title, category: "Other", is_active: true })
				.select()
				.single();
			if (error || !data) throw error || new Error("failed to create");
			setServicesList((prev) => [{ id: data.id, name: data.name }, ...prev]);
			updateField({
				servicesSelected: [data.id, ...formData.servicesSelected],
				customServiceInput: "",
			});
			setShowCustomInput(false);
		} catch (err: any) {
			console.error(err);
			setErrors(err?.message || "Failed to add service");
		} finally {
			setLoading(false);
		}
	};

	// upload helper (keeps UX snappy with immediate preview)
	const uploadAvatarFile = async (file: File) => {
		if (!file) return null;
		setLoading(true);
		try {
			const timestamp = Date.now();
			const ext = file.name.split(".").pop() || "jpg";
			const filePath = `avatars/${timestamp}_${Math.random()
				.toString(36)
				.slice(2, 8)}.${ext}`;
			const { error: uploadError } = await supabase.storage
				.from("avatars")
				.upload(filePath, file);
			if (uploadError) throw uploadError;
			const { data: publicData } = supabase.storage
				.from("avatars")
				.getPublicUrl(filePath);
			const publicUrl = (publicData as any)?.publicUrl || null;
			updateField({
				uploadedFileName: filePath,
				chosenAvatarUrl: publicUrl || formData.chosenAvatarUrl,
			});
			return publicUrl;
		} catch (err: any) {
			console.error("upload error", err);
			setErrors(err?.message || "Upload failed");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		const file = files[0];
		// local preview immediately
		const localUrl = URL.createObjectURL(file);
		updateField({ chosenAvatarUrl: localUrl });
		// background upload (still await so we can show any errors)
		await uploadAvatarFile(file);
	};

	// quick validations
	const validateStep = (current: number) => {
		setErrors(null);
		if (current === 0 && !role) {
			setErrors("Please choose a role.");
			return false;
		}
		if (current === 1) {
			if (!formData.name.trim())
				return setErrors("Full name is required.") || false;
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
				return setErrors("Valid email is required.") || false;
			if (!formData.password || formData.password.length < 6)
				return setErrors("Password must be at least 6 characters.") || false;
		}
		if (current === 2 && role === "worker") {
			if (!formData.servicesSelected.length)
				return setErrors("Please select at least one service.") || false;
		}
		return true;
	};

	const handleNext = () => {
		if (!validateStep(step)) return;
		if (step < totalSteps - 1) setStep((s) => s + 1);
		else handleSubmit();
	};

	const handleBack = () => {
		setErrors(null);
		if (step > 0) setStep((s) => s - 1);
	};

	// main submit
	const handleSubmit = async () => {
		setErrors(null);
		setLoading(true);
		try {
			if (!role) throw new Error("Role missing");

			const payload: any = {
				full_name: formData.name.trim(),
				email: formData.email.trim(),
				password: formData.password,
				phone_number: formData.phone.trim() || undefined,
				location: formData.location.trim() || undefined,
				user_type: role,
			};

			if (role === "worker") {
				payload.services = formData.servicesSelected;
				const rate = Number(formData.hourlyRate);
				if (!Number.isNaN(rate) && rate > 0) payload.hourly_rate = rate;
			}

			const res = await apiRegister(payload);
			if (!res || !res.success)
				throw new Error(res?.message || "Signup failed");

			// persist tokens
			const access = res.data?.access_token || res.access_token;
			const refresh = res.data?.refresh_token || res.refresh_token;
			if (access) localStorage.setItem("access_token", access);
			if (refresh) localStorage.setItem("refresh_token", refresh);

			// update profile pic
			const profilePictureUrl = formData.chosenAvatarUrl;
			if (profilePictureUrl) {
				try {
					await updateUserProfile({ profile_picture: profilePictureUrl });
				} catch (err) {
					console.warn("update profile picture failed", err);
				}
			}

			// worker extras
			if (role === "worker") {
				try {
					await updateWorkerProfile({
						bio: formData.bio || undefined,
						experience_years: formData.experienceYears
							? Number(formData.experienceYears)
							: undefined,
						hourly_rate: formData.hourlyRate
							? Number(formData.hourlyRate)
							: undefined,
						availability_status: formData.availability || undefined,
					});
					await updateWorkerServices(formData.servicesSelected);
				} catch (err) {
					console.warn("worker extras failed", err);
				}
			}

			navigate("/dashboard");
		} catch (err: any) {
			console.error("signup error", err);
			setErrors(err?.message || "Network error");
		} finally {
			setLoading(false);
		}
	};

	// small responsive layout helpers are driven by tailwind classes in JSX
	return (
		<div className='min-h-screen bg-background'>
			<Header showAuth={false} />
			<main className='container py-8 md:py-12'>
				<div className='mx-auto max-w-2xl animate-fade-in px-4'>
					<ProgressIndicator currentStep={step} totalSteps={totalSteps} />

					{errors && (
						<div className='mb-4 text-sm text-red-600 bg-red-50 p-3 rounded'>
							{errors}
						</div>
					)}

					{/* STEP 0 - Role */}
					{step === 0 && (
						<div className='text-center'>
							<h1 className='text-xl md:text-2xl font-semibold text-foreground mb-2'>
								Welcome to QuickConnect
							</h1>
							<p className='text-muted-foreground mb-8'>
								How would you like to use the platform?
							</p>

							<div className='grid gap-4 md:grid-cols-2'>
								<Card
									className={cn(
										"cursor-pointer transition-all duration-200",
										role === "user" && "ring-2 ring-primary border-primary"
									)}
									onClick={() => setRole("user")}>
									<CardContent className='flex items-center gap-4 p-5'>
										<div
											className={cn(
												"flex h-12 w-12 items-center justify-center rounded-xl",
												role === "user"
													? "bg-primary text-primary-foreground"
													: "bg-secondary"
											)}>
											<User className='h-6 w-6' />
										</div>
										<div className='text-left'>
											<h3 className='font-semibold text-foreground'>
												I need help
											</h3>
											<p className='text-sm text-muted-foreground'>
												Find and book skilled helpers
											</p>
										</div>
										{role === "user" && (
											<CheckCircle className='ml-auto h-5 w-5 text-primary' />
										)}
									</CardContent>
								</Card>

								<Card
									className={cn(
										"cursor-pointer transition-all duration-200",
										role === "worker" && "ring-2 ring-primary border-primary"
									)}
									onClick={() => setRole("worker")}>
									<CardContent className='flex items-center gap-4 p-5'>
										<div
											className={cn(
												"flex h-12 w-12 items-center justify-center rounded-xl",
												role === "worker"
													? "bg-primary text-primary-foreground"
													: "bg-secondary"
											)}>
											<Briefcase className='h-6 w-6' />
										</div>
										<div className='text-left'>
											<h3 className='font-semibold text-foreground'>
												I offer services
											</h3>
											<p className='text-sm text-muted-foreground'>
												Connect with customers and earn
											</p>
										</div>
										{role === "worker" && (
											<CheckCircle className='ml-auto h-5 w-5 text-primary' />
										)}
									</CardContent>
								</Card>
							</div>

							<Button
								className='w-full mt-6'
								size='lg'
								disabled={!role}
								onClick={handleNext}>
								Continue <ArrowRight className='h-4 w-4 ml-2' />
							</Button>

							<p className='mt-6 text-center text-sm text-muted-foreground'>
								Already have an account?{" "}
								<Link
									to='/'
									className='font-medium text-primary hover:underline'>
									Log in
								</Link>
							</p>
						</div>
					)}

					{/* STEP 1 - Basic Info */}
					{step === 1 && (
						<div>
							<h1 className='text-xl md:text-2xl font-semibold text-foreground mb-2 text-center'>
								Create your account
							</h1>
							<p className='text-muted-foreground mb-8 text-center'>
								Tell us a bit about yourself
							</p>

							<Card>
								<CardContent className='p-6 space-y-4'>
									{/* Avatar picker - responsive layout */}
									<div className='space-y-2'>
										<label className='text-sm font-medium text-foreground'>
											Choose an avatar
										</label>
										<div className='flex flex-col md:flex-row items-start gap-4'>
											<div className='flex gap-2 flex-wrap'>
												{DEFAULT_AVATARS.map((url) => (
													<button
														key={url}
														type='button'
														aria-label={`Choose avatar`}
														className={cn(
															"rounded-full overflow-hidden border-2 p-0",
															formData.chosenAvatarUrl === url
																? "border-primary"
																: "border-transparent"
														)}
														onClick={() =>
															updateField({ chosenAvatarUrl: url })
														}
														style={{ width: 56, height: 56 }}>
														<img
															src={url}
															alt='avatar'
															className='w-full h-full object-cover'
														/>
													</button>
												))}
											</div>

											<div className='flex-1'>
												<input
													ref={fileInputRef}
													onChange={onFileChange}
													type='file'
													accept='image/*'
													className='hidden'
													aria-hidden
												/>

												<div className='flex flex-wrap items-center gap-2'>
													<Button
														size='sm'
														onClick={() => fileInputRef.current?.click()}
														variant='outline'>
														<UploadCloud className='h-4 w-4 mr-2' /> Upload
														photo
													</Button>

													<button
														type='button'
														onClick={() =>
															updateField({
																chosenAvatarUrl: DEFAULT_AVATARS[0],
															})
														}
														className='text-xs text-muted-foreground'>
														or choose a default
													</button>
												</div>

												{formData.chosenAvatarUrl && (
													<div className='mt-3 flex items-center gap-4'>
														<img
															src={formData.chosenAvatarUrl}
															alt='preview'
															className='w-20 h-20 rounded-lg object-cover border'
														/>
														<div className='text-xs text-muted-foreground'>
															<div className='font-medium'>Preview</div>
															<div>Square crop recommended</div>
														</div>
													</div>
												)}
											</div>
										</div>
									</div>

									<div className='space-y-2'>
										<label
											htmlFor='name'
											className='text-sm font-medium text-foreground'>
											Full name
										</label>
										<Input
											id='name'
											placeholder='John Doe'
											value={formData.name}
											onChange={(e) => updateField({ name: e.target.value })}
										/>
									</div>

									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div className='space-y-2 relative'>
											<label
												htmlFor='email'
												className='text-sm font-medium text-foreground'>
												Email
											</label>
											<div className='relative'>
												<Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
												<Input
													id='email'
													type='email'
													placeholder='you@example.com'
													value={formData.email}
													onChange={(e) =>
														updateField({ email: e.target.value })
													}
													className='pl-10'
												/>
											</div>
										</div>

										<div className='space-y-2 relative'>
											<label
												htmlFor='password'
												className='text-sm font-medium text-foreground'>
												Password
											</label>
											<div className='relative'>
												<Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
												<Input
													id='password'
													type='password'
													placeholder='••••••••'
													value={formData.password}
													onChange={(e) =>
														updateField({ password: e.target.value })
													}
													className='pl-10'
												/>
											</div>
										</div>

										<div className='space-y-2 relative'>
											<label
												htmlFor='phone'
												className='text-sm font-medium text-foreground'>
												Phone number
											</label>
											<div className='relative'>
												<Phone className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
												<Input
													id='phone'
													type='tel'
													placeholder='+91 98765 43210'
													value={formData.phone}
													onChange={(e) =>
														updateField({ phone: e.target.value })
													}
													className='pl-10'
												/>
											</div>
										</div>

										<div className='space-y-2 relative'>
											<label
												htmlFor='location'
												className='text-sm font-medium text-foreground'>
												Location
											</label>
											<div className='relative'>
												<MapPin className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
												<Input
													id='location'
													placeholder='Mumbai, India'
													value={formData.location}
													onChange={(e) =>
														updateField({ location: e.target.value })
													}
													className='pl-10'
												/>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>

							<div className='flex gap-3 mt-6'>
								<Button
									variant='outline'
									onClick={handleBack}
									className='flex-1'>
									<ArrowLeft className='h-4 w-4 mr-2' /> Back
								</Button>
								<Button
									onClick={handleNext}
									className='flex-1'
									disabled={loading}>
									{loading
										? "Working..."
										: role === "user"
										? "Complete"
										: "Continue"}{" "}
									<ArrowRight className='h-4 w-4 ml-2' />
								</Button>
							</div>
						</div>
					)}

					{/* STEP 2 - Worker only */}
					{step === 2 && role === "worker" && (
						<div>
							<h1 className='text-xl md:text-2xl font-semibold text-foreground mb-2 text-center'>
								Your services
							</h1>
							<p className='text-muted-foreground mb-8 text-center'>
								What services do you offer?
							</p>

							<Card>
								<CardContent className='p-6 space-y-6'>
									<div className='space-y-3'>
										<label className='text-sm font-medium text-foreground'>
											Select your services
										</label>
										<div className='flex flex-wrap gap-2'>
											{servicesList.map((svc) => (
												<button
													key={svc.id}
													type='button'
													className={cn(
														"px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
														formData.servicesSelected.includes(svc.id)
															? "bg-primary text-primary-foreground"
															: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
													)}
													onClick={() => toggleServiceId(svc.id)}>
													{svc.name}
												</button>
											))}

											{!showCustomInput ? (
												<button
													type='button'
													className='px-4 py-2 rounded-lg text-sm font-medium border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200 flex items-center gap-1'
													onClick={() => setShowCustomInput(true)}>
													<Plus className='h-4 w-4' /> Other
												</button>
											) : (
												<div className='flex items-center gap-2 w-full mt-2'>
													<Input
														placeholder='Type your service...'
														value={formData.customServiceInput}
														onChange={(e) =>
															updateField({
																customServiceInput: e.target.value,
															})
														}
														onKeyDown={(e) => {
															if (e.key === "Enter") {
																e.preventDefault();
																handleAddCustomService();
															}
														}}
														className='flex-1'
														autoFocus
													/>
													<Button
														size='sm'
														onClick={handleAddCustomService}
														disabled={!formData.customServiceInput.trim()}>
														Add
													</Button>
													<Button
														size='sm'
														variant='ghost'
														onClick={() => {
															setShowCustomInput(false);
															updateField({ customServiceInput: "" });
														}}>
														<X className='h-4 w-4' />
													</Button>
												</div>
											)}
										</div>
										<p className='text-xs text-muted-foreground'>
											Select one or more services, or add your own
										</p>
									</div>

									<div className='space-y-2'>
										<label
											htmlFor='rate'
											className='text-sm font-medium text-foreground'>
											Hourly rate (₹)
										</label>
										<Input
											id='rate'
											type='number'
											placeholder='350'
											value={formData.hourlyRate}
											onChange={(e) =>
												updateField({ hourlyRate: e.target.value })
											}
										/>
										<p className='text-xs text-muted-foreground'>
											Set a competitive rate based on your experience
										</p>
									</div>

									<div className='space-y-2'>
										<label
											htmlFor='bio'
											className='text-sm font-medium text-foreground'>
											Short bio
										</label>
										<textarea
											id='bio'
											rows={4}
											value={formData.bio}
											onChange={(e) => updateField({ bio: e.target.value })}
											className='w-full p-2 rounded border border-border text-sm'
											placeholder='Briefly describe your experience, skills and specialties'
										/>
										<p className='text-xs text-muted-foreground'>
											This appears on your profile and helps customers choose
											you
										</p>
									</div>

									<div className='grid grid-cols-2 gap-3'>
										<div className='space-y-2'>
											<label
												htmlFor='experience'
												className='text-sm font-medium text-foreground'>
												Experience (years)
											</label>
											<Input
												id='experience'
												type='number'
												placeholder='5'
												value={formData.experienceYears}
												onChange={(e) =>
													updateField({ experienceYears: e.target.value })
												}
											/>
										</div>

										<div className='space-y-2'>
											<label
												htmlFor='availability'
												className='text-sm font-medium text-foreground'>
												Availability
											</label>
											<select
												id='availability'
												className='w-full rounded border p-2'
												value={formData.availability}
												onChange={(e) =>
													updateField({ availability: e.target.value })
												}>
												<option value='available'>Available</option>
												<option value='busy'>Busy</option>
												<option value='offline'>Offline</option>
											</select>
										</div>
									</div>
								</CardContent>
							</Card>

							<div className='flex gap-3 mt-6'>
								<Button
									variant='outline'
									onClick={handleBack}
									className='flex-1'>
									<ArrowLeft className='h-4 w-4 mr-2' /> Back
								</Button>
								<Button
									onClick={handleNext}
									className='flex-1'
									disabled={loading || formData.servicesSelected.length === 0}>
									{loading ? "Working..." : "Complete"}{" "}
									<CheckCircle className='h-4 w-4 ml-2' />
								</Button>
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default Signup;
