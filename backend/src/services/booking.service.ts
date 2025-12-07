import { supabase } from "../config/database";
import { AppError } from "../middleware/errorHandler";
import { Booking } from "../types";

export class BookingService {
	async createBooking(
		userId: string,
		data: {
			worker_id: string;
			service_id: string;
			booking_date: string;
			duration_hours?: number;
			location?: string;
			notes?: string;
		}
	) {
		// Verify worker exists and get hourly rate
		const { data: worker, error: workerError } = await supabase
			.from("workers")
			.select("id, hourly_rate, user_id")
			.eq("id", data.worker_id)
			.single();

		if (workerError || !worker) {
			throw new AppError("Worker not found", 404);
		}

		// Calculate total amount
		const duration = data.duration_hours || 1;
		const total_amount = worker.hourly_rate
			? worker.hourly_rate * duration
			: null;

		// Create booking
		const { data: booking, error } = await supabase
			.from("bookings")
			.insert({
				user_id: userId,
				worker_id: data.worker_id,
				service_id: data.service_id,
				booking_date: data.booking_date,
				duration_hours: duration,
				total_amount,
				location: data.location,
				notes: data.notes,
				status: "pending",
			})
			.select(
				`
        *,
        worker:workers!bookings_worker_id_fkey(
          *,
          user:users!workers_user_id_fkey(
            full_name, phone_number, profile_picture
          )
        ),
        service:services(id, name, icon)
      `
			)
			.single();

		if (error) {
			console.error("Booking creation error:", error);
			throw new AppError("Failed to create booking", 500);
		}

		// Update worker total bookings count
		const { data: currentWorker } = await supabase
			.from("workers")
			.select("total_bookings")
			.eq("id", data.worker_id)
			.single();

		if (currentWorker) {
			await supabase
				.from("workers")
				.update({
					total_bookings: (currentWorker.total_bookings || 0) + 1,
					updated_at: new Date().toISOString(),
				})
				.eq("id", data.worker_id);
		}

		return booking;
	}

	async getBookingById(bookingId: string, userId: string) {
		const { data, error } = await supabase
			.from("bookings")
			.select(
				`
        *,
        user:users!bookings_user_id_fkey(
          id, full_name, phone_number, profile_picture
        ),
        worker:workers!bookings_worker_id_fkey(
          *,
          user:users!workers_user_id_fkey(
            id, full_name, phone_number, profile_picture, location
          )
        ),
        service:services(id, name, icon, category),
        review:reviews(rating, comment, created_at)
      `
			)
			.eq("id", bookingId)
			.single();

		if (error || !data) {
			throw new AppError("Booking not found", 404);
		}

		// Check if user is authorized to view this booking
		const workerUserId = data.worker?.user?.id;
		if (data.user_id !== userId && workerUserId !== userId) {
			throw new AppError("Unauthorized to view this booking", 403);
		}

		return data;
	}

	async getUserBookings(userId: string, status?: string) {
		let query = supabase
			.from("bookings")
			.select(
				`
        *,
        worker:workers!bookings_worker_id_fkey(
          *,
          user:users!workers_user_id_fkey(
            id, full_name, phone_number, profile_picture
          )
        ),
        service:services(id, name, icon),
        review:reviews(rating, comment)
      `
			)
			.eq("user_id", userId)
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

	async updateBookingStatus(bookingId: string, userId: string, status: string) {
		// Get booking with worker info
		const { data: booking } = await supabase
			.from("bookings")
			.select(
				`
        *,
        worker:workers!bookings_worker_id_fkey(user_id)
      `
			)
			.eq("id", bookingId)
			.single();

		if (!booking) {
			throw new AppError("Booking not found", 404);
		}

		// Check authorization
		const workerUserId = booking.worker?.user_id;
		const isWorker = workerUserId === userId;
		const isUser = booking.user_id === userId;

		if (!isWorker && !isUser) {
			throw new AppError("Unauthorized to update this booking", 403);
		}

		// Validate status transitions
		const allowedTransitions: Record<string, string[]> = {
			pending: ["confirmed", "cancelled"],
			confirmed: ["in_progress", "cancelled"],
			in_progress: ["completed", "cancelled"],
			completed: [],
			cancelled: [],
		};

		if (!allowedTransitions[booking.status]?.includes(status)) {
			throw new AppError(
				`Cannot change status from ${booking.status} to ${status}`,
				400
			);
		}

		// Update booking
		const { data, error } = await supabase
			.from("bookings")
			.update({
				status,
				updated_at: new Date().toISOString(),
			})
			.eq("id", bookingId)
			.select()
			.single();

		if (error) {
			throw new AppError("Failed to update booking status", 500);
		}

		return data;
	}

	async addReview(
		bookingId: string,
		userId: string,
		rating: number,
		comment?: string
	) {
		// Get booking
		const { data: booking } = await supabase
			.from("bookings")
			.select("*, worker_id")
			.eq("id", bookingId)
			.eq("user_id", userId)
			.single();

		if (!booking) {
			throw new AppError("Booking not found or unauthorized", 404);
		}

		if (booking.status !== "completed") {
			throw new AppError("Can only review completed bookings", 400);
		}

		// Check if review already exists
		const { data: existingReview } = await supabase
			.from("reviews")
			.select("id")
			.eq("booking_id", bookingId)
			.single();

		if (existingReview) {
			throw new AppError("Review already exists for this booking", 400);
		}

		// Create review
		const { data: review, error } = await supabase
			.from("reviews")
			.insert({
				booking_id: bookingId,
				user_id: userId,
				worker_id: booking.worker_id,
				rating,
				comment,
			})
			.select()
			.single();

		if (error) {
			throw new AppError("Failed to create review", 500);
		}

		// Update worker rating
		await this.updateWorkerRating(booking.worker_id);

		return review;
	}

	private async updateWorkerRating(workerId: string) {
		const { data: reviews } = await supabase
			.from("reviews")
			.select("rating")
			.eq("worker_id", workerId);

		if (reviews && reviews.length > 0) {
			const avgRating =
				reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

			await supabase
				.from("workers")
				.update({
					rating: Number(avgRating.toFixed(2)),
					total_reviews: reviews.length,
					updated_at: new Date().toISOString(),
				})
				.eq("id", workerId);
		}
	}
}
