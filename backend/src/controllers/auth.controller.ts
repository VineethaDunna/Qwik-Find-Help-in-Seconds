import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { verifyRefreshToken, generateAccessToken } from "../config/jwt";

const authService = new AuthService();
const userService = new UserService();

export class AuthController {
	async register(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await authService.register(req.body);

			res.status(201).json({
				success: true,
				message: "User registered successfully",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}

	async login(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await authService.login(req.body);

			res.json({
				success: true,
				message: "Login successful",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}

	async googleAuth(req: Request, res: Response, next: NextFunction) {
		try {
			const result = await authService.googleAuth(req.body);

			res.json({
				success: true,
				message: "Google authentication successful",
				data: result,
			});
		} catch (error) {
			next(error);
		}
	}

	async refreshToken(req: Request, res: Response, next: NextFunction) {
		try {
			const { refresh_token } = req.body;

			if (!refresh_token) {
				return res.status(400).json({
					success: false,
					message: "Refresh token is required",
				});
			}

			const decoded = verifyRefreshToken(refresh_token);
			const access_token = generateAccessToken(decoded);

			res.json({
				success: true,
				data: { access_token },
			});
		} catch (error) {
			res.status(401).json({
				success: false,
				message: "Invalid or expired refresh token",
			});
		}
	}

	async getMe(req: Request, res: Response, next: NextFunction) {
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
}
