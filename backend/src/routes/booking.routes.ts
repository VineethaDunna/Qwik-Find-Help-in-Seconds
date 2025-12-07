import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authenticate } from "../middleware/auth";
import {
	bookingValidation,
	reviewValidation,
	validate,
} from "../middleware/validate";

const router = Router();
const bookingController = new BookingController();

router.use(authenticate);

router.post(
	"/",
	bookingValidation,
	validate,
	bookingController.createBooking.bind(bookingController)
);

router.get("/:id", bookingController.getBookingById.bind(bookingController));

router.put(
	"/:id/status",
	bookingController.updateBookingStatus.bind(bookingController)
);

router.post(
	"/:id/review",
	reviewValidation,
	validate,
	bookingController.addReview.bind(bookingController)
);

export default router;
