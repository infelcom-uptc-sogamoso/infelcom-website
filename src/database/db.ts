import mongoose from 'mongoose';

let connecting: Promise<typeof mongoose> | null = null;

/** Opens the shared connection once; concurrent callers await the same attempt. */
export const connect = async () => {
  if (mongoose.connection.readyState === 1) return;
  // Fail fast so a down database degrades to default content instead of hanging requests.
  connecting ??= mongoose
    .connect(process.env.MONGO_URL || '', { serverSelectionTimeoutMS: 5000 })
    .catch((error) => {
      connecting = null; // allow a retry on the next request
      throw error;
    });
  await connecting;
};

/**
 * Intentionally a no-op: the connection is shared by concurrent requests, and closing it after
 * each query made parallel requests fail with MongoNotConnectedError. Mongoose keeps a pool.
 */
export const disconnect = async () => {};
