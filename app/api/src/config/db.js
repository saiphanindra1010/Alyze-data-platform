import mongoose from "mongoose";
import dotenv from "dotenv";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("connected to DB");
  } catch (error) {
    console.error(error);
    process.exit();
  }
};
export default connectDB;
