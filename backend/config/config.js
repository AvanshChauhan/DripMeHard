import dotenv from "dotenv";

dotenv.config();
if(!process.env.GOOGLE_CLIENT_ID){
  throw new Error("Google id is not defined in the enviroment variable")
}
if(!process.env.GOOGLE_CLIENT_SERCRET){
  throw new Error("Google secret is not defined in the enviroment variable")
}
export const config = {
  PORT: process.env.PORT || process.env.LINKED_PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET:process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SERCRET:process.env.GOOGLE_CLIENT_SERCRET
};
