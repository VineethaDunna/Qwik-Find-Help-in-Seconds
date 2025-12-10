// src/pages/Profile.tsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import {
	User,
	MapPin,
	Phone,
	Mail,
	Settings,
	CreditCard,
	HelpCircle,
	LogOut,
	ChevronRight,
	Shield,
	Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/apiClient";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserProfile } from "@/services/api";

/**
 * Profile page
 * - View mode by default
 * - Click Edit => single form for editing everything
 * - Cancel => revert to view mode with original data
 * - Save => upload avatar (if changed) then call updateUserProfile -> refetch profile
 */

/* Default avatars (replace with your own assets if needed) */
const DEFAULT_AVATARS = [
	"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
	"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
];

const Profile: React.FC = () => {
	const {
		user: authUser,
		loading: authLoading,
		refreshUser,
		logout,
	} = useAuth();
	const [profile, setProfile] = useState<any | null>(null);
	const [editing, setEditing] = useState(false);
	const [saving, setSaving] = useState(false);
	const [form, setForm] = useState<any>({
		full_name: "",
		phone_number: "",
		location: "",
		email: "",
		profile_picture: "",
	});

	// file input and preview
	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const fileRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		if (!authUser && !authLoading) {
			// not logged in — redirect to login
			window.location.href = "/login";
			return;
		}
		if (authUser) fetchProfile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authUser]);

	async function fetchProfile() {
		try {
			const res = await apiFetch("/api/auth/me", { method: "GET" });
			if (!res.ok) return;
			const j = await res.json();
			const data = j.data;
			setProfile(data);
			setForm({
				full_name: data.full_name || "",
				phone_number: data.phone_number || "",
				location: data.location || "",
				email: data.email || "",
				profile_picture: data.profile_picture || "",
			});
			setAvatarPreview(null);
			setAvatarFile(null);
		} catch (err) {
			console.error("fetchProfile error", err);
		}
	}

	const beginEdit = () => {
		if (!profile) return;
		setForm({
			full_name: profile.full_name || "",
			phone_number: profile.phone_number || "",
			location: profile.location || "",
			email: profile.email || "",
			profile_picture: profile.profile_picture || "",
		});
		setAvatarPreview(null);
		setAvatarFile(null);
		setEditing(true);
	};

	const cancelEdit = () => {
		// revert state
		setForm({
			full_name: profile.full_name || "",
			phone_number: profile.phone_number || "",
			location: profile.location || "",
			email: profile.email || "",
			profile_picture: profile.profile_picture || "",
		});
		setAvatarFile(null);
		setAvatarPreview(null);
		setEditing(false);
	};

	function handleFieldChange(key: string, value: any) {
		setForm((s: any) => ({ ...s, [key]: value }));
	}

	function handleChooseDefaultAvatar(url: string) {
		setAvatarFile(null);
		setAvatarPreview(url);
		setForm((s: any) => ({ ...s, profile_picture: url }));
	}

	// handle file selection (preview + keep file)
	function handleFileSelect(f?: File | null) {
		if (!f) return;
		setAvatarFile(f);
		const localUrl = URL.createObjectURL(f);
		setAvatarPreview(localUrl);
		// DON'T store the blob url as the final profile picture — it's only for preview
		setForm((s: any) => ({ ...s, profile_picture: localUrl }));
	}

	// upload file to Supabase, return public URL or null and log details
	async function uploadAvatarToSupabase(file: File, userId?: string | number) {
		try {
			console.log("[UPLOAD] start", file.name, file.type, file.size);
			const ext = file.name.split(".").pop() || "jpg";
			// path inside the bucket (no leading slash)
			const filePath = `public/${userId || "u"}/${Date.now()}_${Math.random()
				.toString(36)
				.slice(2, 8)}.${ext}`;

			// attempt upload
			const uploadResp = await supabase.storage
				.from("avatars")
				.upload(filePath, file, { upsert: true });
			console.log("[UPLOAD] uploadResp", uploadResp);

			if (uploadResp.error) {
				console.error("[UPLOAD] supabase upload error:", uploadResp.error);
				// return null so caller knows upload failed
				return null;
			}

			// get public URL via Supabase helper (preferred)
			const { data: publicData, error: publicErr } = supabase.storage
				.from("avatars")
				.getPublicUrl(filePath);
			if (publicErr) {
				console.warn("[UPLOAD] getPublicUrl error:", publicErr);
				// fallback: construct manually (only if bucket is public)
				const fallback = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${filePath}`;
				console.warn("[UPLOAD] using fallback public url:", fallback);
				return fallback;
			}
			const publicUrl = (publicData as any)?.publicUrl;
			console.log("[UPLOAD] publicUrl:", publicUrl);
			return publicUrl || null;
		} catch (err) {
			console.error("[UPLOAD] unexpected error:", err);
			return null;
		}
	}

	// save handler: upload (if needed), then call API with a proper http(s) url
	const handleSave = async () => {
		if (!profile) return;
		setSaving(true);
		try {
			console.log("[PROFILE] handleSave begin", {
				avatarFile,
				avatarPreview,
				form,
			});

			let finalProfileUrl: string | undefined = undefined;

			// 1) If a file is selected, upload and get public URL
			if (avatarFile) {
				const uploaded = await uploadAvatarToSupabase(avatarFile, profile.id);
				if (!uploaded) {
					// upload failed — inform the user and abort save (or you can continue without image)
					alert("Avatar upload failed. Check console for details.");
					setSaving(false);
					return;
				}
				finalProfileUrl = uploaded;
			}

			// 2) If no file but user picked a default avatar (avatarPreview or form.profile_picture), ensure it is http
			if (!finalProfileUrl) {
				const candidate = avatarPreview || form.profile_picture;
				if (
					candidate &&
					typeof candidate === "string" &&
					candidate.startsWith("http")
				) {
					finalProfileUrl = candidate;
				}
			}

			// 3) build payload (only send finalProfileUrl if it's an http(s) url)
			const payload: Record<string, any> = {
				full_name: form.full_name?.trim() || undefined,
				phone_number: form.phone_number?.trim() || undefined,
				location: form.location?.trim() || undefined,
			};
			if (finalProfileUrl) payload.profile_picture = finalProfileUrl;

			console.log("[PROFILE] calling PUT /api/users/profile payload:", payload);

			const res = await apiFetch("/api/users/profile", {
				method: "PUT",
				body: JSON.stringify(payload),
			});

			console.log("[PROFILE] apiFetch response:", res);

			if (!res.ok) {
				const j = await res.json().catch(() => ({}));
				console.error("[PROFILE] update failed body:", j);
				throw new Error(j?.message || "Failed to update profile");
			}

			// success: refetch profile
			if (typeof refreshUser === "function") {
				try {
					await refreshUser();
				} catch (e) {
					console.warn("refreshUser failed", e);
				}
			}
			await fetchProfile();
			setEditing(false);
			alert("Profile updated successfully");
		} catch (err: any) {
			console.error("[PROFILE] save profile failed:", err);
			alert(err?.message || "Failed to save profile");
		} finally {
			setSaving(false);
		}
	};

	if (authLoading || !profile) {
		return (
			<div className='min-h-screen bg-background pb-20'>
				<Header showAuth={false} />
				<main className='container py-6'>
					<p>Loading profile…</p>
				</main>
				<BottomNav />
			</div>
		);
	}

	const isWorker = profile.user_type === "worker";

	return (
		<div className='min-h-screen bg-background pb-20'>
			<Header showAuth={false} />

			<main className='container py-4 md:py-6'>
				<Card className='mb-4 animate-fade-in'>
					<CardContent className='p-4'>
						{/* VIEW MODE */}
						{!editing && (
							<div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
								<div className='flex items-center gap-4 w-full md:w-auto'>
									<div className='relative'>
										<Avatar className='h-20 w-20 md:h-28 md:w-28 border-2 border-primary'>
											<AvatarImage
												src={profile.profile_picture || undefined}
												alt={profile.full_name}
											/>
											<AvatarFallback className='text-xl'>
												{profile.full_name?.charAt(0)}
											</AvatarFallback>
										</Avatar>
									</div>

									<div className='flex-1 min-w-0'>
										<div className='flex items-center gap-2'>
											<h1 className='text-lg md:text-xl font-semibold text-foreground truncate'>
												{profile.full_name}
											</h1>
											{isWorker && profile.is_verified && (
												<Shield className='h-4 w-4 text-primary' />
											)}
										</div>

										{isWorker && (
											<div className='flex items-center gap-2 mt-1 text-sm text-muted-foreground'>
												<Star className='h-4 w-4' />
												<span className='font-medium'>
													{profile.rating ?? 0}
												</span>
												<span>({profile.total_reviews ?? 0} reviews)</span>
											</div>
										)}

										<div className='mt-2 text-sm text-muted-foreground flex items-center gap-2'>
											<MapPin className='h-4 w-4' />
											<span className='truncate'>
												{profile.location || "-"}
											</span>
										</div>
									</div>
									<div className='ml-auto flex items-center gap-2'>
										<Button
											variant='outline'
											size='sm'
											onClick={() => beginEdit()}>
											Edit
										</Button>
									</div>
								</div>
							</div>
						)}

						{/* EDIT MODE: full form */}
						{editing && (
							<form
								onSubmit={(e) => {
									e.preventDefault();
									handleSave();
								}}
								className='space-y-4 w-full'>
								<div className='flex flex-col md:flex-row items-start gap-4'>
									<div className='relative'>
										<Avatar className='h-20 w-20 md:h-28 md:w-28 border-2 border-primary'>
											<AvatarImage
												src={
													avatarPreview ||
													form.profile_picture ||
													profile.profile_picture ||
													undefined
												}
												alt={form.full_name}
											/>
											<AvatarFallback className='text-xl'>
												{(form.full_name || profile.full_name || "").charAt(0)}
											</AvatarFallback>
										</Avatar>

										<button
											type='button'
											onClick={() => fileRef.current?.click()}
											className='absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md hover:scale-105 transition-transform'
											aria-label='Upload avatar'>
											<svg
												className='h-5 w-5 text-muted-foreground'
												viewBox='0 0 24 24'
												fill='none'
												stroke='currentColor'
												strokeWidth='2'>
												<path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' />
												<polyline points='7 10 12 5 17 10' />
												<line x1='12' y1='5' x2='12' y2='17' />
											</svg>
										</button>

										<input
											ref={fileRef}
											type='file'
											accept='image/*'
											className='hidden'
											onChange={(e) =>
												handleFileSelect(e.target.files?.[0] || null)
											}
										/>
									</div>

									<div className='flex-1 min-w-0 space-y-3'>
										<div>
											<label className='text-sm font-medium text-foreground'>
												Full name
											</label>
											<input
												className='w-full rounded border px-3 py-2 mt-1'
												value={form.full_name}
												onChange={(e) =>
													handleFieldChange("full_name", e.target.value)
												}
												required
											/>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
											<div>
												<label className='text-sm font-medium text-foreground'>
													Phone
												</label>
												<input
													className='w-full rounded border px-3 py-2 mt-1'
													value={form.phone_number}
													onChange={(e) =>
														handleFieldChange("phone_number", e.target.value)
													}
												/>
											</div>

											<div>
												<label className='text-sm font-medium text-foreground'>
													Location
												</label>
												<input
													className='w-full rounded border px-3 py-2 mt-1'
													value={form.location}
													onChange={(e) =>
														handleFieldChange("location", e.target.value)
													}
												/>
											</div>
										</div>

										<div>
											<label className='text-sm font-medium text-foreground'>
												Email
											</label>
											<input
												type='email'
												className='w-full rounded border px-3 py-2 mt-1'
												value={form.email}
												onChange={(e) =>
													handleFieldChange("email", e.target.value)
												}
												required
											/>
										</div>

										<div className='flex items-center gap-2 flex-wrap mt-2'>
											<div className='text-sm text-muted-foreground'>
												Or pick a default avatar:
											</div>
											<div className='flex gap-2'>
												{DEFAULT_AVATARS.map((url) => (
													<button
														key={url}
														type='button'
														onClick={() => handleChooseDefaultAvatar(url)}
														className={cn(
															"rounded-full overflow-hidden border-2 p-0 transition-transform",
															(avatarPreview || form.profile_picture) === url
																? "border-primary scale-105"
																: "border-transparent hover:scale-105"
														)}
														style={{ width: 44, height: 44 }}>
														<img
															src={url}
															alt='avatar'
															className='w-full h-full object-cover'
														/>
													</button>
												))}
											</div>
										</div>
									</div>
								</div>

								<div className='flex gap-3 justify-end'>
									<Button variant='outline' onClick={cancelEdit} type='button'>
										Cancel
									</Button>
									<Button type='submit' disabled={saving}>
										{saving ? "Saving..." : "Save"}
									</Button>
								</div>
							</form>
						)}

						{/* contact & services (shown in both modes) */}
						<div className='mt-4 pt-4 border-t border-border grid gap-3'>
							<div className='flex items-center gap-3 text-sm text-muted-foreground'>
								<Phone className='h-4 w-4' />
								<span>{profile.phone_number || "-"}</span>
							</div>

							<div className='flex items-center gap-3 text-sm text-muted-foreground'>
								<Mail className='h-4 w-4' />
								<span>{profile.email}</span>
							</div>

							{isWorker && profile.worker && (
								<div className='pt-2 border-t border-border'>
									<p className='text-sm text-muted-foreground mb-2'>Services</p>
									<div className='flex flex-wrap gap-2'>
										{(profile.services || []).map((s: any) => (
											<Badge key={s.id} variant='category'>
												{s.name}
											</Badge>
										))}
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* quick menu */}
				<div className='space-y-3'>
					<Card>
						<CardContent className='p-2'>
							<Link to='/settings' className='block'>
								<div className='flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors'>
									<div className='h-10 w-10 rounded-xl flex items-center justify-center bg-secondary'>
										<Settings className='h-5 w-5' />
									</div>
									<div className='flex-1'>
										<p className='font-medium'>Settings</p>
										<p className='text-xs text-muted-foreground'>
											Manage preferences and security
										</p>
									</div>
									<ChevronRight className='h-4 w-4 text-muted-foreground' />
								</div>
							</Link>

							<Link to='/payments' className='block mt-2'>
								<div className='flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors'>
									<div className='h-10 w-10 rounded-xl flex items-center justify-center bg-secondary'>
										<CreditCard className='h-5 w-5' />
									</div>
									<div className='flex-1'>
										<p className='font-medium'>Payments</p>
										<p className='text-xs text-muted-foreground'>
											Add or manage payment methods
										</p>
									</div>
									<ChevronRight className='h-4 w-4 text-muted-foreground' />
								</div>
							</Link>

							<div className='mt-2'>
								<div
									className='flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors'
									onClick={() => logout()}>
									<div className='h-10 w-10 rounded-xl flex items-center justify-center bg-destructive/10 text-destructive'>
										<LogOut className='h-5 w-5' />
									</div>
									<div className='flex-1'>
										<p className='font-medium text-destructive'>Log Out</p>
										<p className='text-xs text-muted-foreground'>
											Sign out of your account
										</p>
									</div>
									<ChevronRight className='h-4 w-4 text-muted-foreground' />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				<p className='text-center text-xs text-muted-foreground mt-6'>
					QuickConnect v1.0.0
				</p>
			</main>

			<BottomNav />
		</div>
	);
};

export default Profile;
