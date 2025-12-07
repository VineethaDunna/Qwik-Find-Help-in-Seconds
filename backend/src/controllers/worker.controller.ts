import { Request, Response, NextFunction } from "express";
import { WorkerService } from "../services/worker.service";

const workerService = new WorkerService();

export class WorkerController {
	async getWorkers(req: Request, res: Response, next: NextFunction) {
		try {
			const filters = {
				service_id: req.query.service_id as string,
				location: req.query.location as string,
				min_rating: req.query.min_rating
					? Number(req.query.min_rating)
					: undefined,
				availability: req.query.availability as string,
				search: req.query.search as string,
				limit: req.query.limit ? Number(req.query.limit) : 20,
				offset: req.query.offset ? Number(req.query.offset) : 0,
			};

			const workers = await workerService.getWorkers(filters);

			res.json({
				success: true,
				data: workers,
				pagination: {
					limit: filters.limit,
					offset: filters.offset,
					count: workers.length,
				},
			});
		} catch (error) {
			next(error);
		}
	}

	async getWorkerById(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const worker = await workerService.getWorkerById(id);

			res.json({
				success: true,
				data: worker,
			});
		} catch (error) {
			next(error);
		}
	}

	async updateProfile(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.userId;
			const updates = req.body;

			const profile = await workerService.updateWorkerProfile(userId, updates);

			res.json({
				success: true,
				message: "Worker profile updated successfully",
				data: profile,
			});
		} catch (error) {
			next(error);
		}
	}

	async updateServices(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.userId;
			const { service_ids } = req.body;

			if (!Array.isArray(service_ids)) {
				return res.status(400).json({
					success: false,
					message: "service_ids must be an array",
				});
			}

			const services = await workerService.updateWorkerServices(
				userId,
				service_ids
			);

			res.json({
				success: true,
				message: "Services updated successfully",
				data: services,
			});
		} catch (error) {
			next(error);
		}
	}

	async getBookings(req: Request, res: Response, next: NextFunction) {
		try {
			const userId = req.user!.userId;
			const { status } = req.query;

			const bookings = await workerService.getWorkerBookings(
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
}
