import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/auth.js";
import {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getFAQsByCategory,
} from "../controllers/faqController.js";

const router = express.Router();

// Public routes
router.get("/", getAllFAQs);
router.get("/category/:category", getFAQsByCategory);
router.get("/:id", getFAQById);

// Admin routes
router.post("/", verifyToken, verifyAdmin, createFAQ);
router.put("/:id", verifyToken, verifyAdmin, updateFAQ);
router.delete("/:id", verifyToken, verifyAdmin, deleteFAQ);

export default router;
