// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";

export type CurrentUser = {
	id: string;
	email: string;
	full_name: string;
	phone_number?: string;
	location?: string;
	user_type: "user" | "worker";
	profile_picture?: string;
};

const AuthContext = createContext<{
	user: CurrentUser | null;
	loading: boolean;
	refreshUser: () => Promise<void>;
	logout: () => void;
} | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<CurrentUser | null>(null);
	const [loading, setLoading] = useState(true);

	const refreshUser = async () => {
		setLoading(true);
		try {
			const res = await apiFetch("/api/auth/me", { method: "GET" });
			if (!res.ok) {
				setUser(null);
			} else {
				const j = await res.json();
				setUser(j.data);
			}
		} catch {
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshUser();
	}, []);

	const logout = () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		setUser(null);
		// optionally redirect to login
		window.location.href = "/login";
	};

	return (
		<AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
};
