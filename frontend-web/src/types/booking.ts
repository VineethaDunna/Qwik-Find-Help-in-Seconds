// frontend/src/types/booking.ts
import type { BookingWithDetails } from "../../../backend/src/types";

export type CreateBookingData = {
	worker_id: string;
	service_id: string; // REQUIRED to pass backend validation
	booking_date: string; // "YYYY-MM-DD"
	duration_hours?: number;
	location?: string;
	notes?: string;
};
