import mongoose from "mongoose";
import "dotenv";
import { configDotenv } from "dotenv";
configDotenv();

const connectToMongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    const connect = await mongoose.connect(uri);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.log(error);
  }
};

export default connectToMongoDB;
