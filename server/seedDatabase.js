import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Product from "./models/Product.js";
import Customer from "./models/Customer.js";
import Order from "./models/Order.js";
import OrderItem from "./models/OrderItem.js";
import Commission from "./models/Commission.js";
import Appointment from "./models/Appointment.js";
import Staff from "./models/Staff.js";
import connectDb from "./db/connect.js";

dotenv.config();

// Seed the database with sample data
const seedDatabase = async () => {
    try {
        await connectDb();

        // Clear existing data
        await Product.deleteMany({});
        await Customer.deleteMany({});
        await Order.deleteMany({});
        await OrderItem.deleteMany({});
        await Commission.deleteMany({});
        await Appointment.deleteMany({});
        await Staff.deleteMany({});

        console.log("Cleared existing data...");

        // Create Products
        const products = await Product.insertMany([
            {
                productName: "Laptop",
                stockLevel: 15,
                price: 999.99,
                description: "High-performance laptop",
                category: "Electronics"
            },
            {
                productName: "Mouse",
                stockLevel: 50,
                price: 29.99,
                description: "Wireless mouse",
                category: "Accessories"
            },
            {
                productName: "Keyboard",
                stockLevel: 30,
                price: 79.99,
                description: "Mechanical keyboard",
                category: "Accessories"
            },
            {
                productName: "Monitor",
                stockLevel: 20,
                price: 299.99,
                description: "4K Ultra HD Monitor",
                category: "Electronics"
            }
        ]);
        console.log("✓ Created products");

        // Create Customers
        const customers = await Customer.insertMany([
            {
                name: "John Doe",
                contactInfo: {
                    email: "john@example.com",
                    phone: "555-0101",
                    address: "123 Main St, City"
                }
            },
            {
                name: "Jane Smith",
                contactInfo: {
                    email: "jane@example.com",
                    phone: "555-0102",
                    address: "456 Oak Ave, City"
                }
            },
            {
                name: "Bob Johnson",
                contactInfo: {
                    email: "bob@example.com",
                    phone: "555-0103",
                    address: "789 Pine Rd, City"
                }
            }
        ]);
        console.log("✓ Created customers");

        // Create Orders
        const orders = await Order.insertMany([
            {
                customerId: customers[0]._id,
                fullName: "John Doe",
                contactNumber: "555-0101",
                address: "123 Main St, City",
                paymentMethod: "Credit Card",
                referenceNumber: "REF001",
                total: 1029.98,
                status: "Completed"
            },
            {
                customerId: customers[1]._id,
                fullName: "Jane Smith",
                contactNumber: "555-0102",
                address: "456 Oak Ave, City",
                paymentMethod: "Online Transfer",
                referenceNumber: "REF002",
                total: 299.99,
                status: "Confirmed"
            },
            {
                customerId: null, // Guest order
                fullName: "Guest User",
                contactNumber: "555-0999",
                address: "999 Guest St, City",
                paymentMethod: "Debit Card",
                referenceNumber: "REF003",
                total: 109.98,
                status: "Pending"
            }
        ]);
        console.log("✓ Created orders");

        // Create Order Items
        const orderItems = await OrderItem.insertMany([
            {
                orderId: orders[0]._id,
                productId: products[0]._id,
                productName: "Laptop",
                price: 999.99,
                quantity: 1,
                subtotal: 999.99
            },
            {
                orderId: orders[0]._id,
                productId: products[1]._id,
                productName: "Mouse",
                price: 29.99,
                quantity: 1,
                subtotal: 29.99
            },
            {
                orderId: orders[1]._id,
                productId: products[3]._id,
                productName: "Monitor",
                price: 299.99,
                quantity: 1,
                subtotal: 299.99
            },
            {
                orderId: orders[2]._id,
                productId: products[1]._id,
                productName: "Mouse",
                price: 29.99,
                quantity: 1,
                subtotal: 29.99
            },
            {
                orderId: orders[2]._id,
                productId: products[2]._id,
                productName: "Keyboard",
                price: 79.99,
                quantity: 1,
                subtotal: 79.99
            }
        ]);
        console.log("✓ Created order items");

        // Create Commissions (only for completed orders with registered customers)
        const commissions = await Commission.insertMany([
            {
                orderId: orders[0]._id,
                customerId: customers[0]._id,
                amount: 51.50,
                percentage: 5,
                isApplied: true
            }
        ]);
        console.log("✓ Created commissions");

        // Create Appointments
        const appointments = await Appointment.insertMany([
            {
                customerId: customers[0]._id,
                service: "Product Consultation",
                date: new Date("2026-05-10"),
                timeSlot: "10:00 AM - 11:00 AM",
                status: "Confirmed",
                notes: "Product consultation"
            },
            {
                customerId: customers[1]._id,
                service: "Installation Service",
                date: new Date("2026-05-12"),
                timeSlot: "2:00 PM - 3:00 PM",
                status: "Scheduled",
                notes: "Installation appointment"
            }
        ]);
        console.log("✓ Created appointments");

        // Create Staff
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
        console.log("✓ Created staff");

        console.log("\n✓ Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error.message);
        process.exit(1);
    }
};

// Run seed if this file is executed directly
seedDatabase();
