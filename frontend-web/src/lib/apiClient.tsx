// src/lib/apiClient.ts
const API_BASE = (
	import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function buildUrl(input: string) {
	// if input is absolute use it, otherwise prefix API_BASE (ensure leading slash)
	if (/^https?:\/\//i.test(input)) return input;
	return `${API_BASE}${input.startsWith("/") ? "" : "/"}${input}`;
}

function getStoredTokens() {
	return {
		accessToken: localStorage.getItem("access_token"),
		refreshToken: localStorage.getItem("refresh_token"),
	};
}

function setStoredTokens({
	accessToken,
	refreshToken,
}: {
	accessToken?: string | null;
	refreshToken?: string | null;
}) {
	if (accessToken == null) localStorage.removeItem("access_token");
	else localStorage.setItem("access_token", accessToken);
	if (refreshToken == null) localStorage.removeItem("refresh_token");
	else localStorage.setItem("refresh_token", refreshToken);
}

async function tryRefreshToken(refreshToken: string): Promise<boolean> {
	try {
		const url = buildUrl("/api/auth/refresh");
		const res = await fetch(url, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refresh_token: refreshToken }),
		});

		if (!res.ok) {
			// clear stored tokens if refresh fails
			setStoredTokens({ accessToken: null, refreshToken: null });
			console.warn("[apiClient] refresh failed", res.status);
			return false;
		}

		const j = await res.json().catch(() => ({}));
		const newAccess = j?.data?.access_token;
		const newRefresh = j?.data?.refresh_token; // optional
		if (newAccess) {
			setStoredTokens({
				accessToken: newAccess,
				refreshToken: newRefresh ?? refreshToken,
			});
			return true;
		}

		// If server didn't return a token treat as failure
		setStoredTokens({ accessToken: null, refreshToken: null });
		return false;
	} catch (err) {
		console.error("[apiClient] refresh token error", err);
		setStoredTokens({ accessToken: null, refreshToken: null });
		return false;
	}
}

/**
 * apiFetch - low level fetch wrapper
 * - input: path or full url
 * - init: fetch init
 * - attempts refresh once if 401 and refresh token present
 * RETURNS: Fetch Response (caller should call res.json() or res.text())
 */
export async function apiFetch(
	input: string,
	init: RequestInit = {}
): Promise<Response> {
	const url = buildUrl(input);
	const { accessToken, refreshToken } = getStoredTokens();

	// build headers
	const headers = new Headers(init.headers || {});
	if (!headers.get("Content-Type"))
		headers.set("Content-Type", "application/json");
	if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

	// initial request
	let res = await fetch(url, {
		credentials: "include",
		...init,
		headers,
	});

	// if 401, try refresh once
	if (res.status === 401 && refreshToken) {
		console.info("[apiClient] 401 received - attempting token refresh");
		const refreshed = await tryRefreshToken(refreshToken);
		if (refreshed) {
			const newAccess = localStorage.getItem("access_token");
			const retryHeaders = new Headers(init.headers || {});
			if (!retryHeaders.get("Content-Type"))
				retryHeaders.set("Content-Type", "application/json");
			if (newAccess) retryHeaders.set("Authorization", `Bearer ${newAccess}`);

			res = await fetch(url, {
				credentials: "include",
				...init,
				headers: retryHeaders,
			});
		}
	}

	return res;
}

/* Convenience helpers */

// login: sends credentials, stores tokens if returned
export async function loginApi(email: string, password: string) {
	const url = buildUrl("/api/auth/login");
	const res = await fetch(url, {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	});

	const j = await res.json().catch(() => ({}));
	if (j?.success && j.data) {
		if (j.data.access_token)
			localStorage.setItem("access_token", j.data.access_token);
		if (j.data.refresh_token)
			localStorage.setItem("refresh_token", j.data.refresh_token);
	}

	return j;
}

// register: sends payload, stores tokens if returned
export async function registerApi(payload: any) {
	const url = buildUrl("/api/auth/register");
	const res = await fetch(url, {
		method: "POST",
		credentials: "include",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});

	const j = await res.json().catch(() => ({}));
	if (j?.success && j.data) {
		if (j.data.access_token)
			localStorage.setItem("access_token", j.data.access_token);
		if (j.data.refresh_token)
			localStorage.setItem("refresh_token", j.data.refresh_token);
	}

	return j;
}

// fetch current user profile (/api/auth/me)
export async function getProfile() {
	try {
		const res = await apiFetch("/api/auth/me", { method: "GET" });
		if (!res.ok) {
			return null;
		}
		const j = await res.json().catch(() => null);
		return j?.data ?? null;
	} catch (err) {
		console.error("[apiClient] getProfile error", err);
		return null;
	}
}

export async function logoutLocal() {
	localStorage.removeItem("access_token");
	localStorage.removeItem("refresh_token");
}

export default apiFetch;
