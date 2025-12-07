// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import Header from '@/components/layout/Header';
// // import HowItWorks from '@/components/landing/HowItWorks';
// // import { Zap, Shield, Clock, Mail, Lock } from 'lucide-react';
// // import { Link } from 'react-router-dom';
// // import { useState } from 'react';

// // const Index = () => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');

// //   return (
// //     <div className="min-h-screen bg-background">
// //       <Header showAuth={false} />

// //       <main className="container py-8 md:py-12">
// //         <div className="mx-auto max-w-md animate-fade-in-up">
// //           {/* Hero Section */}
// //           <div className="text-center mb-8">
// //             <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-foreground mb-4">
// //               <Zap className="h-4 w-4 text-accent" />
// //               <span>Fast & Reliable Services</span>
// //             </div>
// //             <h1 className="text-display font-semibold text-foreground mb-3">
// //               Find help,<br />in seconds
// //             </h1>
// //             <p className="text-muted-foreground">
// //               Connect with verified local helpers for all your daily needs
// //             </p>
// //           </div>

// //           {/* Login Form */}
// //           <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
// //             <Button variant="google" className="w-full mb-4" size="lg">
// //               <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
// //                 <path
// //                   fill="currentColor"
// //                   d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
// //                 />
// //                 <path
// //                   fill="currentColor"
// //                   d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
// //                 />
// //                 <path
// //                   fill="currentColor"
// //                   d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
// //                 />
// //                 <path
// //                   fill="currentColor"
// //                   d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
// //                 />
// //               </svg>
// //               Continue with Google
// //             </Button>

// //             <div className="relative my-6">
// //               <div className="absolute inset-0 flex items-center">
// //                 <span className="w-full border-t border-border" />
// //               </div>
// //               <div className="relative flex justify-center text-xs uppercase">
// //                 <span className="bg-card px-2 text-muted-foreground">or</span>
// //               </div>
// //             </div>

// //             <form className="space-y-4">
// //               <div className="space-y-2">
// //                 <label htmlFor="email" className="text-sm font-medium text-foreground">
// //                   Email
// //                 </label>
// //                 <div className="relative">
// //                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// //                   <Input
// //                     id="email"
// //                     type="email"
// //                     placeholder="you@example.com"
// //                     value={email}
// //                     onChange={(e) => setEmail(e.target.value)}
// //                     className="pl-10"
// //                   />
// //                 </div>
// //               </div>
// //               <div className="space-y-2">
// //                 <label htmlFor="password" className="text-sm font-medium text-foreground">
// //                   Password
// //                 </label>
// //                 <div className="relative">
// //                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// //                   <Input
// //                     id="password"
// //                     type="password"
// //                     placeholder="••••••••"
// //                     value={password}
// //                     onChange={(e) => setPassword(e.target.value)}
// //                     className="pl-10"
// //                   />
// //                 </div>
// //               </div>
// //               <Button type="submit" className="w-full" size="lg">
// //                 Log in
// //               </Button>
// //             </form>

// //             <p className="mt-4 text-center text-sm text-muted-foreground">
// //               Don't have an account?{' '}
// //               <Link to="/signup" className="font-medium text-primary hover:underline">
// //                 Create account
// //               </Link>
// //             </p>
// //           </div>

// //           {/* Trust badges */}
// //           <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
// //             <div className="flex items-center gap-1.5">
// //               <Shield className="h-4 w-4 text-primary" />
// //               <span>Verified helpers</span>
// //             </div>
// //             <div className="flex items-center gap-1.5">
// //               <Clock className="h-4 w-4 text-primary" />
// //               <span>Fast response</span>
// //             </div>
// //           </div>

// //           {/* How it works */}
// //           <HowItWorks />
// //         </div>
// //       </main>
// //     </div>
// //   );
// // };

// // export default Index;
// // src/pages/Index.tsx
// import { useEffect, useState, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import Header from "@/components/layout/Header";
// import HowItWorks from "@/components/landing/HowItWorks";
// import { Zap, Shield, Clock, Mail, Lock } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// const GOOGLE_CLIENT_ID =
// 	"617105756056-b59f3m7mcu3nrgof40ltatl7o20gbvev.apps.googleusercontent.com"; // required for Google sign-in

// const saveAuth = (data: any) => {
// 	if (data?.access_token)
// 		localStorage.setItem("access_token", data.access_token);
// 	if (data?.refresh_token)
// 		localStorage.setItem("refresh_token", data.refresh_token);
// 	if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
// };

// const Index = () => {
// 	const navigate = useNavigate();

// 	const [email, setEmail] = useState("");
// 	const [password, setPassword] = useState("");

// 	const [loading, setLoading] = useState(false);
// 	const [error, setError] = useState<string | null>(null);
// 	const [googleLoading, setGoogleLoading] = useState(false);

// 	// Basic toast-ish helper
// 	const toast = useCallback((msg: string) => {
// 		setError(msg);
// 		setTimeout(() => setError(null), 4500);
// 	}, []);

// 	// Email/password login
// 	const handleSubmit = async (e: React.FormEvent) => {
// 		e.preventDefault();
// 		setError(null);

// 		if (!email || !password) {
// 			toast("Email and password are required.");
// 			return;
// 		}

// 		setLoading(true);
// 		try {
// 			const res = await fetch(`${API_URL}/api/auth/login`, {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ email: email.trim(), password }),
// 			});

// 			const json = await res.json();
// 			if (!res.ok || !json.success) {
// 				toast(json.message || "Login failed");
// 				return;
// 			}

// 			saveAuth(json.data ?? json);
// 			navigate("/dashboard");
// 		} catch (err: any) {
// 			toast(err?.message || "Network error");
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	// Google Sign-in: load GSI script and initialize
// 	useEffect(() => {
// 		if (!GOOGLE_CLIENT_ID) {
// 			console.warn("VITE_GOOGLE_CLIENT_ID not found — Google Sign-In disabled");
// 			return;
// 		}

// 		// avoid loading twice
// 		if ((window as any).google && (window as any).google.accounts) {
// 			return;
// 		}

// 		const id = "google-identity-script";
// 		if (document.getElementById(id)) return;

// 		const script = document.createElement("script");
// 		script.id = id;
// 		script.src = "https://accounts.google.com/gsi/client";
// 		script.async = true;
// 		script.defer = true;
// 		document.head.appendChild(script);

// 		return () => {
// 			// don't remove the script on unmount — leave it cached for other pages
// 		};
// 	}, []);

// 	// Handler called by Google Identity Services after sign-in
// 	const handleGoogleCredential = async (credentialResponse: any) => {
// 		// credentialResponse has { credential, clientId } typically
// 		const token = credentialResponse?.credential;
// 		if (!token) {
// 			toast("Google sign-in failed (no credential returned)");
// 			setGoogleLoading(false);
// 			return;
// 		}

// 		setGoogleLoading(true);
// 		try {
// 			const res = await fetch(`${API_URL}/api/auth/google`, {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ credential: token, user_type: "user" }), // default to user; you can prompt user_type on UI
// 			});
// 			const json = await res.json();
// 			if (!res.ok || !json.success) {
// 				toast(json.message || "Google authentication failed");
// 				return;
// 			}

// 			saveAuth(json.data ?? json);
// 			navigate("/dashboard");
// 		} catch (err: any) {
// 			toast(err?.message || "Network error during Google login");
// 		} finally {
// 			setGoogleLoading(false);
// 		}
// 	};

// 	// Trigger GSI prompt or popup — we use the one-tap / popup flow if available
// 	const handleGoogleClick = () => {
// 		setError(null);
// 		if (!GOOGLE_CLIENT_ID) {
// 			toast("Google client ID not configured.");
// 			return;
// 		}

// 		// If google.accounts is ready, initialize & prompt
// 		const g = (window as any).google;
// 		if (g && g.accounts && g.accounts.id) {
// 			try {
// 				// initialize (idempotent)
// 				g.accounts.id.initialize({
// 					client_id: GOOGLE_CLIENT_ID,
// 					callback: handleGoogleCredential,
// 				});

// 				// show the One Tap prompt. For button-style flow, use 'prompt' as well.
// 				g.accounts.id.prompt(); // shows One Tap or fallback popup

// 				// Optionally, render a button in a container (not necessary here)
// 				// g.accounts.id.renderButton(container, { theme: 'outline' })

// 				// If you want a manual popup-like auth, you could open a new window pointing to your own /auth/google redirect flow.
// 			} catch (err: any) {
// 				console.error("GSI init error", err);
// 				toast("Google Sign-In initialization failed");
// 			}
// 		} else {
// 			// fallback: open Google's OAuth consent in a new window pointing to backend /oauth endpoint (if you implemented)
// 			// or show an error.
// 			toast("Google SDK not loaded yet. Try again in a second.");
// 		}
// 	};

// 	return (
// 		<div className='min-h-screen bg-background'>
// 			<Header showAuth={false} />

// 			<main className='container py-8 md:py-12'>
// 				<div className='mx-auto max-w-md animate-fade-in-up'>
// 					{/* Hero Section */}
// 					<div className='text-center mb-8'>
// 						<div className='inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-foreground mb-4'>
// 							<Zap className='h-4 w-4 text-accent' />
// 							<span>Fast & Reliable Services</span>
// 						</div>
// 						<h1 className='text-display font-semibold text-foreground mb-3'>
// 							Find help,
// 							<br />
// 							in seconds
// 						</h1>
// 						<p className='text-muted-foreground'>
// 							Connect with verified local helpers for all your daily needs
// 						</p>
// 					</div>

// 					{/* Login Card */}
// 					<div className='bg-card rounded-2xl border border-border p-6 shadow-card'>
// 						{/* place inside the Login Card, above or instead of current custom button */}
// 						<div id='gsi-button' className='mb-4'></div>

// 						<Button
// 							variant='google'
// 							className='w-full mb-4 flex items-center justify-center gap-2'
// 							size='lg'
// 							onClick={handleGoogleClick}
// 							disabled={googleLoading}>
// 							<svg className='h-5 w-5' viewBox='0 0 24 24' aria-hidden>
// 								<path
// 									fill='currentColor'
// 									d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
// 								/>
// 								<path
// 									fill='currentColor'
// 									d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
// 								/>
// 								<path
// 									fill='currentColor'
// 									d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
// 								/>
// 								<path
// 									fill='currentColor'
// 									d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
// 								/>
// 							</svg>
// 							{googleLoading ? "Signing in..." : "Continue with Google"}
// 						</Button>

// 						<div className='relative my-6'>
// 							<div className='absolute inset-0 flex items-center'>
// 								<span className='w-full border-t border-border' />
// 							</div>
// 							<div className='relative flex justify-center text-xs uppercase'>
// 								<span className='bg-card px-2 text-muted-foreground'>or</span>
// 							</div>
// 						</div>

// 						<form className='space-y-4' onSubmit={handleSubmit}>
// 							<div className='space-y-2'>
// 								<label
// 									htmlFor='email'
// 									className='text-sm font-medium text-foreground'>
// 									Email
// 								</label>
// 								<div className='relative'>
// 									<Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
// 									<Input
// 										id='email'
// 										type='email'
// 										placeholder='you@example.com'
// 										value={email}
// 										onChange={(e) => setEmail(e.target.value)}
// 										className='pl-10'
// 									/>
// 								</div>
// 							</div>

// 							<div className='space-y-2'>
// 								<label
// 									htmlFor='password'
// 									className='text-sm font-medium text-foreground'>
// 									Password
// 								</label>
// 								<div className='relative'>
// 									<Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
// 									<Input
// 										id='password'
// 										type='password'
// 										placeholder='••••••••'
// 										value={password}
// 										onChange={(e) => setPassword(e.target.value)}
// 										className='pl-10'
// 									/>
// 								</div>
// 							</div>

// 							<Button
// 								type='submit'
// 								className='w-full'
// 								size='lg'
// 								disabled={loading}>
// 								{loading ? "Logging in..." : "Log in"}
// 							</Button>
// 						</form>

// 						<p className='mt-4 text-center text-sm text-muted-foreground'>
// 							Don't have an account?{" "}
// 							<Link
// 								to='/signup'
// 								className='font-medium text-primary hover:underline'>
// 								Create account
// 							</Link>
// 						</p>

// 						{error && (
// 							<div className='mt-4 text-sm text-red-600 bg-red-50 p-3 rounded'>
// 								{error}
// 							</div>
// 						)}
// 					</div>

// 					{/* Trust badges */}
// 					<div className='mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground'>
// 						<div className='flex items-center gap-1.5'>
// 							<Shield className='h-4 w-4 text-primary' />
// 							<span>Verified helpers</span>
// 						</div>
// 						<div className='flex items-center gap-1.5'>
// 							<Clock className='h-4 w-4 text-primary' />
// 							<span>Fast response</span>
// 						</div>
// 					</div>

// 					{/* How it works */}
// 					<HowItWorks />
// 				</div>
// 			</main>
// 		</div>
// 	);
// };

// export default Index;

// src/pages/Index.tsx
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import HowItWorks from "@/components/landing/HowItWorks";
import { Zap, Shield, Clock, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID; // MUST match Google Cloud

const saveAuth = (data: any) => {
	if (data?.access_token)
		localStorage.setItem("access_token", data.access_token);
	if (data?.refresh_token)
		localStorage.setItem("refresh_token", data.refresh_token);
	if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
};

const Index = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [googleLoading, setGoogleLoading] = useState(false);

	const toast = useCallback((msg: string) => {
		setError(msg);
		setTimeout(() => setError(null), 4500);
	}, []);

	// EMAIL / PASSWORD LOGIN
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		if (!email || !password) return toast("Email and password required");
		setLoading(true);
		try {
			const res = await fetch(`${API_URL}/api/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: email.trim(), password }),
			});
			const json = await res.json();
			if (!res.ok || !json.success)
				return toast(json.message || "Login failed");
			saveAuth(json.data ?? json);
			navigate("/dashboard");
		} catch (err: any) {
			toast(err?.message || "Network error");
		} finally {
			setLoading(false);
		}
	};

	// LOAD GSI SCRIPT & INIT
	useEffect(() => {
		if (!GOOGLE_CLIENT_ID) {
			console.warn("Missing VITE_GOOGLE_CLIENT_ID — Google Sign-In disabled");
			return;
		}

		const id = "google-identity-script";
		if (document.getElementById(id)) {
			if ((window as any).google?.accounts?.id) initGSI();
			return;
		}

		const script = document.createElement("script");
		script.id = id;
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;
		script.onload = () => initGSI();
		script.onerror = () => {
			console.error("Failed to load Google Identity script");
			toast("Failed to load Google Sign-In SDK");
		};
		document.head.appendChild(script);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Initialize GSI and render official button into #gsi-button
	const initGSI = () => {
		const g = (window as any).google;
		if (!g?.accounts?.id) {
			console.warn("google.accounts.id not available yet");
			return;
		}

		try {
			g.accounts.id.initialize({
				client_id: GOOGLE_CLIENT_ID,
				callback: handleGoogleCredential,
				// ux_mode: "popup" // optional: popup vs default (one-tap)
			});

			// Render Google button into container
			const container = document.getElementById("gsi-button");
			if (container) {
				// clear previous content if any
				container.innerHTML = "";
				g.accounts.id.renderButton(container, {
					theme: "outline",
					size: "large",
				});
			}

			// Optionally show One Tap after render (commented out)
			// g.accounts.id.prompt();
		} catch (err) {
			console.error("GSI init error", err);
			toast("Google Sign-In initialization failed");
		}
	};

	// GSI callback: receives credential response
	const handleGoogleCredential = async (credentialResponse: any) => {
		console.log("GSI response:", credentialResponse);
		const token = credentialResponse?.credential;
		if (!token) {
			toast("Google credential not returned");
			return;
		}

		setGoogleLoading(true);
		try {
			const res = await fetch(`${API_URL}/api/auth/google`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ credential: token, user_type: "user" }),
			});
			const json = await res.json();
			if (!res.ok || !json.success) {
				console.error("/api/auth/google error:", json);
				toast(json.message || "Google authentication failed");
				return;
			}
			saveAuth(json.data ?? json);
			navigate("/dashboard");
		} catch (err: any) {
			console.error("Network error during google auth", err);
			toast(err?.message || "Network error during Google login");
		} finally {
			setGoogleLoading(false);
		}
	};

	// manual click fallback: focus the one-tap/prompt or render button (we already render, but keep for safety)
	const handleGoogleClick = () => {
		setError(null);
		if (!(window as any).google?.accounts?.id)
			return toast("Google SDK not ready");
		// The rendered button handles the flow; this is a safety call to prompt one-tap:
		try {
			(window as any).google.accounts.id.prompt();
		} catch (err) {
			console.warn("prompt failed", err);
		}
	};

	return (
		<div className='min-h-screen bg-background'>
			<Header showAuth={false} />

			<main className='container py-8 md:py-12'>
				<div className='mx-auto max-w-md animate-fade-in-up'>
					{/* Hero */}
					<div className='text-center mb-8'>
						<div className='inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent-foreground mb-4'>
							<Zap className='h-4 w-4 text-accent' />
							<span>Fast & Reliable Services</span>
						</div>
						<h1 className='text-display font-semibold text-foreground mb-3'>
							Find help,
							<br />
							in seconds
						</h1>
						<p className='text-muted-foreground'>
							Connect with verified local helpers for all your daily needs
						</p>
					</div>

					{/* Login Card */}
					<div className='bg-card rounded-2xl border border-border p-6 shadow-card'>
						{/* <-- official Google button will be rendered into this div */}
						<div id='gsi-button' className='mb-4'></div>

						<div className='relative my-6'>
							<div className='absolute inset-0 flex items-center'>
								<span className='w-full border-t border-border' />
							</div>
							<div className='relative flex justify-center text-xs uppercase'>
								<span className='bg-card px-2 text-muted-foreground'>or</span>
							</div>
						</div>

						<form className='space-y-4' onSubmit={handleSubmit}>
							<div className='space-y-2'>
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
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className='pl-10'
									/>
								</div>
							</div>

							<div className='space-y-2'>
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
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className='pl-10'
									/>
								</div>
							</div>

							<Button
								type='submit'
								className='w-full'
								size='lg'
								disabled={loading}>
								{loading ? "Logging in..." : "Log in"}
							</Button>
						</form>

						<p className='mt-4 text-center text-sm text-muted-foreground'>
							Don't have an account?{" "}
							<Link
								to='/signup'
								className='font-medium text-primary hover:underline'>
								Create account
							</Link>
						</p>

						{error && (
							<div className='mt-4 text-sm text-red-600 bg-red-50 p-3 rounded'>
								{error}
							</div>
						)}
					</div>

					{/* Trust badges */}
					<div className='mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground'>
						<div className='flex items-center gap-1.5'>
							<Shield className='h-4 w-4 text-primary' />
							<span>Verified helpers</span>
						</div>
						<div className='flex items-center gap-1.5'>
							<Clock className='h-4 w-4 text-primary' />
							<span>Fast response</span>
						</div>
					</div>

					<HowItWorks />
				</div>
			</main>
		</div>
	);
};

export default Index;
