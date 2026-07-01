import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })
console.log('MONGO_URI=' + process.env.MONGO_URI)
try {
  const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  console.log('Connected', conn.connection.host, conn.connection.name)
  await mongoose.disconnect()
} catch (err) {
  console.error('ERR:', err.name, err.message)
  process.exit(1)
}
