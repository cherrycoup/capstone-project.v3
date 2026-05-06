import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Staff from "./models/Staff.js";
import connectDb from "./db/connect.js";

dotenv.config();

const createStaff = async () => {
    try {
        await connectDb();
        
        // Clear existing staff
        await Staff.deleteMany({});
        
        // Create staff accounts
        const hashedAdminPassword = await bcrypt.hash("admin123", 10);
        const hashedStaffPassword = await bcrypt.hash("staff123", 10);

        const staff = await Staff.insertMany([
            {
                name: "Admin User",
                email: "admin@example.com",
                password: hashedAdminPassword,
                role: "Admin",
                phone: "555-9001",
                department: "Management",
                isActive: true
            },
            {
                name: "Staff User",
                email: "staff@example.com",
                password: hashedStaffPassword,
                role: "Staff",
                phone: "555-9002",
                department: "Sales",
                isActive: true
            }
        ]);
        
        console.log("✓ Staff accounts created successfully!");
        console.log("Admin: admin@example.com / admin123");
        console.log("Staff: staff@example.com / staff123");
        
        process.exit(0);
    } catch (error) {
        console.error("Error creating staff:", error.message);
        process.exit(1);
    }
};

createStaff();
