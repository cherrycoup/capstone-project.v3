import mongoose from "mongoose";
import Order from "./models/Order.js";
import OrderItem from "./models/OrderItem.js";
import Product from "./models/Product.js";

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/capstone";

async function debugTopProducts() {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB\n");

    // Define date range (last 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    console.log("📅 Date Range:", sevenDaysAgo.toISOString(), "to", now.toISOString());
    console.log("\n" + "=".repeat(80) + "\n");

    // Step 1: Get all completed orders in period
    console.log("STEP 1: Completed Orders in Period");
    const completedOrders = await Order.find({
      createdAt: { $gte: sevenDaysAgo, $lt: now },
      status: "Completed",
    })
      .select("_id referenceNumber total status")
      .lean();

    console.log(`Found ${completedOrders.length} completed orders\n`);
    if (completedOrders.length === 0) {
      console.log("❌ No completed orders found! Check your data.\n");
      process.exit(0);
    }

    const orderIds = completedOrders.map((o) => o._id);
    console.log(`Order IDs: ${orderIds.map((id) => id.toString()).join(", ")}\n`);

    // Step 2: Get all orderitems for these orders
    console.log("STEP 2: OrderItems for These Orders");
    const orderItems = await OrderItem.find({ orderId: { $in: orderIds } }).lean();

    console.log(`Found ${orderItems.length} order items\n`);

    if (orderItems.length === 0) {
      console.log("❌ No order items found! OrderItems collection may be empty.\n");
      process.exit(0);
    }

    // Group by productId
    const itemsByProduct = {};
    const missingProductIds = [];
    const missingOrders = [];

    orderItems.forEach((item) => {
      if (!item.productId) {
        missingProductIds.push(item._id);
        return;
      }

      const productId = item.productId.toString();
      if (!itemsByProduct[productId]) {
        itemsByProduct[productId] = [];
      }
      itemsByProduct[productId].push(item);
    });

    console.log(`Order items grouped by product: ${Object.keys(itemsByProduct).length} unique products`);
    console.log(`Items with missing productId: ${missingProductIds.length}\n`);

    // Step 3: Check products in database
    console.log("STEP 3: Products in Database");
    const allProducts = await Product.find().select("_id productName price category").lean();
    console.log(`Total products in database: ${allProducts.length}\n`);

    // Step 4: For each product with sales, check if it exists
    console.log("STEP 4: Sales Analysis");
    const productSalesData = [];

    for (const [productId, items] of Object.entries(itemsByProduct)) {
      const product = allProducts.find((p) => p._id.toString() === productId);
      const totalQty = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      const totalSubtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      const calculatedRevenue = totalQty * (product?.price || 0);

      productSalesData.push({
        productId,
        productName: product?.productName || "❌ MISSING FROM PRODUCTS",
        found: !!product,
        quantity: totalQty,
        itemCount: items.length,
        storedSubtotal: totalSubtotal,
        currentPrice: product?.price || "N/A",
        calculatedRevenue,
      });
    }

    // Sort by calculated revenue
    productSalesData.sort((a, b) => b.calculatedRevenue - a.calculatedRevenue);

    console.log("Top Products by Calculated Revenue:\n");
    productSalesData.forEach((data, idx) => {
      const statusIcon = data.found ? "✅" : "❌";
      console.log(`${idx + 1}. ${statusIcon} ${data.productName}`);
      console.log(`   Product ID: ${data.productId}`);
      console.log(`   Quantity Sold: ${data.quantity} units (${data.itemCount} order items)`);
      console.log(`   Current Price: PHP ${data.currentPrice}`);
      console.log(`   Calculated Revenue: PHP ${data.calculatedRevenue.toFixed(2)}`);
      console.log(`   Stored Subtotal (old): PHP ${data.storedSubtotal.toFixed(2)}`);
      if (data.storedSubtotal !== data.calculatedRevenue) {
        console.log(`   ⚠️  MISMATCH: Stored vs Calculated (diff: PHP ${Math.abs(data.storedSubtotal - data.calculatedRevenue).toFixed(2)})`);
      }
      console.log();
    });

    // Step 5: Run the actual aggregation and compare
    console.log("=".repeat(80));
    console.log("\nSTEP 5: Actual MongoDB Aggregation Result\n");

    const match = { createdAt: { $gte: sevenDaysAgo, $lt: now } };

    const aggregationResult = await Order.aggregate([
      { $match: { ...match, status: "Completed" } },
      {
        $lookup: {
          from: "orderitems",
          localField: "_id",
          foreignField: "orderId",
          as: "items",
        },
      },
      { $unwind: "$items" },
      { $match: { "items.productId": { $ne: null } } },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$items.productId",
          productName: { $last: "$productInfo.productName" },
          sold: { $sum: "$items.quantity" },
          quantity: { $sum: "$items.quantity" },
          price: { $last: "$productInfo.price" },
        },
      },
      {
        $addFields: {
          calculatedRevenue: {
            $multiply: ["$quantity", { $ifNull: ["$price", 0] }],
          },
        },
      },
      { $sort: { calculatedRevenue: -1 } },
      { $limit: 8 },
    ]);

    console.log("Aggregation returned:\n");
    aggregationResult.forEach((row, idx) => {
      console.log(`${idx + 1}. ${row.productName || "UNKNOWN"}`);
      console.log(`   Sold: ${row.sold}`);
      console.log(`   Price: ${row.price}`);
      console.log(`   Revenue: ${row.calculatedRevenue}`);
      console.log();
    });

    // Step 6: Compare
    console.log("=".repeat(80));
    console.log("\nSTEP 6: Comparison\n");

    console.log(`Expected top products (from manual analysis): ${productSalesData.length}`);
    console.log(`Aggregation returned: ${aggregationResult.length}`);

    if (productSalesData.length !== aggregationResult.length) {
      console.log(
        `⚠️  COUNT MISMATCH: Expected ${productSalesData.length} products, got ${aggregationResult.length}`
      );
    }

    for (let i = 0; i < Math.max(productSalesData.length, aggregationResult.length); i++) {
      const expected = productSalesData[i];
      const actual = aggregationResult[i];

      if (!expected) {
        console.log(`\n❌ Position ${i + 1}: Expected missing, Actual: ${actual.productName}`);
        continue;
      }
      if (!actual) {
        console.log(`\n❌ Position ${i + 1}: Expected: ${expected.productName}, Actual missing`);
        continue;
      }

      if (expected.productId === actual._id.toString()) {
        console.log(`\n✅ Position ${i + 1}: ${actual.productName} (match)`);
      } else {
        console.log(`\n❌ Position ${i + 1}: Expected ${expected.productName}, got ${actual.productName}`);
      }

      if (Math.abs(expected.calculatedRevenue - actual.calculatedRevenue) > 0.01) {
        console.log(
          `   Revenue mismatch: expected ${expected.calculatedRevenue}, got ${actual.calculatedRevenue}`
        );
      }
    }

    console.log("\n" + "=".repeat(80));
    console.log("\nDEBUG COMPLETE\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

debugTopProducts();
