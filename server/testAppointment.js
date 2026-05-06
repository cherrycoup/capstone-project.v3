import mongoose from "mongoose";
import dotenv from "dotenv";
import Customer from "./models/Customer.js";
import Appointment from "./models/Appointment.js";
import connectDb from "./db/connect.js";

dotenv.config();

const testAppointment = async () => {
    try {
        await connectDb();
        
        // Create a test customer
        const customer = await Customer.create({
            name: "Test Customer",
            contactInfo: {
                email: "test@example.com",
                phone: "555-1234",
                address: "123 Test St, Test City"
            }
        });
        
        console.log("✓ Created test customer:", customer._id);
        
        // Create a test appointment
        const appointment = await Appointment.create({
            customerId: customer._id,
            service: "Test Consultation",
            date: new Date("2026-05-10"),
            timeSlot: "10:00 AM - 11:00 AM",
            status: "Scheduled",
            notes: "Test appointment for verification"
        });
        
        console.log("✓ Created test appointment:", appointment._id);
        
        // Verify the appointment was created
        const allAppointments = await Appointment.find().populate("customerId", "name contactInfo");
        console.log("✓ Total appointments in database:", allAppointments.length);
        
        if (allAppointments.length > 0) {
            console.log("✓ Sample appointment:", {
                id: allAppointments[0]._id,
                customer: allAppointments[0].customerId?.name,
                service: allAppointments[0].service,
                date: allAppointments[0].date,
                timeSlot: allAppointments[0].timeSlot,
                status: allAppointments[0].status
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
};

testAppointment();
