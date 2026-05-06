import express from "express";
import { verifyAdmin, verifyStaff, verifyToken } from "../middleware/auth.js";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    getLowStockProducts
} from "../controllers/productController.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/low-stock", verifyToken, verifyStaff, getLowStockProducts);
router.get("/:id", getProductById);

// Admin routes
router.post("/", verifyToken, verifyAdmin, createProduct);
router.put("/:id", verifyToken, verifyAdmin, updateProduct);
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);
router.post("/update-stock", verifyToken, verifyAdmin, updateStock);

export default router;
