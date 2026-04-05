import cron from "node-cron";
import mongoose from "mongoose";
import Task from "../models/Task.js";
import sendEmail from "./sendEmail.js";

let isRunning = false;

// 📩 Build email content
const buildEmailContent = (tasks, title) => {
  let message = `${title}\n\nYour Tasks:\n\n`;

  tasks.forEach((task, i) => {
    message += `${i + 1}. ${task.text}\n📅 ${task.date} ⏰ ${task.time}\n\n`;
  });

  return message;
};

const startCronJobs = () => {

  // 🔔 1. 10-MIN BEFORE REMINDER
  cron.schedule("* * * * *", async () => {
    if (isRunning) return;
    if (mongoose.connection.readyState !== 1) return;

    isRunning = true;

    console.log("⏰ Checking reminders...");

    const now = new Date();

    try {
      const tasks = await Task.find({
        completed: false,
        notified: false,
      }).limit(50);

      for (const task of tasks) {
        if (!task.date || !task.time || !task.email) continue;

        const taskTime = new Date(`${task.date}T${task.time}:00`);
        const reminderTime = new Date(taskTime.getTime() - 10 * 60 * 1000);

        // ✅ Send ONLY once
        if (now >= reminderTime && !task.notified) {
          console.log("🔔 Sending:", task.text);

          const success = await sendEmail(
            task.email,
            `Reminder: ${task.text}\nTime: ${task.time}`
          );

          if (success) {
            task.notified = true;
            await task.save();
          }
        }
      }

    } catch (err) {
      console.log("❌ Cron error:", err.message);
    } finally {
      isRunning = false;
    }
  });

  // 🌅 2. MORNING (9 AM → TODAY TASKS)
  cron.schedule(
    "0 9 * * *",
    async () => {
      if (mongoose.connection.readyState !== 1) return;

      console.log("🌅 Morning reminder...");

      try {
        const today = new Date().toLocaleDateString("en-CA");

        const tasks = await Task.find({
          completed: false,
          date: today,
        });

        if (tasks.length === 0) return;

        const grouped = {};

        tasks.forEach((t) => {
          if (!t.email) return;
          if (!grouped[t.email]) grouped[t.email] = [];
          grouped[t.email].push(t);
        });

        for (const email in grouped) {
          await sendEmail(
            email,
            buildEmailContent(grouped[email], "🌅 Today's Tasks")
          );
        }

      } catch (err) {
        console.log("❌ Morning error:", err.message);
      }
    },
    { timezone: "Asia/Kolkata" }
  );

  // 🌆 3. EVENING (6:30 PM → OVERDUE TASKS)
  cron.schedule(
    "30 18 * * *",
    async () => {
      if (mongoose.connection.readyState !== 1) return;

      console.log("🌆 Evening reminder...");

      try {
        const today = new Date().toLocaleDateString("en-CA");

        const tasks = await Task.find({
          completed: false,
          date: { $lt: today },
        });

        if (tasks.length === 0) return;

        const grouped = {};

        tasks.forEach((t) => {
          if (!t.email) return;
          if (!grouped[t.email]) grouped[t.email] = [];
          grouped[t.email].push(t);
        });

        for (const email in grouped) {
          await sendEmail(
            email,
            buildEmailContent(grouped[email], "⚠️ Overdue Tasks")
          );
        }

      } catch (err) {
        console.log("❌ Evening error:", err.message);
      }
    },
    { timezone: "Asia/Kolkata" }
  );
};

export default startCronJobs;