import 'dotenv/config';
import connectDb from './db/connect.js';
import Order from './models/Order.js';

const DAY_MS = 24 * 60 * 60 * 1000;
const addDays = (date, days) => new Date(date.getTime() + days * DAY_MS);
const startOfDay = (date) => { const d = new Date(date); d.setHours(0,0,0,0); return d; };
const startOfWeek = (date) => { const next = startOfDay(date); const day = next.getDay(); const mondayOffset = day === 0 ? -6 : 1 - day; return addDays(next, mondayOffset); };

const run = async () => {
  await connectDb();

  // Mimic frontend: period=weekly, offset=1 -> previous calendar week (Monday-Sunday)
  const offset = 1;
  const now = new Date();
  const latestStart = startOfWeek(now);
  const startDate = addDays(latestStart, -7 * offset);
  const endDate = addDays(startDate, 7);

  const rows = await Order.aggregate([
    { $match: { status: 'Completed', createdAt: { $gte: startDate, $lt: endDate } } },
    { $lookup: { from: 'orderitems', localField: '_id', foreignField: 'orderId', as: 'items' } },
    { $unwind: '$items' },
    { $group: { _id: '$items.productId', productName: { $first: '$items.productName' }, sold: { $sum: '$items.quantity' }, revenue: { $sum: '$items.subtotal' } } },
    { $sort: { revenue: -1 } },
    { $limit: 20 },
  ]);

  console.log('FRONTEND PARAMS: period=weekly, offset=1');
  console.log('period range:', startDate.toISOString(), '->', endDate.toISOString());
  console.log('TOP PRODUCTS FOR THAT WINDOW:');
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
};

run().catch((err) => { console.error(err); process.exit(1); });
