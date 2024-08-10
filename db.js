const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.configDotenv();

const connectToMongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log(uri);
    const connect = await mongoose.connect(uri);
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToMongoDB;
