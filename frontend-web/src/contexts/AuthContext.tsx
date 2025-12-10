
import React, { createContext, useContext, useEffect, useState } from "react";
import apiFetch, { loginApi, logoutLocal } from "@/lib/apiClient";

export type CurrentUser = {
	id: string;
	email: string;
	full_name: string;
	phone_number?: string;
	location?: string;
	user_type: "user" | "worker";
	profile_picture?: string;
};

type AuthContextShape = {
	user: CurrentUser | null;
	loading: boolean;
	refreshUser: () => Promise<void>;
	login: (email: string, password: string) => Promise<any>;
	logout: () => void;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

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
				setLoading(false);
				return;
			}
			const j = await res.json();
			setUser(j.data ?? null);
		} catch (err) {
			console.error("refreshUser error", err);
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshUser();
	}, []);

	const login = async (email: string, password: string) => {
		const j = await loginApi(email, password);
		if (j?.success) {
			// refresh user info
			await refreshUser();
		}
		return j;
	};

	const logout = () => {
		logoutLocal();
		setUser(null);
		window.location.href = "/login";
	};

	return (
		<AuthContext.Provider value={{ user, loading, refreshUser, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used in AuthProvider");
	return ctx;
};
