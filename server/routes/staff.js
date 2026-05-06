import express from "express";
import { verifyAdmin, verifyToken } from "../middleware/auth.js";
import {
    getAllStaff,
    getStaffById,
    createStaff,
    updateStaff,
    updateStaffPassword,
    deleteStaff,
    getStaffStats,
    deactivateStaff
} from "../controllers/staffController.js";

const router = express.Router();
router.use(verifyToken, verifyAdmin);

// Admin routes
router.get("/", getAllStaff);
router.get("/stats", getStaffStats);
router.get("/:id", getStaffById);
router.post("/", createStaff);
router.put("/:id", updateStaff);
router.put("/:id/password", updateStaffPassword);
router.put("/:id/deactivate", deactivateStaff);
router.delete("/:id", deleteStaff);

export default router;
