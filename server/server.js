import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import startCronJobs from "./config/cronJobs.js";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ FIXED PORT (IMPORTANT)
const PORT = process.env.PORT || 5000;

// 🔥 Proper startup flow
const startServer = async () => {
  try {
    await connectDB();

    // ✅ start cron AFTER DB (no need for long delay)
    startCronJobs();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error);
  }
};

startServer();
