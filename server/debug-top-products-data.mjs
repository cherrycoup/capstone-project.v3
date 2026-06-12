import mongoose from "mongoose";
import Order from "./models/Order.js";
import OrderItem from "./models/OrderItem.js";
import Product from "./models/Product.js";

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/capstone";

async function debugTopProductsData() {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB\n");

    // 1. Check collection names
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);
    console.log("📋 Available collections:");
    collectionNames.forEach((name) => console.log(`   - ${name}`));

    const hasOrderItems = collectionNames.includes("orderitems");
    console.log(`\n${hasOrderItems ? "✅" : "❌"} orderitems collection exists\n`);

    // 2. Check last 5 orderitems for missing productId
    console.log("📦 Checking OrderItem records for missing productId:");
    const orderItems = await OrderItem.find().limit(5).lean();
    if (orderItems.length === 0) {
      console.log("   ⚠️  No orderitems found in database\n");
    } else {
      orderItems.forEach((item, idx) => {
        const hasPID = item.productId ? "✅" : "❌";
        const hasSubtotal = item.subtotal ? "✅" : "❌";
        const hasQty = item.quantity ? "✅" : "❌";
        console.log(`   Item ${idx + 1}: ${hasPID} productId | ${hasQty} quantity | ${hasSubtotal} subtotal`);
        if (!item.productId) {
          console.log(`      → Missing productId: ${JSON.stringify(item, null, 2)}`);
        }
      });
    }

    // 3. Check if subtotal matches calculation (quantity * unit price)
    console.log("\n💰 Checking subtotal accuracy (quantity × price):");
    const itemsWithProduct = await OrderItem.aggregate([
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
    ]);

    if (itemsWithProduct.length === 0) {
      console.log("   ⚠️  No orderitems found to check\n");
    } else {
      itemsWithProduct.forEach((item, idx) => {
        const qty = item.quantity || 0;
        const price = item.product?.price || 0;
        const storedSubtotal = item.subtotal || 0;
        const calculatedSubtotal = qty * price;
        const match = Math.abs(storedSubtotal - calculatedSubtotal) < 0.01 ? "✅" : "❌";
        console.log(`   Item ${idx + 1}: ${match} Stored: $${storedSubtotal} | Calc: $${calculatedSubtotal} (${qty} × $${price})`);
      });
    }

    // 4. Run the actual top products aggregation and show results
    console.log("\n🎯 Top Products Aggregation Results (Last 7 days):");
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo, $lt: now },
          status: "Completed",
        },
      },
      {
        $lookup: {
          from: "orderitems",
          localField: "_id",
          foreignField: "orderId",
          as: "items",
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          sold: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.subtotal" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
      { $sort: { revenue: -1 } },
      { $limit: 8 },
    ]);

    if (topProducts.length === 0) {
      console.log("   ⚠️  No completed orders found in the last 7 days\n");
    } else {
      console.log(`   Found ${topProducts.length} products:\n`);
      topProducts.forEach((product, idx) => {
        const name = product.product?.productName || "❌ UNKNOWN";
        const sold = product.sold || 0;
        const revenue = product.revenue || 0;
        console.log(`   ${idx + 1}. ${name}`);
        console.log(`      Sold: ${sold} units | Revenue: $${revenue.toFixed(2)}`);
        console.log(`      Product ID: ${product._id}`);
      });
    }

    // 5. Count statistics
    console.log("\n📊 Statistics:");
    const totalOrderItems = await OrderItem.countDocuments();
    const itemsWithoutProductId = await OrderItem.countDocuments({ productId: null });
    const completedOrders = await Order.countDocuments({ status: "Completed" });

    console.log(`   Total OrderItems: ${totalOrderItems}`);
    console.log(`   OrderItems without productId: ${itemsWithoutProductId} (${((itemsWithoutProductId / totalOrderItems) * 100).toFixed(1)}%)`);
    console.log(`   Completed Orders: ${completedOrders}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

debugTopProductsData();
