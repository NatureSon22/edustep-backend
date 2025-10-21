import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(URI as string);
    console.log("Database connected successfully!");
  } catch (error) {
    console.log(error);
    await mongoose.disconnect();
  }
};

export default connectDB;
