// src/services/auth.service.ts

import bcrypt from "bcryptjs";
import { supabase } from "../config/database";
import { verifyGoogleToken } from "../config/google-oauth";
import { generateAccessToken, generateRefreshToken } from "../config/jwt";
import {
	RegisterRequest,
	LoginRequest,
	GoogleAuthRequest,
	AuthResponse,
	Worker,
	Service,
} from "../types";
import { AppError } from "../middleware/errorHandler";

export class AuthService {
	async register(data: RegisterRequest): Promise<AuthResponse> {
		// Check if user exists
		const { data: existingUser } = await supabase
			.from("users")
			.select("id")
			.eq("email", data.email)
			.single();

		if (existingUser) {
			throw new AppError("User already exists", 400);
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(data.password, 10);

		// Create user
		const { data: user, error: userError } = await supabase
			.from("users")
			.insert({
				email: data.email,
				password: hashedPassword,
				full_name: data.full_name,
				phone_number: data.phone_number,
				location: data.location,
				user_type: data.user_type,
			})
			.select()
			.single();

		if (userError || !user) {
			throw new AppError("Failed to create user", 500);
		}

		let worker: Worker | null = null;
		let services: Service[] | undefined = undefined;

		// If worker, create worker profile
		if (data.user_type === "worker") {
			const { data: workerData, error: workerError } = await supabase
				.from("workers")
				.insert({
					user_id: user.id,
					hourly_rate: data.hourly_rate || null,
				})
				.select()
				.single();

			if (workerError || !workerData) {
				throw new AppError("Failed to create worker profile", 500);
			}

			worker = workerData as Worker;

			// Add worker services
			if (data.services && data.services.length > 0) {
				const workerServices = data.services.map((serviceId) => ({
					worker_id: worker!.id,
					service_id: serviceId,
				}));

				await supabase.from("worker_services").insert(workerServices);

				// Fetch services
				const { data: servicesData } = await supabase
					.from("services")
					.select("*")
					.in("id", data.services);

				services = (servicesData || []) as Service[];
			}
		}

		// Generate tokens
		const jwtPayload = {
			userId: user.id,
			email: user.email,
			userType: user.user_type,
		};

		const access_token = generateAccessToken(jwtPayload);
		const refresh_token = generateRefreshToken(jwtPayload);

		// Remove password from response
		const { password, ...userWithoutPassword } = user;

		return {
			user: userWithoutPassword,
			worker: worker || undefined,
			services,
			access_token,
			refresh_token,
		};
	}

	async login(data: LoginRequest): Promise<AuthResponse> {
		// Find user
		const { data: user, error } = await supabase
			.from("users")
			.select("*")
			.eq("email", data.email)
			.single();

		if (error || !user) {
			throw new AppError("Invalid credentials", 401);
		}

		// Check password
		if (!user.password) {
			throw new AppError("Invalid credentials", 401);
		}

		const isPasswordValid = await bcrypt.compare(data.password, user.password);

		if (!isPasswordValid) {
			throw new AppError("Invalid credentials", 401);
		}

		// Check if active
		if (!user.is_active) {
			throw new AppError("Account is deactivated", 403);
		}

		let worker: Worker | null = null;
		let services: Service[] | undefined = undefined;

		// If worker, fetch worker profile and services
		if (user.user_type === "worker") {
			const { data: workerData } = await supabase
				.from("workers")
				.select("*")
				.eq("user_id", user.id)
				.single();

			worker = workerData as Worker | null;

			if (worker) {
				const { data: workerServices } = await supabase
					.from("worker_services")
					.select("service_id, services(*)")
					.eq("worker_id", worker.id);

				if (workerServices && workerServices.length > 0) {
					services = workerServices
						.map((ws: any) => ws.services)
						.filter(Boolean) as Service[];
				}
			}
		}

		// Generate tokens
		const jwtPayload = {
			userId: user.id,
			email: user.email,
			userType: user.user_type,
		};

		const access_token = generateAccessToken(jwtPayload);
		const refresh_token = generateRefreshToken(jwtPayload);

		// Remove password from response
		const { password, ...userWithoutPassword } = user;

		return {
			user: userWithoutPassword,
			worker: worker || undefined,
			services,
			access_token,
			refresh_token,
		};
	}

	async googleAuth(data: GoogleAuthRequest): Promise<AuthResponse> {
		// Verify Google token
		const googleUser = await verifyGoogleToken(data.credential);

		// Check if user exists
		let { data: user } = await supabase
			.from("users")
			.select("*")
			.eq("email", googleUser.email)
			.single();

		let isNewUser = false;

		// Create user if doesn't exist
		if (!user) {
			const { data: newUser, error } = await supabase
				.from("users")
				.insert({
					email: googleUser.email,
					full_name: googleUser.name,
					user_type: data.user_type,
					google_id: googleUser.sub,
					profile_picture: googleUser.picture,
					is_verified: googleUser.email_verified,
				})
				.select()
				.single();

			if (error || !newUser) {
				throw new AppError("Failed to create user", 500);
			}

			user = newUser;
			isNewUser = true;

			// Create worker profile if worker
			if (data.user_type === "worker") {
				await supabase.from("workers").insert({
					user_id: user.id,
				});
			}
		}

		let worker: Worker | null = null;
		let services: Service[] | undefined = undefined;

		// Fetch worker data if worker
		if (user.user_type === "worker") {
			const { data: workerData } = await supabase
				.from("workers")
				.select("*")
				.eq("user_id", user.id)
				.single();

			worker = workerData as Worker | null;

			if (worker && !isNewUser) {
				const { data: workerServices } = await supabase
					.from("worker_services")
					.select("service_id, services(*)")
					.eq("worker_id", worker.id);

				if (workerServices && workerServices.length > 0) {
					services = workerServices
						.map((ws: any) => ws.services)
						.filter(Boolean) as Service[];
				}
			}
		}

		// Generate tokens
		const jwtPayload = {
			userId: user.id,
			email: user.email,
			userType: user.user_type,
		};

		const access_token = generateAccessToken(jwtPayload);
		const refresh_token = generateRefreshToken(jwtPayload);

		// Remove password from response
		const { password, ...userWithoutPassword } = user;

		return {
			user: userWithoutPassword,
			worker: worker || undefined,
			services,
			access_token,
			refresh_token,
		};
	}
}
