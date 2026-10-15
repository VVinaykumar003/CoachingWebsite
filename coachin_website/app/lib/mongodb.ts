import mongoose from "mongoose";
import dns from "node:dns";

// Ensure reliable DNS resolution for MongoDB Atlas SRV records on Windows/Node environments
try {
  dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
} catch (e) {
  // Ignored if custom DNS servers cannot be set in this runtime
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI;
  if (!uri) {
    throw new Error("MongoDB URI is missing. Please set MONGODB_URI or MONGODB_ATLAS_URI in your environment variables.");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}