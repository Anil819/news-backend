import mongoose from 'mongoose'
import dns from 'dns'

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    console.error('MongoDB connection error: MONGO_URI is not defined in the environment.')
    process.exit(1)
  }

  if (mongoUri.startsWith('mongodb+srv://')) {
    dns.setServers(['8.8.8.8', '1.1.1.1'])
  }

  try {
    const conn = await mongoose.connect(mongoUri)
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`)
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`)
    process.exit(1)
  }
}

export default connectDB
