import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import BlockedDate from "./models/BlockedDate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".env") });

async function blockWeekends() {
    try {
        const mongoUri = process.env.URI || process.env.MONGODB_URI || "mongodb://localhost:27017/jbm-electro";
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB");

        // Generate dates for the next 2 years
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 2);
        endDate.setHours(0, 0, 0, 0);

        const weekendDates = [];
        const currentDate = new Date(startDate);

        while (currentDate < endDate) {
            const dayOfWeek = currentDate.getDay();
            // Saturday = 6, Sunday = 0
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                weekendDates.push(new Date(currentDate));
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        console.log(`Found ${weekendDates.length} weekend dates to block`);

        // Check which dates are already blocked
        const existingBlockedDates = await BlockedDate.find({
            date: { $in: weekendDates }
        });

        const existingDates = new Set(
            existingBlockedDates.map(d => d.date.toISOString().slice(0, 10))
        );

        // Filter out already blocked dates
        const newDatesToBlock = weekendDates.filter(
            d => !existingDates.has(d.toISOString().slice(0, 10))
        );

        console.log(`${newDatesToBlock.length} new weekend dates to add`);

        if (newDatesToBlock.length > 0) {
            const docsToInsert = newDatesToBlock.map(date => ({
                date: date,
                reason: "Weekend (Automatically blocked)"
            }));

            await BlockedDate.insertMany(docsToInsert);
            console.log(`✓ Successfully blocked ${newDatesToBlock.length} weekend dates`);
        } else {
            console.log("All weekend dates are already blocked");
        }

        const totalBlocked = await BlockedDate.countDocuments();
        console.log(`Total blocked dates in database: ${totalBlocked}`);

    } catch (error) {
        console.error("Error blocking weekends:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed");
        process.exit(0);
    }
}

blockWeekends();
