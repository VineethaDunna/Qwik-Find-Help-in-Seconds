import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { BookingService } from "../services/booking.service";

const userService = new UserService();
const bookingService = new BookingService();

export class UserController {
	async getProfile(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.userId;
			const profile = await userService.getUserProfile(userId);

			res.json({
				success: true,
				data: profile,
			});
		} catch (error) {
			next(error);
		}
	}

	async updateProfile(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.userId;
			const updates = req.body;

			const profile = await userService.updateUserProfile(userId, updates);

			res.json({
				success: true,
				message: "Profile updated successfully",
				data: profile,
			});
		} catch (error) {
			next(error);
		}
	}

	async changePassword(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.userId;
			const { current_password, new_password } = req.body;

			const result = await userService.changePassword(
				userId,
				current_password,
				new_password
			);

			res.json({
				success: true,
				message: result.message,
			});
		} catch (error) {
			next(error);
		}
	}

	async getBookings(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.userId;
			const { status } = req.query;

			const bookings = await bookingService.getUserBookings(
				userId,
				status as string
			);

			res.json({
				success: true,
				data: bookings,
			});
		} catch (error) {
			next(error);
		}
	}

	async deleteAccount(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.userId;
			const result = await userService.deleteAccount(userId);

			res.json({
				success: true,
				message: result.message,
			});
		} catch (error) {
			next(error);
		}
	}
}
