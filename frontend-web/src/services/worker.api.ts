// src/services/worker.api.ts
import axios from "axios";

const API_BASE_URL =
	process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Add token to requests
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("accessToken");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const workerApi = {
	// Get worker profile with all details
	getMyProfile: async () => {
		const response = await api.get("/users/profile");
		return response.data;
	},

	// Get worker bookings
	getMyBookings: async (status?: string) => {
		const params = status ? { status } : {};
		const response = await api.get("/workers/my/bookings", { params });
		return response.data;
	},

	// Update worker profile
	updateProfile: async (data: {
		hourly_rate?: number;
		experience_years?: number;
		bio?: string;
		availability_status?: string;
	}) => {
		const response = await api.put("/workers/profile", data);
		return response.data;
	},

	// Update user profile (name, phone, location, etc.)
	updateUserProfile: async (data: {
		full_name?: string;
		phone_number?: string;
		location?: string;
		profile_picture?: string;
	}) => {
		const response = await api.put("/users/profile", data);
		return response.data;
	},

	// Update worker services
	updateServices: async (serviceIds: string[]) => {
		const response = await api.post("/workers/services", { serviceIds });
		return response.data;
	},

	// Accept booking
	acceptBooking: async (bookingId: string) => {
		const response = await api.patch(`/bookings/${bookingId}/status`, {
			status: "confirmed",
		});
		return response.data;
	},

	// Decline booking
	declineBooking: async (bookingId: string) => {
		const response = await api.patch(`/bookings/${bookingId}/status`, {
			status: "cancelled",
		});
		return response.data;
	},

	// Complete booking
	completeBooking: async (bookingId: string) => {
		const response = await api.patch(`/bookings/${bookingId}/status`, {
			status: "completed",
		});
		return response.data;
	},

	// Get all services
	getAllServices: async () => {
		const response = await api.get("/services");
		return response.data;
	},
};

export default workerApi;
