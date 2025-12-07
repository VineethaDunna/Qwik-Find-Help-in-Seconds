import { supabase } from "../config/database";
import { AppError } from "../middleware/errorHandler";
import bcrypt from "bcryptjs";

export class UserService {
	async getUserProfile(userId: string) {
		const { data: user, error } = await supabase
			.from("users")
			.select(
				"id, email, full_name, phone_number, location, user_type, profile_picture, is_verified, created_at"
			)
			.eq("id", userId)
			.single();

		if (error || !user) {
			throw new AppError("User not found", 404);
		}

		if (user.user_type === "worker") {
			const { data: worker } = await supabase
				.from("workers")
				.select(
					`
          *,
          worker_services(
            service_id,
            services(id, name, category, icon)
          )
        `
				)
				.eq("user_id", userId)
				.single();

			return {
				...user,
				worker,
				services: worker?.worker_services?.map((ws: any) => ws.services) || [],
			};
		}

		return user;
	}

	async updateUserProfile(
		userId: string,
		updates: {
			full_name?: string;
			phone_number?: string;
			location?: string;
			profile_picture?: string;
		}
	) {
		const { data, error } = await supabase
			.from("users")
			.update({
				...updates,
				updated_at: new Date().toISOString(),
			})
			.eq("id", userId)
			.select(
				"id, email, full_name, phone_number, location, user_type, profile_picture"
			)
			.single();

		if (error) {
			throw new AppError("Failed to update profile", 500);
		}

		return data;
	}

	async changePassword(
		userId: string,
		currentPassword: string,
		newPassword: string
	) {
		const { data: user } = await supabase
			.from("users")
			.select("password")
			.eq("id", userId)
			.single();

		if (!user || !user.password) {
			throw new AppError("Cannot change password for this account", 400);
		}

		const isValid = await bcrypt.compare(currentPassword, user.password);
		if (!isValid) {
			throw new AppError("Current password is incorrect", 400);
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);

		const { error } = await supabase
			.from("users")
			.update({ password: hashedPassword })
			.eq("id", userId);

		if (error) {
			throw new AppError("Failed to change password", 500);
		}

		return { success: true, message: "Password changed successfully" };
	}

	async deleteAccount(userId: string) {
		const { error } = await supabase.from("users").delete().eq("id", userId);

		if (error) {
			throw new AppError("Failed to delete account", 500);
		}

		return { success: true, message: "Account deleted successfully" };
	}
}
