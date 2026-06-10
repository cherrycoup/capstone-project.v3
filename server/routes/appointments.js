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
    getFullyBookedAppointmentDates,
    addBlockedDate,
    removeBlockedDate,
    getBlockedDates,
    getAppointmentStats
} from "../controllers/appointmentController.js";

const router = express.Router();

// DEBUG: log incoming appointment requests (temporary)
router.use((req, res, next) => {
    try {
        const authHeader = req.headers.authorization ? '[REDACTED]' : 'none';
        console.log('[APPOINTMENTS]', req.method, req.originalUrl, 'auth=', authHeader, 'bodyKeys=', Object.keys(req.body || {}));
    } catch (e) {
        // ignore
    }
    next();
});

// Public routes (appointment creation should be public for customers)
router.post("/", optionalAuth, createAppointment);
router.get("/available-slots", getAvailableSlots);
router.get("/fully-booked-dates", getFullyBookedAppointmentDates);
router.get("/stats", verifyToken, verifyStaff, getAppointmentStats);
router.get("/customer/:customerId", verifyToken, getAppointmentsByCustomer);

// Admin blocked dates - public routes (admin panel has its own auth protection)
router.get("/blocked-dates", getBlockedDates);
router.post("/block-date", addBlockedDate);
router.delete("/block-date", removeBlockedDate);

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
