import { Router } from "express";
import authRoutes from "./authRoutes.js";
import movieRoutes from "./movieRoutes.js";
import bookingRoutes from "./bookingRoutes.js";
import ticketRoutes from "./ticketRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/movies", movieRoutes);
router.use("/bookings", bookingRoutes);
router.use("/tickets", ticketRoutes);
router.use("/admin", adminRoutes);

export default router;
