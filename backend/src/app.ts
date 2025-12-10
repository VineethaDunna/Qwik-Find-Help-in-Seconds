import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import workerRoutes from "./routes/worker.routes";
import bookingRoutes from "./routes/booking.routes";
import serviceRoutes from "./routes/service.routes";

import { errorHandler, notFound } from "./middleware/errorHandler";

dotenv.config();

const app: Application = express();

app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "http://localhost:8080",
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.json({
		success: true,
		message: "QuickConnect API is running",
		version: "1.0.0",
	});
});

app.get("/health", (req, res) => {
	res.json({
		success: true,
		message: "Server is healthy",
		timestamp: new Date().toISOString(),
	});
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`
╔══════════════════════════════════════╗
║   QuickConnect API Server Running   ║
╠══════════════════════════════════════╣
║   Port: ${PORT}                       ║
║   Environment: ${process.env.NODE_ENV || "development"}      ║
║   Timestamp: ${new Date().toISOString()} ║
╚══════════════════════════════════════╝
  `);
});

export default app;
