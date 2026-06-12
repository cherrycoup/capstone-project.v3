import 'dotenv/config';
import connectDb from './db/connect.js';
import Order from './models/Order.js';

const addDays = (date, days) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

const aggregateForWindow = async (days) => {
  const endDate = new Date();
  const startDate = addDays(endDate, -days);

  const rows = await Order.aggregate([
    { $match: { status: 'Completed', createdAt: { $gte: startDate, $lt: endDate } } },
    { $lookup: { from: 'orderitems', localField: '_id', foreignField: 'orderId', as: 'items' } },
    { $unwind: '$items' },
    { $group: { _id: '$items.productId', productName: { $first: '$items.productName' }, sold: { $sum: '$items.quantity' }, revenue: { $sum: '$items.subtotal' } } },
    { $sort: { revenue: -1 } },
    { $limit: 20 },
  ]);

  return { days, startDate, endDate, rows };
};

const run = async () => {
  await connectDb();

  const w7 = await aggregateForWindow(7);
  const w30 = await aggregateForWindow(30);

  console.log('=== TOP PRODUCTS: last 7 days ===');
  console.log('period:', w7.startDate.toISOString(), '->', w7.endDate.toISOString());
  console.log(JSON.stringify(w7.rows, null, 2));

  console.log('\n=== TOP PRODUCTS: last 30 days ===');
  console.log('period:', w30.startDate.toISOString(), '->', w30.endDate.toISOString());
  console.log(JSON.stringify(w30.rows, null, 2));

  process.exit(0);
};

run().catch((err) => { console.error(err); process.exit(1); });
