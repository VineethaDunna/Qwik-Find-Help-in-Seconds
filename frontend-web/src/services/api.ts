// src/services/api.ts
export type RegisterPayload = {
	full_name: string;
	email: string;
	password?: string; // optional for Google signup
	phone_number?: string;
	location?: string;
	user_type: "user" | "worker";
	services?: string[]; // for workers
	hourly_rate?: number; // for workers
	google_token?: string; // if using Google signin
};

export type AuthResponse = {
	success: boolean;
	message?: string;
	data?: {
		access_token?: string;
		refresh_token?: string;
		user?: any;
	};
	errors?: any;
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request<T = any>(
	endpoint: string,
	options: RequestInit = {}
): Promise<T> {
	const res = await fetch(`${API_URL}${endpoint}`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			...(options.headers || {}),
		},
		...options,
	});

	// try parse JSON
	const text = await res.text();
	try {
		return JSON.parse(text) as T;
	} catch {
		// non-json response
		return text as unknown as T;
	}
}

export const api = {
	register: (payload: RegisterPayload) =>
		request<AuthResponse>("/api/auth/register", {
			method: "POST",
			body: JSON.stringify(payload),
		}),

	login: (email: string, password: string) =>
		request<AuthResponse>("/api/auth/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		}),

	// other helpers (optional)
	getServices: () => request("/api/services"),
};
