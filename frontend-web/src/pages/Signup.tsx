// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent } from '@/components/ui/card';
// import Header from '@/components/layout/Header';
// import { User, Briefcase, ArrowRight, ArrowLeft, Mail, Lock, Phone, MapPin, CheckCircle, Plus, X } from 'lucide-react';
// import { Link, useNavigate } from 'react-router-dom';
// import { cn } from '@/lib/utils';

// type Role = 'user' | 'worker' | null;

// interface StepProps {
//   currentStep: number;
//   totalSteps: number;
// }

// const ProgressIndicator = ({ currentStep, totalSteps }: StepProps) => {
//   return (
//     <div className="flex items-center justify-center gap-2 mb-8">
//       {Array.from({ length: totalSteps }).map((_, index) => (
//         <div
//           key={index}
//           className={cn(
//             "h-2 rounded-full transition-all duration-300",
//             index < currentStep
//               ? "w-8 bg-primary"
//               : index === currentStep
//               ? "w-8 bg-primary/50"
//               : "w-2 bg-border"
//           )}
//         />
//       ))}
//     </div>
//   );
// };

// const Signup = () => {
//   const [step, setStep] = useState(0);
//   const [role, setRole] = useState<Role>(null);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     phone: '',
//     location: '',
//     services: [] as string[],
//     hourlyRate: '',
//     customService: '',
//   });
//   const [showCustomInput, setShowCustomInput] = useState(false);
//   const navigate = useNavigate();

//   const totalSteps = role === 'worker' ? 3 : 2;

//   const handleNext = () => {
//     if (step < totalSteps - 1) {
//       setStep(step + 1);
//     } else {
//       // Complete signup - navigate to appropriate dashboard
//       navigate('/dashboard');
//     }
//   };

//   const handleBack = () => {
//     if (step > 0) {
//       setStep(step - 1);
//     }
//   };

//   const serviceOptions = [
//     'Carpenter', 'Electrician', 'Plumber', 'Driver',
//     'Cleaner', 'Beauty', 'Tailor', 'Painter',
//     'Mechanic', 'Gardener', 'Cook', 'Tutor'
//   ];

//   const handleAddCustomService = () => {
//     if (formData.customService.trim() && !formData.services.includes(formData.customService.trim())) {
//       setFormData({
//         ...formData,
//         services: [...formData.services, formData.customService.trim()],
//         customService: '',
//       });
//       setShowCustomInput(false);
//     }
//   };

//   const handleRemoveService = (service: string) => {
//     setFormData({
//       ...formData,
//       services: formData.services.filter((s) => s !== service),
//     });
//   };

//   const toggleService = (service: string) => {
//     if (formData.services.includes(service)) {
//       handleRemoveService(service);
//     } else {
//       setFormData({
//         ...formData,
//         services: [...formData.services, service],
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Header showAuth={false} />

//       <main className="container py-8 md:py-12">
//         <div className="mx-auto max-w-md animate-fade-in">
//           <ProgressIndicator currentStep={step} totalSteps={totalSteps} />

//           {/* Step 0: Role Selection */}
//           {step === 0 && (
//             <div className="text-center">
//               <h1 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
//                 Welcome to QuickConnect
//               </h1>
//               <p className="text-muted-foreground mb-8">
//                 How would you like to use the platform?
//               </p>

//               <div className="grid gap-4">
//                 <Card
//                   className={cn(
//                     "cursor-pointer transition-all duration-200",
//                     role === 'user' && "ring-2 ring-primary border-primary"
//                   )}
//                   onClick={() => setRole('user')}
//                 >
//                   <CardContent className="flex items-center gap-4 p-5">
//                     <div className={cn(
//                       "flex h-12 w-12 items-center justify-center rounded-xl",
//                       role === 'user' ? "bg-primary text-primary-foreground" : "bg-secondary"
//                     )}>
//                       <User className="h-6 w-6" />
//                     </div>
//                     <div className="text-left">
//                       <h3 className="font-semibold text-foreground">I need help</h3>
//                       <p className="text-sm text-muted-foreground">Find and book skilled helpers</p>
//                     </div>
//                     {role === 'user' && (
//                       <CheckCircle className="ml-auto h-5 w-5 text-primary" />
//                     )}
//                   </CardContent>
//                 </Card>

//                 <Card
//                   className={cn(
//                     "cursor-pointer transition-all duration-200",
//                     role === 'worker' && "ring-2 ring-primary border-primary"
//                   )}
//                   onClick={() => setRole('worker')}
//                 >
//                   <CardContent className="flex items-center gap-4 p-5">
//                     <div className={cn(
//                       "flex h-12 w-12 items-center justify-center rounded-xl",
//                       role === 'worker' ? "bg-primary text-primary-foreground" : "bg-secondary"
//                     )}>
//                       <Briefcase className="h-6 w-6" />
//                     </div>
//                     <div className="text-left">
//                       <h3 className="font-semibold text-foreground">I offer services</h3>
//                       <p className="text-sm text-muted-foreground">Connect with customers and earn</p>
//                     </div>
//                     {role === 'worker' && (
//                       <CheckCircle className="ml-auto h-5 w-5 text-primary" />
//                     )}
//                   </CardContent>
//                 </Card>
//               </div>

//               <Button
//                 className="w-full mt-6"
//                 size="lg"
//                 disabled={!role}
//                 onClick={handleNext}
//               >
//                 Continue
//                 <ArrowRight className="h-4 w-4 ml-2" />
//               </Button>

//               <p className="mt-6 text-center text-sm text-muted-foreground">
//                 Already have an account?{' '}
//                 <Link to="/" className="font-medium text-primary hover:underline">
//                   Log in
//                 </Link>
//               </p>
//             </div>
//           )}

//           {/* Step 1: Basic Info */}
//           {step === 1 && (
//             <div>
//               <h1 className="text-xl md:text-2xl font-semibold text-foreground mb-2 text-center">
//                 Create your account
//               </h1>
//               <p className="text-muted-foreground mb-8 text-center">
//                 Tell us a bit about yourself
//               </p>

//               <Card>
//                 <CardContent className="p-6 space-y-4">
//                   <div className="space-y-2">
//                     <label htmlFor="name" className="text-sm font-medium text-foreground">
//                       Full name
//                     </label>
//                     <Input
//                       id="name"
//                       placeholder="John Doe"
//                       value={formData.name}
//                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <label htmlFor="email" className="text-sm font-medium text-foreground">
//                       Email
//                     </label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="email"
//                         type="email"
//                         placeholder="you@example.com"
//                         value={formData.email}
//                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                         className="pl-10"
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label htmlFor="password" className="text-sm font-medium text-foreground">
//                       Password
//                     </label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="password"
//                         type="password"
//                         placeholder="••••••••"
//                         value={formData.password}
//                         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                         className="pl-10"
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label htmlFor="phone" className="text-sm font-medium text-foreground">
//                       Phone number
//                     </label>
//                     <div className="relative">
//                       <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="phone"
//                         type="tel"
//                         placeholder="+91 98765 43210"
//                         value={formData.phone}
//                         onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                         className="pl-10"
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label htmlFor="location" className="text-sm font-medium text-foreground">
//                       Location
//                     </label>
//                     <div className="relative">
//                       <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         id="location"
//                         placeholder="Mumbai, India"
//                         value={formData.location}
//                         onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//                         className="pl-10"
//                       />
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="flex gap-3 mt-6">
//                 <Button variant="outline" onClick={handleBack} className="flex-1">
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Back
//                 </Button>
//                 <Button onClick={handleNext} className="flex-1">
//                   {role === 'user' ? 'Complete' : 'Continue'}
//                   <ArrowRight className="h-4 w-4 ml-2" />
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Step 2: Worker Services (only for workers) */}
//           {step === 2 && role === 'worker' && (
//             <div>
//               <h1 className="text-xl md:text-2xl font-semibold text-foreground mb-2 text-center">
//                 Your services
//               </h1>
//               <p className="text-muted-foreground mb-8 text-center">
//                 What services do you offer?
//               </p>

//               <Card>
//                 <CardContent className="p-6 space-y-6">
//                   <div className="space-y-3">
//                     <label className="text-sm font-medium text-foreground">
//                       Select your services
//                     </label>

//                     {/* Selected custom services */}
//                     {formData.services.filter(s => !serviceOptions.includes(s)).length > 0 && (
//                       <div className="flex flex-wrap gap-2 mb-2">
//                         {formData.services
//                           .filter(s => !serviceOptions.includes(s))
//                           .map((service) => (
//                             <div
//                               key={service}
//                               className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
//                             >
//                               {service}
//                               <button
//                                 onClick={() => handleRemoveService(service)}
//                                 className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
//                               >
//                                 <X className="h-3 w-3" />
//                               </button>
//                             </div>
//                           ))}
//                       </div>
//                     )}

//                     {/* Predefined services */}
//                     <div className="flex flex-wrap gap-2">
//                       {serviceOptions.map((service) => (
//                         <button
//                           key={service}
//                           type="button"
//                           className={cn(
//                             "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
//                             formData.services.includes(service)
//                               ? "bg-primary text-primary-foreground"
//                               : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
//                           )}
//                           onClick={() => toggleService(service)}
//                         >
//                           {service}
//                         </button>
//                       ))}

//                       {/* Other / Custom Service Button */}
//                       {!showCustomInput ? (
//                         <button
//                           type="button"
//                           className="px-4 py-2 rounded-lg text-sm font-medium border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200 flex items-center gap-1"
//                           onClick={() => setShowCustomInput(true)}
//                         >
//                           <Plus className="h-4 w-4" />
//                           Other
//                         </button>
//                       ) : (
//                         <div className="flex items-center gap-2 w-full mt-2">
//                           <Input
//                             placeholder="Type your service..."
//                             value={formData.customService}
//                             onChange={(e) => setFormData({ ...formData, customService: e.target.value })}
//                             onKeyDown={(e) => {
//                               if (e.key === 'Enter') {
//                                 e.preventDefault();
//                                 handleAddCustomService();
//                               }
//                             }}
//                             className="flex-1"
//                             autoFocus
//                           />
//                           <Button
//                             size="sm"
//                             onClick={handleAddCustomService}
//                             disabled={!formData.customService.trim()}
//                           >
//                             Add
//                           </Button>
//                           <Button
//                             size="sm"
//                             variant="ghost"
//                             onClick={() => {
//                               setShowCustomInput(false);
//                               setFormData({ ...formData, customService: '' });
//                             }}
//                           >
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       )}
//                     </div>

//                     <p className="text-xs text-muted-foreground">
//                       Select one or more services, or add your own
//                     </p>
//                   </div>

//                   <div className="space-y-2">
//                     <label htmlFor="rate" className="text-sm font-medium text-foreground">
//                       Hourly rate (₹)
//                     </label>
//                     <Input
//                       id="rate"
//                       type="number"
//                       placeholder="350"
//                       value={formData.hourlyRate}
//                       onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
//                     />
//                     <p className="text-xs text-muted-foreground">
//                       Set a competitive rate based on your experience
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <div className="flex gap-3 mt-6">
//                 <Button variant="outline" onClick={handleBack} className="flex-1">
//                   <ArrowLeft className="h-4 w-4 mr-2" />
//                   Back
//                 </Button>
//                 <Button
//                   onClick={handleNext}
//                   className="flex-1"
//                   disabled={formData.services.length === 0}
//                 >
//                   Complete
//                   <CheckCircle className="h-4 w-4 ml-2" />
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Signup;
// src/pages/Signup.tsx  (replace your current component)
import { useState } from "react";
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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { api, RegisterPayload } from "@/services/api";

type Role = "user" | "worker" | null;

interface StepProps {
	currentStep: number;
	totalSteps: number;
}

const ProgressIndicator = ({ currentStep, totalSteps }: StepProps) => {
	return (
		<div className='flex items-center justify-center gap-2 mb-8'>
			{Array.from({ length: totalSteps }).map((_, index) => (
				<div
					key={index}
					className={cn(
						"h-2 rounded-full transition-all duration-300",
						index < currentStep
							? "w-8 bg-primary"
							: index === currentStep
							? "w-8 bg-primary/50"
							: "w-2 bg-border"
					)}
				/>
			))}
		</div>
	);
};

const Signup = () => {
	const [step, setStep] = useState(0);
	const [role, setRole] = useState<Role>(null);
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<string | null>(null);
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		phone: "",
		location: "",
		services: [] as string[],
		hourlyRate: "",
		customService: "",
	});
	const [showCustomInput, setShowCustomInput] = useState(false);

	const totalSteps = role === "worker" ? 3 : 2;

	const serviceOptions = [
		"Carpenter",
		"Electrician",
		"Plumber",
		"Driver",
		"Cleaner",
		"Beauty",
		"Tailor",
		"Painter",
		"Mechanic",
		"Gardener",
		"Cook",
		"Tutor",
	];

	const handleNext = () => {
		setErrors(null);
		if (step === 0 && !role) {
			setErrors("Please choose a role.");
			return;
		}
		if (step === 1) {
			// basic validation for step 1
			if (!formData.name.trim()) return setErrors("Full name is required.");
			if (!/^\S+@\S+\.\S+$/.test(formData.email))
				return setErrors("Valid email is required.");
			if (!formData.password || formData.password.length < 6)
				return setErrors("Password must be at least 6 characters.");
		}
		if (step < totalSteps - 1) setStep(step + 1);
		else handleSubmit();
	};

	const handleBack = () => {
		setErrors(null);
		if (step > 0) setStep(step - 1);
	};

	const toggleService = (service: string) => {
		if (formData.services.includes(service)) {
			setFormData({
				...formData,
				services: formData.services.filter((s) => s !== service),
			});
		} else {
			setFormData({ ...formData, services: [...formData.services, service] });
		}
	};

	const handleAddCustomService = () => {
		const s = formData.customService.trim();
		if (!s) return;
		if (!formData.services.includes(s)) {
			setFormData({
				...formData,
				services: [...formData.services, s],
				customService: "",
			});
			setShowCustomInput(false);
		}
	};

	const handleSubmit = async () => {
		setErrors(null);
		setLoading(true);

		// prepare payload
		const payload: RegisterPayload = {
			full_name: formData.name.trim(),
			email: formData.email.trim(),
			password: formData.password, // backend must accept plain password
			phone_number: formData.phone.trim() || undefined,
			location: formData.location.trim() || undefined,
			user_type: role as "user" | "worker",
		};

		if (role === "worker") {
			if (!formData.services.length) {
				setLoading(false);
				return setErrors("Please select at least one service.");
			}
			payload.services = formData.services;
			const rate = Number(formData.hourlyRate);
			payload.hourly_rate =
				Number.isFinite(rate) && rate > 0 ? rate : undefined;
		}

		try {
			const res = await api.register(payload);
			if (!res) throw new Error("No response from server");

			if (res.success) {
				// store tokens if provided
				if (res.data?.access_token)
					localStorage.setItem("access_token", res.data.access_token);
				if (res.data?.refresh_token)
					localStorage.setItem("refresh_token", res.data.refresh_token);
				if (res.data?.user)
					localStorage.setItem("user", JSON.stringify(res.data.user));

				// optional: toast success
				navigate("/dashboard");
			} else {
				// show server message or validation errors
				setErrors(res.message || JSON.stringify(res.errors) || "Signup failed");
			}
		} catch (err: any) {
			setErrors(err?.message || "Network error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-background'>
			<Header showAuth={false} />

			<main className='container py-8 md:py-12'>
				<div className='mx-auto max-w-md animate-fade-in'>
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

							<div className='grid gap-4'>
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
											onChange={(e) =>
												setFormData({ ...formData, name: e.target.value })
											}
										/>
									</div>

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
													setFormData({ ...formData, email: e.target.value })
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
													setFormData({ ...formData, password: e.target.value })
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
													setFormData({ ...formData, phone: e.target.value })
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
													setFormData({ ...formData, location: e.target.value })
												}
												className='pl-10'
											/>
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

					{/* STEP 2 - Worker Services */}
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
											{serviceOptions.map((service) => (
												<button
													key={service}
													type='button'
													className={cn(
														"px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
														formData.services.includes(service)
															? "bg-primary text-primary-foreground"
															: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
													)}
													onClick={() => toggleService(service)}>
													{service}
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
														value={formData.customService}
														onChange={(e) =>
															setFormData({
																...formData,
																customService: e.target.value,
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
														disabled={!formData.customService.trim()}>
														Add
													</Button>
													<Button
														size='sm'
														variant='ghost'
														onClick={() => {
															setShowCustomInput(false);
															setFormData({ ...formData, customService: "" });
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
												setFormData({ ...formData, hourlyRate: e.target.value })
											}
										/>
										<p className='text-xs text-muted-foreground'>
											Set a competitive rate based on your experience
										</p>
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
									disabled={loading || formData.services.length === 0}>
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
