import mongoose from 'mongoose'
import Product from './models/Product.js'
import OrderItem from './models/OrderItem.js'

const mongoURI = process.env.MONGODB_URI || process.env.URI || process.env.MONGO_URI || 'mongodb://localhost:27017/capstone'
const targetNames = ['Laptop', 'Mouse']
const shouldDelete = String(process.env.EXECUTE_DELETE).toLowerCase() === 'true'

const run = async () => {
  if (!mongoURI) {
    throw new Error('Missing MongoDB URI. Set MONGODB_URI, URI, or MONGO_URI.')
  }

  await mongoose.connect(mongoURI, {
    serverSelectionTimeoutMS: 10000,
  })

  const products = await Product.find({ productName: { $in: targetNames } }).lean()
  const productIds = products.map((p) => p._id)

  const orderItems = await OrderItem.find({
    $or: [
      { productName: { $in: targetNames } },
      { productId: { $in: productIds } },
    ],
  }).lean()

  console.log('Found products:', products.length)
  products.forEach((p) => console.log({ id: p._id.toString(), productName: p.productName, price: p.price }))
  console.log('Found order items:', orderItems.length)
  orderItems.slice(0, 20).forEach((item) =>
    console.log({
      id: item._id.toString(),
      productId: item.productId?.toString(),
      productName: item.productName,
      quantity: item.quantity,
      subtotal: item.subtotal,
      orderId: item.orderId?.toString(),
    })
  )

  if (!shouldDelete) {
    console.log('\nDry run only. To delete, set EXECUTE_DELETE=true and run again.')
    await mongoose.disconnect()
    return
  }

  const deletedOrderItems = await OrderItem.deleteMany({
    $or: [
      { productName: { $in: targetNames } },
      { productId: { $in: productIds } },
    ],
  })

  const deletedProducts = await Product.deleteMany({ productName: { $in: targetNames } })

  console.log(`Deleted order items: ${deletedOrderItems.deletedCount}`)
  console.log(`Deleted products: ${deletedProducts.deletedCount}`)
  await mongoose.disconnect()
}

run().catch((error) => {
  console.error('Error:', error.message)
  process.exit(1)
})
