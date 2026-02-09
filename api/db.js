import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/syriavana");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
