import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useUser } from "@clerk/react";
import axios from "axios";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_API;

export default function Home() {
  const { user } = useUser();

  const [showInput, setShowInput] = useState(false);
  const [task, setTask] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [tasks, setTasks] = useState([]);

  // 🔥 Fetch Tasks
  useEffect(() => {
    if (!user?.id) return;

    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${API}/api/tasks/${user.id}`);
        setTasks(res.data);
      } catch (err) {
        toast.error("Failed to fetch tasks");
      }
    };

    fetchTasks();
  }, [user]);

  // 🔥 Add Task
  const addTask = async () => {
    if (!task.trim()) {
      toast.error("Task cannot be empty");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Select date and time");
      return;
    }

    // ✅ Ensure correct format HH:MM
    if (!selectedTime.includes(":")) {
      toast.error("Invalid time format");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/tasks/add`, {
        text: task,
        date: selectedDate,
        time: selectedTime,
        userId: user?.id,
        email: user?.primaryEmailAddress?.emailAddress,
      });

      if (res.data.success) {
        setTasks((prev) => [...prev, res.data.data]);
        toast.success("Task added successfully");
      }

      setTask("");
      setSelectedDate("");
      setSelectedTime("");
      setShowInput(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  // 🔥 Toggle Complete
  const toggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  // 🔥 Delete Task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/api/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  // 🔥 FIXED Status Logic (no timezone bug)
  const getStatus = (date, time) => {
    if (!date || !time) return "";

    const today = new Date().toISOString().split("T")[0];

    if (date < today) return "overdue";
    if (date > today) return "upcoming";

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    const [hours, minutes] = time.split(":").map(Number);
    const taskMinutes = hours * 60 + minutes;

    if (taskMinutes < nowMinutes) return "overdue";

    return "today";
  };

  // 🔥 Dynamic Min Time
  const getMinTime = () => {
    const today = new Date().toISOString().split("T")[0];

    if (selectedDate === today) {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");

      return `${hours}:${minutes}`;
    }

    return "00:00";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <Navbar />

      <div className="p-4 sm:p-6 md:p-8 max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center">
          📋 Your Tasks
        </h1>

        {!showInput && (
          <button
            onClick={() => setShowInput(true)}
            className="w-full py-3 sm:py-4 text-base sm:text-lg bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg transition transform hover:scale-105"
          >
            ➕ Add New Task
          </button>
        )}

        {showInput && (
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl mt-5 shadow-xl space-y-4 border border-white/20">
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter your task..."
              className="w-full px-4 py-2 sm:py-3 rounded-lg bg-transparent border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime("");
                }}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 rounded-xl text-white"
              />

              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                min={getMinTime()}
                className="w-full px-3 py-2 rounded-xl text-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={addTask}
                className="flex-1 bg-green-500 hover:bg-green-600 py-2 sm:py-3 rounded-lg transition"
              >
                ✅ Add
              </button>

              <button
                onClick={() => setShowInput(false)}
                className="flex-1 bg-red-500 hover:bg-red-600 py-2 sm:py-3 rounded-lg transition"
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <div className="text-center mt-10 text-gray-400">
            <p className="text-lg sm:text-xl">😴 No tasks yet</p>
            <p className="text-sm">Add your first task above</p>
          </div>
        )}

        <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {tasks.map((item, index) => {
            const status = getStatus(item.date, item.time);

            const statusColor =
              status === "overdue"
                ? "bg-red-500"
                : status === "today"
                ? "bg-yellow-500"
                : "bg-green-500";

            return (
              <div
                key={item._id || index}
                className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-lg border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:scale-[1.02] transition"
              >
                <div className="w-full">
                  <p
                    onClick={() => toggleComplete(index)}
                    className={`text-base sm:text-lg cursor-pointer ${
                      item.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {item.text}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm mt-1">
                    <span>📅 {item.date}</span>
                    <span>⏰ {item.time}</span>

                    {status && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs text-black ${statusColor}`}
                      >
                        {status}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => deleteTask(item._id)}
                  className="self-end sm:self-auto text-red-400 hover:text-red-600 text-lg sm:text-xl transition"
                >
                  🗑️
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}