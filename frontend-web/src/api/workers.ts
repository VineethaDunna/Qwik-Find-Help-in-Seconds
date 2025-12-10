
// src/api/workers.ts
import { supabase } from "@/lib/supabaseClient";

/**
 * Fetch workers (joined with user and services) and normalize shape for UI.
 */
export async function fetchWorkers(): Promise<any[]> {
	try {
		const { data, error } = await supabase
			.from("workers")
			.select(
				`id,
         hourly_rate,
         experience_years,
         bio,
         availability_status,
         rating,
         total_reviews,
         total_bookings,
         created_at,
         updated_at,
         users:users ( id, full_name, email, phone_number, location, profile_picture, is_verified ),
         worker_services:worker_services ( id, services:services ( id, name, category ) )`
			)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("fetchWorkers supabase error:", error);
			return [];
		}

		const normalized = (data || []).map((w: any) => {
			const user = w.users || {};
			const servicesArr =
				Array.isArray(w.worker_services) && w.worker_services.length
					? w.worker_services
							.map((ws: any) => (ws?.services ? ws.services.name : null))
							.filter(Boolean)
					: [];

			return {
				id: w.id,
				hourly_rate: w.hourly_rate ? Number(w.hourly_rate) : null,
				hourlyRate: w.hourly_rate ? Number(w.hourly_rate) : null, // compatibility
				experience_years: w.experience_years ?? 0,
				bio: w.bio ?? "",
				availability_status: w.availability_status ?? "unknown",
				rating: w.rating ? Number(w.rating) : 0,
				total_reviews: w.total_reviews ?? 0,
				total_bookings: w.total_bookings ?? 0,
				created_at: w.created_at,
				updated_at: w.updated_at,
				name: user.full_name ?? `${user.email ?? "Unnamed"}`,
				full_name: user.full_name,
				email: user.email,
				phone_number: user.phone_number,
				profile_picture: user.profile_picture,
				location_text: user.location ?? null, // might be "lat,lon" or address
				is_verified: user.is_verified ?? false,
				services: servicesArr,
				raw: w,
			};
		});

		return normalized;
	} catch (err) {
		console.error("fetchWorkers unexpected error:", err);
		return [];
	}
}
