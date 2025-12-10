// export type RegisterPayload = {
// 	full_name: string;
// 	email: string;
// 	password?: string; // optional for Google signup
// 	phone_number?: string;
// 	location?: string;
// 	user_type: "user" | "worker";
// 	services?: string[]; // for workers (IDs)
// 	hourly_rate?: number; // for workers
// 	google_token?: string;
// };

// export type AuthResponse = {
// 	success: boolean;
// 	message?: string;
// 	data?: {
// 		access_token?: string;
// 		refresh_token?: string;
// 		user?: any;
// 	};
// 	errors?: any;
// };

// const API_BASE = (
// 	import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
// ).replace(/\/$/, "");

// /** Helper: get bearer token from localStorage */
// function getAuthHeader() {
// 	const token = localStorage.getItem("access_token");
// 	return token ? { Authorization: `Bearer ${token}` } : {};
// }

// /** Helper: safe JSON parse */
// async function parseResponse(res: Response) {
// 	const txt = await res.text();
// 	try {
// 		return JSON.parse(txt);
// 	} catch {
// 		return txt;
// 	}
// }

// /** Generic request helper */
// async function request<T = any>(
// 	endpoint: string,
// 	options: RequestInit = {}
// ): Promise<T> {
// 	const headers: Record<string, string> = {
// 		"Content-Type": "application/json",
// 		...getAuthHeader(),
// 		...(options.headers as Record<string, string> | undefined),
// 	};

// 	const res = await fetch(`${API_BASE}${endpoint}`, {
// 		credentials: "include",
// 		...options,
// 		headers,
// 	});

// 	const body = await parseResponse(res);
// 	// return the parsed body (could be object or text)
// 	return body as T;
// }

// /* ----- Named exports used by frontend ----- */

// /** Register a new user (calls /api/auth/register) */
// export async function register(
// 	payload: RegisterPayload
// ): Promise<AuthResponse> {
// 	return request<AuthResponse>("/api/auth/register", {
// 		method: "POST",
// 		body: JSON.stringify(payload),
// 	});
// }

// /** Login */
// export async function login(
// 	email: string,
// 	password: string
// ): Promise<AuthResponse> {
// 	return request<AuthResponse>("/api/auth/login", {
// 		method: "POST",
// 		body: JSON.stringify({ email, password }),
// 	});
// }

// /** Fetch all services (returns array) */
// export async function fetchServices(): Promise<any[]> {
// 	const res = await request("/api/services", { method: "GET" });
// 	// backend returns { success: true, data: [...] }
// 	if (res && typeof res === "object" && "data" in res)
// 		return (res as any).data || [];
// 	return res || [];
// }

// /** Get current authenticated user (/api/auth/me) */
// export async function getMe(): Promise<any | null> {
// 	try {
// 		const res = await request("/api/auth/me", { method: "GET" });
// 		return res && (res as any).data ? (res as any).data : null;
// 	} catch {
// 		return null;
// 	}
// }

// /** Update user profile (PUT /api/users/profile) */
// export async function updateUserProfile(payload: Record<string, any>) {
// 	return request("/api/users/profile", {
// 		method: "PUT",
// 		body: JSON.stringify(payload),
// 	});
// }

// /** Update worker profile (PUT /api/workers/profile) */
// export async function updateWorkerProfile(payload: Record<string, any>) {
// 	return request("/api/workers/profile", {
// 		method: "PUT",
// 		body: JSON.stringify(payload),
// 	});
// }

// /** Update worker services (POST /api/workers/services) */
// export async function updateWorkerServices(serviceIds: string[]) {
// 	return request("/api/workers/services", {
// 		method: "POST",
// 		body: JSON.stringify({ service_ids: serviceIds }),
// 	});
// }

// /** Fetch workers with optional query params */
// export async function fetchWorkers(
// 	params?: Record<string, string | number | undefined>
// ) {
// 	let url = "/api/workers";
// 	if (params) {
// 		const query = new URLSearchParams(
// 			Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
// 				if (v !== undefined && v !== null) acc[k] = String(v);
// 				return acc;
// 			}, {})
// 		).toString();
// 		if (query) url += `?${query}`;
// 	}

// 	const res = await request(url, { method: "GET" });
// 	if (res && typeof res === "object" && "data" in res)
// 		return (res as any).data || [];
// 	return res || [];
// }

// /* --- default export (optional) --- */
// export default {
// 	register,
// 	login,
// 	fetchServices,
// 	getMe,
// 	updateUserProfile,
// 	updateWorkerProfile,
// 	updateWorkerServices,
// 	fetchWorkers,
// };
// src/services/api.ts
import axios from "axios";

/* =====================
   Types
===================== */

export type RegisterPayload = {
	full_name: string;
	email: string;
	password?: string; // optional for Google signup
	phone_number?: string;
	location?: string;
	user_type: "user" | "worker";
	services?: string[]; // for workers (IDs)
	hourly_rate?: number; // for workers
	google_token?: string;
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

/* =====================
   Axios instance
===================== */

const API_ROOT = (
	import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

const api = axios.create({
	baseURL: `${API_ROOT}/api`,
	headers: {
		"Content-Type": "application/json",
	},
	withCredentials: true,
});

// Attach token from localStorage (support both keys just in case)
api.interceptors.request.use((config) => {
	const token =
		localStorage.getItem("access_token") || localStorage.getItem("accessToken");

	if (token) {
		config.headers = {
			...config.headers,
			Authorization: `Bearer ${token}`,
		};
	}

	return config;
});

/* =====================
   Auth APIs (named exports)
===================== */

/** Register a new user (POST /api/auth/register) */
export async function register(
	payload: RegisterPayload
): Promise<AuthResponse> {
	const res = await api.post("/auth/register", payload);
	return res.data;
}

/** Login (POST /api/auth/login) */
export async function login(
	email: string,
	password: string
): Promise<AuthResponse> {
	const res = await api.post("/auth/login", { email, password });
	return res.data;
}

/** Get current authenticated user (/api/auth/me) */
export async function getMe(): Promise<any | null> {
	try {
		const res = await api.get("/auth/me");
		return res.data?.data ?? null;
	} catch {
		return null;
	}
}

/* =====================
   Services APIs
===================== */

/** Fetch all services (GET /api/services) */
export async function fetchServices(): Promise<any[]> {
	const res = await api.get("/services");
	const body = res.data;
	if (body && typeof body === "object" && "data" in body) {
		return (body as any).data || [];
	}
	return body || [];
}

/* =====================
   User + Worker profile APIs
===================== */

/** Update user profile (PUT /api/users/profile) */
export async function updateUserProfile(payload: Record<string, any>) {
	const res = await api.put("/users/profile", payload);
	return res.data;
}

/** Update worker profile (PUT /api/workers/profile) */
export async function updateWorkerProfile(payload: {
	hourly_rate?: number;
	experience_years?: number;
	bio?: string;
	availability_status?: string;
}) {
	const res = await api.put("/workers/profile", payload);
	return res.data;
}

/** Update worker services (POST /api/workers/services) */
export async function updateWorkerServices(serviceIds: string[]) {
	const res = await api.post("/workers/services", {
		service_ids: serviceIds,
	});
	return res.data;
}

/* =====================
   Workers listing (used on search/browse page)
===================== */

export async function fetchWorkers(
	params?: Record<string, string | number | undefined>
) {
	let cleanedParams: Record<string, string> | undefined = undefined;

	if (params) {
		cleanedParams = Object.entries(params).reduce<Record<string, string>>(
			(acc, [k, v]) => {
				if (v !== undefined && v !== null) acc[k] = String(v);
				return acc;
			},
			{}
		);
	}

	const res = await api.get("/workers", { params: cleanedParams });
	const body = res.data;
	if (body && typeof body === "object" && "data" in body) {
		return (body as any).data || [];
	}
	return body || [];
}

/* =====================
   workerApi (object style, if you want it)
===================== */

export const workerApi = {
	// Get worker profile with all details
	getMyProfile: async () => {
		const res = await api.get("/users/profile");
		return res.data;
	},

	// Get worker bookings
	getMyBookings: async (status?: string) => {
		const res = await api.get("/workers/my/bookings", {
			params: status ? { status } : {},
		});
		return res.data;
	},

	// Update worker profile
	updateProfile: async (data: {
		hourly_rate?: number;
		experience_years?: number;
		bio?: string;
		availability_status?: string;
	}) => {
		const res = await api.put("/workers/profile", data);
		return res.data;
	},

	// Update user profile
	updateUserProfile: async (data: {
		full_name?: string;
		phone_number?: string;
		location?: string;
		profile_picture?: string;
	}) => {
		const res = await api.put("/users/profile", data);
		return res.data;
	},

	// Update worker services
	updateServices: async (serviceIds: string[]) => {
		// keep payload key consistent with backend
		const res = await api.post("/workers/services", {
			service_ids: serviceIds,
		});
		return res.data;
	},

	acceptBooking: async (bookingId: string) => {
		const res = await api.put(`/bookings/${bookingId}/status`, {
			status: "confirmed",
		});
		return res.data;
	},

	// Decline booking
	declineBooking: async (bookingId: string) => {
		const res = await api.put(`/bookings/${bookingId}/status`, {
			status: "cancelled",
		});
		return res.data;
	},

	// Complete booking
	completeBooking: async (bookingId: string) => {
		const res = await api.put(`/bookings/${bookingId}/status`, {
			status: "completed",
		});
		return res.data;
	},
	// Get all services
	getAllServices: async () => {
		const res = await api.get("/services");
		return res.data;
	},
};

/* =====================
   Default export (optional)
===================== */

const apiExports = {
	register,
	login,
	getMe,
	fetchServices,
	updateUserProfile,
	updateWorkerProfile,
	updateWorkerServices,
	fetchWorkers,
	workerApi,
};

export default apiExports;
