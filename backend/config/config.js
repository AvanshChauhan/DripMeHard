import dotenv from "dotenv";

dotenv.config();
export const config = {
  PORT: process.env.PORT || process.env.LINKED_PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET:process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
  NODE_ENV:process.env.NODE_ENV
};
