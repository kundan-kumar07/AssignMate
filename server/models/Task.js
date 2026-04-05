import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    date: {
      type: String,
    },

    time: {
      type: String,
    },

    userId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    notified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
