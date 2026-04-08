import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config({ path: "./config.env" });
import app from "./app.js";
import { setupWSS } from "./wsServer.js";
const connectDB = async function () {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
connectDB();
const server = app.listen(3000, () => {
  console.log("server is running in port 3000");
});
setupWSS(server);
