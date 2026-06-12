import mongoose from 'mongoose';
import Product from './models/Product.js';
import OrderItem from './models/OrderItem.js';
import Order from './models/Order.js';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/capstone';

try {
  await mongoose.connect(uri);
  const products = await Product.find({ productName: { $in: ['Laptop', 'Mouse'] } }).lean();
  console.log('PRODUCTS', products.map((p) => ({ id: p._id.toString(), name: p.productName, price: p.price })));
  const items = await OrderItem.find({ productName: { $in: ['Laptop', 'Mouse'] } }).lean();
  console.log('ORDERITEMS count', items.length);
  items.slice(0, 20).forEach((item) =>
    console.log({
      id: item._id.toString(),
      pid: item.productId?.toString(),
      productName: item.productName,
      qty: item.quantity,
      subtotal: item.subtotal,
      orderId: item.orderId?.toString(),
    })
  );
  const orders = await Order.find({ _id: { $in: items.map((i) => i.orderId) } })
    .select('referenceNumber status total createdAt')
    .lean();
  console.log('ORDERS', orders.map((o) => ({ id: o._id.toString(), ref: o.referenceNumber, status: o.status, total: o.total })));
  await mongoose.disconnect();
} catch (error) {
  console.error(error);
  process.exit(1);
}
