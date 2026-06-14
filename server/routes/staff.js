import express from "express";
import { verifyAdmin, verifyToken, verifyStaff } from "../middleware/auth.js";
import Staff from "../models/Staff.js";
import User from "../models/User.js";
import { isStaffRole, isAdminRole } from "../utils/validation.js";
import {
    getAllStaff,
    getStaffById,
    createStaff,
    updateStaff,
    updateStaffPassword,
    adminResetPassword,
    updateOwnPassword,
    updateOwnProfile,
    updateStaffPhoto,
    deleteStaff,
    getStaffStats,
    deactivateStaff
} from "../controllers/staffController.js";

const router = express.Router();

// Custom middleware to allow both staff and admin to update their own photo
const ensureStaffOrAdminForPhoto = async (req, res, next) => {
  try {
    // Check token payload first: accept if type is staff AND role is staff or admin
    if (req.user?.type === 'staff' && isStaffRole(req.user?.role)) {
      return next();
    }
    
    // Fallback: resolve from database
    const staffMember = await Staff.findById(req.user?.id);
    if (staffMember && staffMember.isActive && isStaffRole(staffMember.role)) {
      return next();
    }
    
    // Check if it's an admin user
    const adminUser = await User.findOne({ _id: req.user?.id, role: 'admin' });
    if (adminUser) {
      return next();
    }
    
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Only staff and admin can update photos' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Authorization error' 
    });
  }
};

// Authenticated staff self-service: allows staff to update their own password
// without requiring admin intervention for routine credential rotations
router.put("/me/password", verifyToken, verifyStaff, updateOwnPassword);
router.put("/me/photo", verifyToken, ensureStaffOrAdminForPhoto, updateStaffPhoto);
router.put("/me", verifyToken, ensureStaffOrAdminForPhoto, updateOwnProfile);

router.use(verifyToken, verifyAdmin);

// Admin-only management: restricted to admins to prevent staff from
// creating accounts or modifying peer credentials
router.get("/", getAllStaff);
router.get("/stats", getStaffStats);
router.get("/:id", getStaffById);
router.post("/", createStaff);
router.put("/:id", updateStaff);
router.put("/:id/password", updateStaffPassword);
router.put("/:id/admin-reset-password", adminResetPassword);
router.put("/:id/deactivate", deactivateStaff);
router.delete("/:id", deleteStaff);

export default router;
