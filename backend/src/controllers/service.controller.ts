import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/database";
import { AppError } from "../middleware/errorHandler";

export class ServiceController {
	async getAllServices(req: Request, res: Response, next: NextFunction) {
		try {
			const { data: services, error } = await supabase
				.from("services")
				.select("*")
				.eq("is_active", true)
				.order("name");

			if (error) {
				throw new AppError("Failed to fetch services", 500);
			}

			res.json({
				success: true,
				data: services,
			});
		} catch (error) {
			next(error);
		}
	}

	async getServiceById(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;

			const { data: service, error } = await supabase
				.from("services")
				.select("*")
				.eq("id", id)
				.single();

			if (error || !service) {
				throw new AppError("Service not found", 404);
			}

			res.json({
				success: true,
				data: service,
			});
		} catch (error) {
			next(error);
		}
	}
}
