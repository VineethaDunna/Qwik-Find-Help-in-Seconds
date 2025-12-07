import { Router } from "express";
import { WorkerController } from "../controllers/worker.controller";
import { authenticate, authorizeWorker } from "../middleware/auth";

const router = Router();
const workerController = new WorkerController();

router.get("/", workerController.getWorkers.bind(workerController));
router.get("/:id", workerController.getWorkerById.bind(workerController));

router.use(authenticate, authorizeWorker);

router.put("/profile", workerController.updateProfile.bind(workerController));
router.post(
	"/services",
	workerController.updateServices.bind(workerController)
);
router.get("/my/bookings", workerController.getBookings.bind(workerController));

export default router;
