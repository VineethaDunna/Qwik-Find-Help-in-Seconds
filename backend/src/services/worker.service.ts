import { supabase } from "../config/database";
import { AppError } from "../middleware/errorHandler";
import { WorkerProfile } from "../types";

export class WorkerService {
	async getWorkers(filters?: {
		service_id?: string;
		location?: string;
		min_rating?: number;
		availability?: string;
		search?: string;
		limit?: number;
		offset?: number;
	}) {
		let query = supabase.from("workers").select(`
        *,
        user:users!workers_user_id_fkey(
          id, email, full_name, phone_number, 
          location, profile_picture, user_type
        ),
        worker_services(
          service_id,
          services(id, name, category, icon)
        )
      `);

		// Filter by service
		if (filters?.service_id) {
			// First get worker IDs that have this service
			const { data: workerIds } = await supabase
				.from("worker_services")
				.select("worker_id")
				.eq("service_id", filters.service_id);

			if (workerIds && workerIds.length > 0) {
				const ids = workerIds.map((w) => w.worker_id);
				query = query.in("id", ids);
			} else {
				// No workers with this service
				return [];
			}
		}

		// Filter by location (case-insensitive partial match)
		if (filters?.location) {
			// Note: This needs to filter on the joined user table
			const { data: allWorkers } = await query;
			const filteredWorkers = allWorkers?.filter((worker: any) =>
				worker.user?.location
					?.toLowerCase()
					.includes(filters.location!.toLowerCase())
			);

			// Apply other filters after location filter
			let result = filteredWorkers || [];

			if (filters?.min_rating) {
				result = result.filter((w: any) => w.rating >= filters.min_rating!);
			}

			if (filters?.availability) {
				result = result.filter(
					(w: any) => w.availability_status === filters.availability
				);
			}

			if (filters?.search) {
				result = result.filter((w: any) =>
					w.user?.full_name
						?.toLowerCase()
						.includes(filters.search!.toLowerCase())
				);
			}

			const limit = filters?.limit || 20;
			const offset = filters?.offset || 0;

			return result.slice(offset, offset + limit);
		}

		// Filter by rating
		if (filters?.min_rating) {
			query = query.gte("rating", filters.min_rating);
		}

		// Filter by availability
		if (filters?.availability) {
			query = query.eq("availability_status", filters.availability);
		}

		// Pagination
		const limit = filters?.limit || 20;
		const offset = filters?.offset || 0;
		query = query.range(offset, offset + limit - 1);

		const { data, error } = await query;

		if (error) {
			console.error("Error fetching workers:", error);
			throw new AppError("Failed to fetch workers", 500);
		}

		// Apply search filter in memory (after fetching)
		let result = data || [];
		if (filters?.search) {
			result = result.filter((worker: any) =>
				worker.user?.full_name
					?.toLowerCase()
					.includes(filters.search!.toLowerCase())
			);
		}

		return result;
	}

	async getWorkerById(workerId: string): Promise<WorkerProfile> {
		const { data, error } = await supabase
			.from("workers")
			.select(
				`
        *,
        user:users!workers_user_id_fkey(
          id, email, full_name, phone_number, 
          location, profile_picture, user_type, created_at
        ),
        worker_services(
          service_id,
          services(id, name, category, icon, description)
        )
      `
			)
			.eq("id", workerId)
			.single();

		if (error || !data) {
			throw new AppError("Worker not found", 404);
		}

		// Fetch recent reviews
		const { data: reviews } = await supabase
			.from("reviews")
			.select(
				`
        *,
        user:users!reviews_user_id_fkey(full_name, profile_picture)
      `
			)
			.eq("worker_id", workerId)
			.order("created_at", { ascending: false })
			.limit(10);

		return {
			...data,
			services:
				data.worker_services?.map((ws: any) => ws.services).filter(Boolean) ||
				[],
			reviews: reviews || [],
		} as WorkerProfile;
	}

	async updateWorkerProfile(
		userId: string,
		updates: {
			hourly_rate?: number;
			experience_years?: number;
			bio?: string;
			availability_status?: string;
		}
	) {
		// Get worker by user_id
		const { data: worker } = await supabase
			.from("workers")
			.select("id")
			.eq("user_id", userId)
			.single();

		if (!worker) {
			throw new AppError("Worker profile not found", 404);
		}

		const { data, error } = await supabase
			.from("workers")
			.update({
				...updates,
				updated_at: new Date().toISOString(),
			})
			.eq("id", worker.id)
			.select()
			.single();

		if (error) {
			throw new AppError("Failed to update worker profile", 500);
		}

		return data;
	}

	async updateWorkerServices(userId: string, serviceIds: string[]) {
		// Get worker by user_id
		const { data: worker } = await supabase
			.from("workers")
			.select("id")
			.eq("user_id", userId)
			.single();

		if (!worker) {
			throw new AppError("Worker profile not found", 404);
		}

		// Delete existing services
		await supabase.from("worker_services").delete().eq("worker_id", worker.id);

		// Add new services
		if (serviceIds.length > 0) {
			const workerServices = serviceIds.map((serviceId) => ({
				worker_id: worker.id,
				service_id: serviceId,
			}));

			const { error } = await supabase
				.from("worker_services")
				.insert(workerServices);

			if (error) {
				throw new AppError("Failed to update worker services", 500);
			}
		}

		// Fetch updated services
		const { data: services } = await supabase
			.from("services")
			.select("*")
			.in("id", serviceIds);

		return services;
	}

	async getWorkerBookings(userId: string, status?: string) {
		// Get worker by user_id
		const { data: worker } = await supabase
			.from("workers")
			.select("id")
			.eq("user_id", userId)
			.single();

		if (!worker) {
			throw new AppError("Worker profile not found", 404);
		}

		let query = supabase
			.from("bookings")
			.select(
				`
        *,
        user:users!bookings_user_id_fkey(
          id, full_name, phone_number, profile_picture
        ),
        service:services(id, name, icon),
        review:reviews(rating, comment)
      `
			)
			.eq("worker_id", worker.id)
			.order("booking_date", { ascending: false });

		if (status) {
			query = query.eq("status", status);
		}

		const { data, error } = await query;

		if (error) {
			throw new AppError("Failed to fetch bookings", 500);
		}

		return data;
	}
}
