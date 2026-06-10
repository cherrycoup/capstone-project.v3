import 'dotenv/config';
import connectDb from './db/connect.js';
import Order from './models/Order.js';

const run = async () => {
  await connectDb();
  const methods = await Order.aggregate([
    { $group: { _id: '$paymentMethod', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  console.log('PAYMENT_METHODS');
  console.log(JSON.stringify(methods, null, 2));
  const normalized = await Order.aggregate([
    {
      $addFields: {
        normalizedPaymentMethod: {
          $trim: {
            input: { $toLower: { $ifNull: ['$paymentMethod', ''] } },
          },
        },
      },
    },
    {
      $group: {
        _id: '$normalizedPaymentMethod',
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  console.log('NORMALIZED_PAYMENT_METHODS');
  console.log(JSON.stringify(normalized, null, 2));
  process.exit(0);
};
run().catch((err) => { console.error(err); process.exit(1); });
