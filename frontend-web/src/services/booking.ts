// frontend/src/services/bookings.ts
import request from "@/lib/apiClient";
import type { CreateBookingData } from "@/types/booking";

export async function createBooking(payload: CreateBookingData) {
	console.log("Submitting booking payload:", payload);

	const res = await request("/api/bookings", {
		method: "POST",
		body: JSON.stringify(payload),
	});

	// Normalize: backend responds with { success, data }
	if (res && typeof res === "object" && "data" in res) {
		return (res as any).data;
	}

	return res;
}
