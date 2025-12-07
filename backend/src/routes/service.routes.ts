import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";

const router = Router();
const serviceController = new ServiceController();

router.get("/", serviceController.getAllServices.bind(serviceController));
router.get("/:id", serviceController.getServiceById.bind(serviceController));

export default router;
