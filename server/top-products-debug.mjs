import 'dotenv/config';
import connectDb from './db/connect.js';
import OrderItem from './models/OrderItem.js';

const run = async () => {
  await connectDb();

  const rows = await OrderItem.aggregate([
    {
      $lookup: {
        from: 'orders',
        localField: 'orderId',
        foreignField: '_id',
        as: 'order',
      },
    },
    { $unwind: '$order' },
    { $match: { 'order.status': 'Completed' } },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: '$productId',
        product: { $first: '$product.productName' },
        sold: { $sum: '$quantity' },
        revenue: { $sum: '$subtotal' },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 20 },
  ]);

  console.log('TOP_PRODUCTS_FROM_ORDERS');
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
};

run().catch((err) => { console.error(err); process.exit(1); });
