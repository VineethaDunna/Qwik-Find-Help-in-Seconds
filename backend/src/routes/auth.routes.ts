import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import {
	registerValidation,
	loginValidation,
	googleAuthValidation,
	validate,
} from "../middleware/validate";

const router = Router();
const authController = new AuthController();

router.post(
	"/register",
	registerValidation,
	validate,
	authController.register.bind(authController)
);

router.post(
	"/login",
	loginValidation,
	validate,
	authController.login.bind(authController)
);

router.post(
	"/google",
	googleAuthValidation,
	validate,
	authController.googleAuth.bind(authController)
);

router.post("/refresh", authController.refreshToken.bind(authController));

router.get("/me", authenticate, authController.getMe.bind(authController));

export default router;
