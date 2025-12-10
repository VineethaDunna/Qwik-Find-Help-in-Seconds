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
	try {
		if (data?.access_token)
			localStorage.setItem("access_token", data.access_token);
		if (data?.refresh_token)
			localStorage.setItem("refresh_token", data.refresh_token);
		if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
	} catch (err) {
		console.warn("saveAuth failed:", err);
	}
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
			const resp = await fetch(`${API_URL}/api/auth/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: email.trim(), password }),
			});

			// log status for debugging
			console.log("[LOGIN] status:", resp.status, resp.statusText);

			// try parse JSON safely
			const text = await resp.text();
			let json;
			try {
				json = text ? JSON.parse(text) : null;
			} catch (parseErr) {
				console.error("[LOGIN] non-json response:", text);
				return toast("Server returned unexpected response. Check console.");
			}

			console.log("[LOGIN] body:", json);

			if (!resp.ok || !json?.success) {
				const msg =
					json?.message ||
					(json?.errors ? JSON.stringify(json.errors) : "Login failed");
				return toast(msg);
			}

			// save tokens
			saveAuth(json.data ?? json);

			// optional: verify the token by calling /api/auth/me
			try {
				const verify = await fetch(`${API_URL}/api/auth/me`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${
							localStorage.getItem("access_token") ?? ""
						}`,
					},
				});
				console.log("[LOGIN] verify /me status:", verify.status);
				if (!verify.ok) {
					const vt = await verify.text();
					console.warn("[LOGIN] verify /me body:", vt);
					// still allow login flow, but show warning
					toast("Logged in but fetching profile failed (check console).");
				} else {
					const j = await verify.json();
					if (j?.data) localStorage.setItem("user", JSON.stringify(j.data));
				}
			} catch (vErr) {
				console.warn("[LOGIN] verify /me error:", vErr);
			}

			navigate("/dashboard");
		} catch (err: any) {
			console.error("[LOGIN] network error:", err);
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
