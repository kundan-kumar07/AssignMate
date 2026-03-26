import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  const [showInput, setShowInput] = useState(false);
  const [task, setTask] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [tasks, setTasks] = useState([]);

  // Load tasks
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");

    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error("Error parsing tasks:", error);
        setTasks([]);
      }
    }
  }, []);

  // Save tasks
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (task.trim() === "") return;

    setTasks([
      ...tasks,
      {
        text: task,
        completed: false,
        date: selectedDate,
        time: selectedTime,
      },
    ]);

    setTask("");
    setSelectedDate("");
    setSelectedTime("");
    setShowInput(false);
  };

  const toggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  const deleteTask = (index) => {
    const updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  // 🔥 Smart status using DATE + TIME
  const getStatus = (date, time) => {
    if (!date || !time) return "";

    const now = new Date();
    const taskDateTime = new Date(`${date}T${time}`);

    if (taskDateTime < now) return "overdue";

    const today = new Date();
    const isToday =
      taskDateTime.toDateString() === today.toDateString();

    if (isToday) return "today";

    return "upcoming";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="p-6 max-w-xl mx-auto">

        {/* CTA */}
        {!showInput && (
          <button
            onClick={() => setShowInput(true)}
            className="w-full py-4 text-lg bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg hover:scale-105 transition"
          >
            🚀 Click to set reminder for your task
          </button>
        )}

        {/* Input */}
        {showInput && (
          <div className="bg-gray-800 p-4 rounded-xl mt-4 shadow-lg space-y-3">

            {/* Task */}
            <input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter your assignment..."
              className="w-full px-4 py-2 rounded-lg text-black"
            />

            {/* Date */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg text-black"
            />

            {/* Time */}
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-2 rounded-lg text-black"
            />

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={addTask}
                className="bg-green-500 px-4 py-2 rounded-lg"
              >
                Add
              </button>

              <button
                onClick={() => setShowInput(false)}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Task List */}
        <div className="mt-6 space-y-3">
          {tasks.map((item, index) => {
            const status = getStatus(item.date, item.time);

            return (
              <div
                key={index}
                className={`p-3 rounded flex justify-between items-center ${
                  status === "overdue"
                    ? "bg-red-900"
                    : status === "today"
                    ? "bg-yellow-800"
                    : "bg-gray-800"
                }`}
              >
                <div>
                  <p
                    onClick={() => toggleComplete(index)}
                    className={`cursor-pointer ${
                      item.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {item.text}
                  </p>

                  {/* Date + Time */}
                  {(item.date || item.time) && (
                    <p className="text-sm">
                      📅 {item.date} ⏰ {item.time}{" "}
                      {status === "overdue" && "🔴 Overdue"}
                      {status === "today" && "🟡 Due Today"}
                      {status === "upcoming" && "🟢 Upcoming"}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => deleteTask(index)}
                  className="text-red-300 hover:text-red-500"
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