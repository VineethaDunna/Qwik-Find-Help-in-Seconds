import { Request, Response, NextFunction } from "express";
import { validationResult, body } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			success: false,
			errors: errors.array(),
		});
	}
	next();
};

export const registerValidation = [
	body("email").isEmail().withMessage("Please provide a valid email"),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters long"),
	body("full_name").trim().notEmpty().withMessage("Full name is required"),
	body("user_type")
		.isIn(["user", "worker"])
		.withMessage("User type must be either user or worker"),
	body("phone_number")
		.optional()
		.isMobilePhone("any")
		.withMessage("Please provide a valid phone number"),
	body("location").optional().trim(),
];

export const loginValidation = [
	body("email").isEmail().withMessage("Please provide a valid email"),
	body("password").notEmpty().withMessage("Password is required"),
];

export const googleAuthValidation = [
	body("credential").notEmpty().withMessage("Google credential is required"),
	body("user_type")
		.isIn(["user", "worker"])
		.withMessage("User type must be either user or worker"),
];

export const bookingValidation = [
	body("worker_id").notEmpty().withMessage("Worker ID is required"),
	body("service_id").notEmpty().withMessage("Service ID is required"),
	body("booking_date")
		.isISO8601()
		.withMessage("Valid booking date is required"),
	body("duration_hours")
		.optional()
		.isFloat({ min: 0.5, max: 24 })
		.withMessage("Duration must be between 0.5 and 24 hours"),
	body("location").optional().trim(),
	body("notes").optional().trim(),
];

export const reviewValidation = [
	body("rating")
		.isInt({ min: 1, max: 5 })
		.withMessage("Rating must be between 1 and 5"),
	body("comment").optional().trim(),
];

export { body };
