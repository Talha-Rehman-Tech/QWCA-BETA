import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/qwca_database';

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[Database] MongoDB successfully connected to ${mongoUri}`);
    return true;
  } catch (error: any) {
    isConnected = false;
    console.warn(`[Database] MongoDB connection warning: ${error.message}`);
    console.warn('[Database] Operating with resilient in-memory fallback cache.');
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('[Database] MongoDB disconnected.');
});
