import mongoose from "mongoose";
import Order from "./models/Order.js";
import OrderItem from "./models/OrderItem.js";

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/capstone";

async function checkDataQuality() {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Connected\n");

    // Check collection name
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);
    const hasOrderItems = collectionNames.includes("orderitems");
    console.log(hasOrderItems ? "✅ 'orderitems' collection exists" : "❌ 'orderitems' NOT found");
    console.log(`   Available: ${collectionNames.join(", ")}\n`);

    // Check for missing productId
    const itemsWithoutPID = await OrderItem.countDocuments({ productId: null });
    const totalItems = await OrderItem.countDocuments();
    console.log(`📦 OrderItems without productId: ${itemsWithoutPID}/${totalItems} (${((itemsWithoutPID/totalItems)*100).toFixed(1)}%)`);

    // Check a sample orderitem
    const sampleItem = await OrderItem.findOne().lean();
    if (sampleItem) {
      console.log(`\n📋 Sample OrderItem:`, JSON.stringify(sampleItem, null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkDataQuality();
