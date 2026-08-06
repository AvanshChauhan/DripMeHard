import mongoose from "mongoose";
import { config } from "./config.js";

export const connectToDb = async () => {
  if (!config.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    const connection = await mongoose.connect(config.MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error("MongoDB connection failed", error);
    throw error;
  }
};
