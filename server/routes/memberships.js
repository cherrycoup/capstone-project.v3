import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import * as membershipController from "../controllers/membershipController.js";

const router = express.Router();

/**
 * Customer Routes (Protected)
 */
router.post("/apply", authenticateUser, membershipController.applyForMembership);
router.get("/me", authenticateUser, membershipController.getMyMembership);
router.get("/me/status", authenticateUser, membershipController.getMyMembership);
router.get("/me/history", authenticateUser, membershipController.getMyMembershipHistory);
router.get("/benefits/:tier", membershipController.getApplicationById); // Public endpoint for benefits

/**
 * Admin Routes (Protected)
 */
router.get("/applications", authenticateUser, membershipController.getAllApplications);
router.get("/applications/:applicationId", authenticateUser, membershipController.getApplicationById);
router.post("/applications/:applicationId/approve", authenticateUser, membershipController.approveApplication);
router.post("/applications/:applicationId/reject", authenticateUser, membershipController.rejectApplication);
router.get("/customer/:customerId", authenticateUser, membershipController.getApplicationById);
router.put("/customer/:customerId/tier", authenticateUser, membershipController.updateMembershipTier);
router.post("/customer/:customerId/renew", authenticateUser, membershipController.renewMembership);
router.post("/customer/:customerId/suspend", authenticateUser, membershipController.suspendMembership);
router.get("/stats", authenticateUser, membershipController.getMembershipStats);

export default router;
