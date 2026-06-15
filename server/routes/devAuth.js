import express from "express"
import { Login, loginCustomer, loginStaff } from "../controllers/authController.js"

const router = express.Router()

// Development compatibility routes.
// Kept intentionally small so older deployments that still import this module
// can boot successfully while continuing to use the normal auth controllers.
router.post("/login", Login)
router.post("/customer/login", loginCustomer)
router.post("/staff/login", loginStaff)

export default router
