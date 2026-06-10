import 'dotenv/config';
import connectDb from './db/connect.js';
import Order from './models/Order.js';
import OrderItem from './models/OrderItem.js';

const addDays = (date, days) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

const run = async () => {
  await connectDb();

  const endDate = new Date();
  const startDate = addDays(endDate, -30);

  const periodMatch = { createdAt: { $gte: startDate, $lt: endDate } };

  const orderBased = await Order.aggregate([
    { $match: { status: 'Completed', createdAt: periodMatch.createdAt } },
    { $lookup: { from: 'orderitems', localField: '_id', foreignField: 'orderId', as: 'items' } },
    { $unwind: '$items' },
    { $group: { _id: '$items.productId', productName: { $first: '$items.productName' }, sold: { $sum: '$items.quantity' }, revenue: { $sum: '$items.subtotal' } } },
    { $sort: { revenue: -1 } },
    { $limit: 20 },
  ]);

  const itemBased = await OrderItem.aggregate([
    { $lookup: { from: 'orders', localField: 'orderId', foreignField: '_id', as: 'order' } },
    { $unwind: '$order' },
    { $match: { 'order.status': 'Completed', 'order.createdAt': periodMatch.createdAt } },
    { $group: { _id: '$productId', productName: { $first: '$productName' }, sold: { $sum: '$quantity' }, revenue: { $sum: '$subtotal' } } },
    { $sort: { revenue: -1 } },
    { $limit: 20 },
  ]);

  console.log('PERIOD:', startDate.toISOString(), '->', endDate.toISOString());
  console.log('\n--- Order-based aggregation ---');
  console.log(JSON.stringify(orderBased.slice(0, 10), null, 2));
  console.log('\n--- OrderItem-based aggregation ---');
  console.log(JSON.stringify(itemBased.slice(0, 10), null, 2));
  process.exit(0);
};

run().catch((err) => { console.error(err); process.exit(1); });
