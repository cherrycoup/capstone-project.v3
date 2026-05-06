import express from "express";
import { optionalAuth, verifyStaff, verifyToken } from "../middleware/auth.js";
import {
    getAllAppointments,
    getAppointmentById,
    getAppointmentsByCustomer,
    getMyAppointments,
    createAppointment,
    updateAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    getAvailableSlots,
    getAppointmentStats
} from "../controllers/appointmentController.js";

const router = express.Router();

// Public routes (appointment creation should be public for customers)
router.post("/", optionalAuth, createAppointment);
router.get("/available-slots", getAvailableSlots);
router.get("/stats", verifyToken, verifyStaff, getAppointmentStats);
router.get("/customer/:customerId", verifyToken, getAppointmentsByCustomer);

// Customer routes (require authentication) - must come before /:id
router.get("/my-appointments", verifyToken, getMyAppointments);

// Public routes with ID parameter - must come after specific routes
router.get("/:id", verifyToken, getAppointmentById);

// Admin routes
router.get("/", verifyToken, verifyStaff, getAllAppointments);
router.put("/:id", verifyToken, verifyStaff, updateAppointment);
router.put("/:id/status", verifyToken, verifyStaff, updateAppointmentStatus);
router.delete("/:id", verifyToken, verifyStaff, deleteAppointment);

export default router;
