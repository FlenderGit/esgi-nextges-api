import mongoose from "mongoose";
import { ENV } from "./env";

export const connect_database = async () => {
  try {
    await mongoose.connect(ENV.DATABASE_URL);
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection failed: ", error);
    process.exit(1);
  }
};
