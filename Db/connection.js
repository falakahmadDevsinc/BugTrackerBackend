import mongoose from "mongoose";
import config from "../utils/config/config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURL);
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.log("Error Connecting With MongoDB:", error.message);
    process.exit(1);
  }
};

// mongoose
//   .connect(config.mongoURL)
//   .then(() => console.log("MongoDb Connected Successfully! "))
//   .catch((error) => console.log(`Error Connecting to MongoDB ${error}`));
