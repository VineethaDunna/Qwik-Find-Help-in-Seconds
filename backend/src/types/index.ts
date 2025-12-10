// export interface User {
// 	id: string;
// 	email: string;
// 	password?: string;
// 	full_name: string;
// 	phone_number?: string;
// 	location?: string;
// 	user_type: "user" | "worker";
// 	google_id?: string;
// 	profile_picture?: string;
// 	is_verified: boolean;
// 	is_active: boolean;
// 	created_at: Date;
// 	updated_at: Date;
// }

// export interface Worker {
// 	id: string;
// 	user_id: string;
// 	hourly_rate?: number;
// 	experience_years?: number;
// 	bio?: string;
// 	availability_status: "available" | "busy" | "offline";
// 	rating: number;
// 	total_reviews: number;
// 	total_bookings: number;
// 	created_at: Date;
// 	updated_at: Date;
// }

// export interface Service {
// 	id: string;
// 	name: string;
// 	category: string;
// 	description?: string;
// 	icon?: string;
// 	is_active: boolean;
// 	created_at: Date;
// }

// export interface Booking {
// 	id: string;
// 	user_id: string;
// 	worker_id: string;
// 	service_id: string;
// 	booking_date: Date;
// 	duration_hours?: number;
// 	total_amount?: number;
// 	status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
// 	location?: string;
// 	notes?: string;
// 	created_at: Date;
// 	updated_at: Date;
// }

// export interface Review {
// 	id: string;
// 	booking_id: string;
// 	user_id: string;
// 	worker_id: string;
// 	rating: number;
// 	comment?: string;
// 	created_at: Date;
// }

// export interface RegisterRequest {
// 	email: string;
// 	password: string;
// 	full_name: string;
// 	phone_number?: string;
// 	location?: string;
// 	user_type: "user" | "worker";
// 	services?: string[];
// 	hourly_rate?: number;
// }

// export interface LoginRequest {
// 	email: string;
// 	password: string;
// }

// export interface GoogleAuthRequest {
// 	credential: string;
// 	user_type: "user" | "worker";
// }

// export interface AuthResponse {
// 	user: Omit<User, "password">;
// 	worker?: Worker;
// 	services?: Service[];
// 	access_token: string;
// 	refresh_token: string;
// }

// export interface JWTPayload {
// 	userId: string;
// 	email: string;
// 	userType: "user" | "worker";
// }

// export interface WorkerProfile extends Worker {
// 	user: Omit<User, "password">;
// 	services: Service[];
// }

// export interface BookingWithDetails extends Booking {
// 	user?: Omit<User, "password">;
// 	worker?: WorkerProfile;
// 	service?: Service;
// 	review?: Review;
// }

// declare global {
// 	namespace Express {
// 		interface Request {
// 			user?: JWTPayload;
// 		}
// 	}
// }

export interface User {
	id: string;
	email: string;
	password?: string;
	full_name: string;
	phone_number?: string;
	location?: string;
	user_type: "user" | "worker";
	google_id?: string;
	profile_picture?: string;
	is_verified: boolean;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface Worker {
	id: string;
	user_id: string;
	hourly_rate?: number;
	experience_years?: number;
	bio?: string;
	availability_status: "available" | "busy" | "offline";
	rating: number;
	total_reviews: number;
	total_bookings: number;
	created_at: Date;
	updated_at: Date;
}

export interface Service {
	id: string;
	name: string;
	category: string;
	description?: string;
	icon?: string;
	is_active: boolean;
	created_at: Date;
}

export interface Booking {
	id: string;
	user_id: string;
	worker_id: string;
	service_id: string;
	booking_date: Date;
	duration_hours?: number;
	total_amount?: number;
	status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
	location?: string;
	notes?: string;
	created_at: Date;
	updated_at: Date;
}

export interface Review {
	id: string;
	booking_id: string;
	user_id: string;
	worker_id: string;
	rating: number;
	comment?: string;
	created_at: Date;
}

export interface RegisterRequest {
	email: string;
	password: string;
	full_name: string;
	phone_number?: string;
	location?: string;
	user_type: "user" | "worker";
	services?: string[];
	hourly_rate?: number;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface GoogleAuthRequest {
	credential: string;
	user_type: "user" | "worker";
}

export interface AuthResponse {
	user: Omit<User, "password">;
	worker?: Worker;
	services?: Service[];
	access_token: string;
	refresh_token: string;
}

export interface JWTPayload {
	userId: string;
	email: string;
	userType: "user" | "worker";
}

export interface WorkerProfile extends Worker {
	user: Omit<User, "password">;
	services: Service[];
}

export interface BookingWithDetails extends Booking {
	user?: Omit<User, "password">;
	worker?: WorkerProfile;
	service?: Service;
	review?: Review;
}

declare global {
	namespace Express {
		interface Request {
			user?: JWTPayload;
		}
	}
}
