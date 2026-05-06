import express from 'express';
import { loginCustomer, loginStaff, registerCustomer, Login } from "../controllers/authController.js";

const router = express.Router();

// Customer auth routes
router.post("/customer/login", loginCustomer);
router.post("/customer/register", registerCustomer);

// Staff auth routes
router.post("/staff/login", loginStaff);

// Legacy route
router.post('/login', Login); 

export default router;