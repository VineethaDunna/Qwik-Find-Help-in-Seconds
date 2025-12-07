import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../config/jwt";

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				message: "No token provided",
			});
		}

		const token = authHeader.substring(7);
		const decoded = verifyAccessToken(token);

		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: "Invalid or expired token",
		});
	}
};

export const authorizeWorker = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.user?.userType !== "worker") {
		return res.status(403).json({
			success: false,
			message: "Access denied. Workers only.",
		});
	}
	next();
};

export const authorizeUser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (req.user?.userType !== "user") {
		return res.status(403).json({
			success: false,
			message: "Access denied. Users only.",
		});
	}
	next();
};
