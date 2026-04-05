import mongoose from "mongoose";


const connectDB = async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");

    await mongoose.connect(`${process.env.MONGODB_URL}/Assignmate`, {
      serverSelectionTimeoutMS: 10000, // wait 10 sec before timeout
    });

    console.log("✅ MongoDB Connected");

    // Events
    mongoose.connection.on("error", (err) => {
      console.log("❌ MongoDB Error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB Disconnected");
    });

  } catch (error) {
    console.log("❌ Initial DB connection failed:", error.message);

    // 🔁 Retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;