import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";
import { body, validate } from "../middleware/validate";

const router = Router();
const userController = new UserController();

router.use(authenticate);

router.get("/profile", userController.getProfile.bind(userController));

router.put("/profile", userController.updateProfile.bind(userController));

router.post(
	"/change-password",
	[
		body("current_password")
			.notEmpty()
			.withMessage("Current password is required"),
		body("new_password")
			.isLength({ min: 6 })
			.withMessage("New password must be at least 6 characters"),
		validate,
	],
	userController.changePassword.bind(userController)
);

router.get("/bookings", userController.getBookings.bind(userController));

router.delete("/account", userController.deleteAccount.bind(userController));

export default router;
