export type UserRole = "user" | "worker" | "admin";

export interface User {
	id: string;
	email: string;
	name: string;
	role: UserRole;
	avatar?: string;
	phone?: string;
	location?: string;
	createdAt: Date;
}

export interface WorkerService {
	id: string;
	name: string;
	rate: number;
	rateType: "hourly" | "fixed";
	description?: string;
}

export interface Worker extends User {
	role: "worker";
	services: string[];
	workerServices?: WorkerService[];
	hourlyRate: number;
	rating: number;
	reviewCount: number;
	isVerified: boolean;
	availability: string[];
	bio?: string;
	experience?: string;
	completedJobs: number;

	distance?: number;
	totalEarnings?: number;
}

export type BookingStatus =
	| "pending"
	| "confirmed"
	| "completed"
	| "cancelled"
	| "declined";

export interface Booking {
	id: string;
	workerId: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	userPhone?: string;
	service: string;
	date: string; // ISO date (YYYY-MM-DD)
	time: string; // '09:30 AM' or '09:30'
	duration?: number; // hours (number)
	price: number; // total or per hour based on service
	location: string;
	notes?: string;
	status: BookingStatus;
	createdAt: string;
	updatedAt?: string;
}

export interface CreateBookingData {
	worker_id: string;
	service_id?: string;
	booking_date: string;
	booking_time: string;
	duration_hours?: number;
	location: string;
	notes?: string;
	hourly_rate: number;
}

export interface BookingWithDetails extends Booking {
	worker?: {
		id: string;
		hourly_rate: number;
		bio?: string;
		users?: {
			full_name: string;
			profile_picture?: string;
			phone_number?: string;
		};
	};
	user?: {
		full_name: string;
		email: string;
		phone_number?: string;
	};
}

export interface Service {
	id: string;
	name: string;
	icon: string;
	category: string;
}

export interface Review {
	id: string;
	userId: string;
	userName: string;
	userAvatar?: string;
	workerId: string;
	rating: number;
	comment: string;
	date: Date;
}

export type SortOption =
	| "rating-high"
	| "rating-low"
	| "price-high"
	| "price-low"
	| "distance";

export interface FilterState {
	category: string | null;
	sortBy: SortOption;
	minRating: number;
	maxPrice: number | null;
}

export interface WorkerStats {
	todayEarnings: number;
	weeklyEarnings: number;
	monthlyEarnings: number;
	totalBookings: number;
	completedBookings: number;
	pendingBookings: number;
	acceptanceRate: number;
	averageRating: number;
}
