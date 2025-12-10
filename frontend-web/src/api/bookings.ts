
import request from "@/lib/apiClient"; // default export in your file already exports request helpers
import { CreateBookingData } from "@/types/booking";

export async function createBooking(payload: CreateBookingData) {
	// Use your existing request helper which already sets Authorization header from localStorage
	const res = await request("/api/bookings", {
		method: "POST",
		body: JSON.stringify(payload),
	});

	// Your request() helper returns parsed body already (not Response), so normalize:
	// If your backend returns { success: true, data: booking }
	if (res && typeof res === "object" && "data" in res) {
		return res.data;
	}
	// Otherwise return as-is
	return res;
}
