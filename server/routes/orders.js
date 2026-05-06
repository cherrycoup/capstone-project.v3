import express from "express";
import { optionalAuth, verifyStaff, verifyToken } from "../middleware/auth.js";
import {
    getAllOrders,
    getOrderById,
    getOrdersByCustomer,
    createOrder,
    updateOrderStatus,
    getOrderStats,
    cancelOrder
} from "../controllers/orderController.js";

const router = express.Router();

// Public routes
router.post("/", optionalAuth, createOrder);
router.get("/stats", verifyToken, verifyStaff, getOrderStats);
router.get("/customer/:customerId", verifyToken, getOrdersByCustomer);
router.get("/:id", verifyToken, getOrderById);

// Admin routes
router.get("/", verifyToken, verifyStaff, getAllOrders);
router.put("/:id/status", verifyToken, verifyStaff, updateOrderStatus);
router.put("/:id/cancel", verifyToken, verifyStaff, cancelOrder);

export default router;
