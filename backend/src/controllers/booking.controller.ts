import { Request, Response, NextFunction } from "express";
import { BookingService } from "../services/booking.service";

const bookingService = new BookingService();

export class BookingController {
	async createBooking(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.userId;
			const bookingData = req.body;

			const booking = await bookingService.createBooking(userId, bookingData);

			res.status(201).json({
				success: true,
				message: "Booking created successfully",
				data: booking,
			});
		} catch (error) {
			next(error);
		}
	}

	async getBookingById(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const userId = req.user!.userId;

			const booking = await bookingService.getBookingById(id, userId);

			res.json({
				success: true,
				data: booking,
			});
		} catch (error) {
			next(error);
		}
	}

	async updateBookingStatus(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const { status } = req.body;
			const userId = req.user!.userId;

			if (!status) {
				return res.status(400).json({
					success: false,
					message: "Status is required",
				});
			}

			const booking = await bookingService.updateBookingStatus(
				id,
				userId,
				status
			);

			res.json({
				success: true,
				message: "Booking status updated successfully",
				data: booking,
			});
		} catch (error) {
			next(error);
		}
	}

	async addReview(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const { rating, comment } = req.body;
			const userId = req.user!.userId;

			const review = await bookingService.addReview(
				id,
				userId,
				rating,
				comment
			);

			res.status(201).json({
				success: true,
				message: "Review added successfully",
				data: review,
			});
		} catch (error) {
			next(error);
		}
	}
}
