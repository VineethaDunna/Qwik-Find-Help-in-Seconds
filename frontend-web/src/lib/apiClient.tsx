// src/lib/apiClient.ts
const API_BASE = (
	import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

function getAccessToken() {
	return localStorage.getItem("access_token");
}
function getRefreshToken() {
	return localStorage.getItem("refresh_token");
}
function setAccessToken(token: string) {
	localStorage.setItem("access_token", token);
}

async function refreshAccessToken(): Promise<string | null> {
	const refresh_token = getRefreshToken();
	if (!refresh_token) return null;

	try {
		const res = await fetch(`${API_BASE}/api/auth/refresh`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refresh_token }),
		});
		if (!res.ok) return null;
		const j = await res.json();
		const newToken = j?.data?.access_token;
		if (newToken) setAccessToken(newToken);
		return newToken || null;
	} catch {
		return null;
	}
}

export async function apiFetch(
	input: string,
	init: RequestInit = {},
	retry = true
) {
	const url = input.startsWith("http")
		? input
		: `${API_BASE}${input.startsWith("/") ? "" : "/"}${input}`;
	const headers = new Headers(init.headers || {});
	const token = getAccessToken();
	if (token) headers.set("Authorization", `Bearer ${token}`);
	headers.set(
		"Content-Type",
		headers.get("Content-Type") || "application/json"
	);

	let res = await fetch(url, { ...init, headers });

	if (res.status === 401 && retry) {
		const newToken = await refreshAccessToken();
		if (newToken) {
			headers.set("Authorization", `Bearer ${newToken}`);
			res = await fetch(url, { ...init, headers });
		}
	}

	return res;
}
