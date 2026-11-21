import mongoose from 'mongoose';
import { seedDatabaseIfEmpty } from './seed.js';

let isConnected = false;

/**
 * Sanitizes MongoDB URIs to prevent leaking credentials in logs and outputs
 */
export function sanitizeMongoUri(uri: string): string {
  try {
    return uri.replace(/:([^:@]+)@/, ':****@');
  } catch {
    return 'mongodb://[credentials-hidden]';
  }
}

/**
 * Checks if current configured connection points to MongoDB Atlas
 */
export function isAtlasConnection(): boolean {
  const mongoUri = process.env.MONGODB_URI || '';
  return isDbConnected() && (mongoUri.startsWith('mongodb+srv://') || mongoUri.includes('.mongodb.net'));
}

export async function connectDB(): Promise<boolean> {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/qwca_database';
  const isAtlas = mongoUri.startsWith('mongodb+srv://') || mongoUri.includes('.mongodb.net');

  try {
    mongoose.set('strictQuery', false);

    // Production-hardened connection settings for both Atlas cloud and local Docker
    const options: mongoose.ConnectOptions = {
      serverSelectionTimeoutMS: 10000, // 10 seconds for Atlas cloud DNS/SRV resolution
      socketTimeoutMS: 45000,          // Close inactive sockets after 45s
      maxPoolSize: 10,                 // Connection pool limit
      minPoolSize: 2,                  // Minimum warm connections
      retryWrites: true,
      retryReads: true,
    };

    await mongoose.connect(mongoUri, options);
    isConnected = true;

    console.log(
      `[Database] MongoDB successfully connected (${isAtlas ? 'MongoDB Atlas Cloud' : 'Local / Docker'}) to ${sanitizeMongoUri(mongoUri)}`
    );

    // Automatically seed statutory tax slabs & admin if database is empty
    await seedDatabaseIfEmpty();

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

mongoose.connection.on('connected', () => {
  isConnected = true;
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error('[Database] MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('[Database] MongoDB disconnected.');
});

mongoose.connection.on('reconnected', () => {
  isConnected = true;
  console.log('[Database] MongoDB reconnected.');
});
