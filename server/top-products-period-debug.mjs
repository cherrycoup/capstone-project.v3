import 'dotenv/config';
import connectDb from './db/connect.js';
import Order from './models/Order.js';

const addDays = (date, days) => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

const run = async () => {
  await connectDb();

  const endDate = new Date();
  const startDate = addDays(endDate, -30);

  const match = { createdAt: { $gte: startDate, $lt: endDate } };

  const rows = await Order.aggregate([
    { $match: { status: 'Completed', createdAt: match.createdAt } },
    {
      $lookup: {
        from: 'orderitems',
        localField: '_id',
        foreignField: 'orderId',
        as: 'items',
      },
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        productName: { $first: '$items.productName' },
        sold: { $sum: '$items.quantity' },
        revenue: { $sum: '$items.subtotal' },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 20 },
  ]);

  console.log('TOP_PRODUCTS_PERIOD');
  console.log('period:', startDate.toISOString(), '->', endDate.toISOString());
  console.log(JSON.stringify(rows.slice(0, 10), null, 2));
  process.exit(0);
};

run().catch((err) => { console.error(err); process.exit(1); });
