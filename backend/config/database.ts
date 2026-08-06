import mongoose from "mongoose";

const connectToDb = async () => {
    
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri!);
  } catch (error) {
    console.log("some error has occured" + error);
  }
};
