import express from 'express'
import Task from '../models/Task.js'

const router = express.Router();

// ➕ ADD TASK

router.post("/add", async (req, res) => {
  try {
    const { text, date, time, userId, email } = req.body;

    // ✅ Basic validation
    if (!text?.trim() || !userId || !email) {
      return res.status(400).json({
        success: false,
        message: "Text, userId and email are required",
      });
    }

    // ✅ If date & time provided → validate
    if (date && time) {
      const taskDateTime = new Date(`${date}T${time}`);
      const now = new Date();

      if (taskDateTime < now) {
        return res.status(400).json({
          success: false,
          message: "Cannot set reminder in the past",
        });
      }
    }

    // ✅ Create task
    const newTask = new Task({
      text: text.trim(),
      date: date || "",
      time: time || "",
      userId,
      email,
      notified: false, // 🔥 important for cron
    });

    await newTask.save();

    res.status(201).json({
      success: true,
      message: "Task added successfully",
      data: newTask,
    });

  } catch (error) {
    console.error("❌ Add Task Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error while adding task",
    });
  }
});

// 📥 GET TASKS
router.get("/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🗑️ DELETE TASK
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Update task (mark complete/incomplete)
router.put("/:id", async (req, res) => {
  try {
    const { completed } = req.body;

    if (typeof completed !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid completed value",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { completed },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({ success: true, data: updatedTask });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
});

export default router;