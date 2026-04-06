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

  // Fetch Tasks
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

  // Add Task
  const addTask = async () => {
    if (!task.trim()) {
      toast.error("Task cannot be empty");
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error("Select date and time");
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

  // Toggle Complete
  const toggleComplete = (index) => {
    const updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/api/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
      toast.success("Task deleted");
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  // Status Logic
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

  const statusConfig = {
    overdue: {
      label: "Overdue",
      dot: "#ef4444",
      bg: "rgba(239,68,68,0.1)",
      color: "#ef4444",
    },
    today: {
      label: "Due Today",
      dot: "#f59e0b",
      bg: "rgba(245,158,11,0.1)",
      color: "#f59e0b",
    },
    upcoming: {
      label: "Upcoming",
      dot: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      color: "#10b981",
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .home-root {
          min-height: 100vh;
          background: #0c0f1a;
          font-family: 'DM Sans', sans-serif;
          color: #e2e8f0;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(251,191,36,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 90% 80%, rgba(99,102,241,0.06) 0%, transparent 50%);
        }

        .page-inner {
          max-width: 680px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        .page-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .page-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          background: linear-gradient(135deg, #fbbf24 0%, #f97316 60%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.1;
          margin-bottom: 8px;
        }

        .page-subtitle {
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 400;
          letter-spacing: 0.02em;
        }

        /* Add Button */
        .add-btn {
          width: 100%;
          padding: 18px 28px;
          background: linear-gradient(135deg, #fbbf24, #f97316);
          color: #0c0f1a;
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          border: none;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 8px 32px rgba(251,191,36,0.25), 0 2px 8px rgba(0,0,0,0.3);
        }

        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(251,191,36,0.35), 0 4px 12px rgba(0,0,0,0.4);
        }

        .add-btn:active { transform: translateY(0); }

        .add-btn-icon {
          width: 22px; height: 22px;
          background: rgba(12,15,26,0.2);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem;
        }

        /* Input Card */
        .input-card {
          background: #141824;
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          padding: 28px;
          margin-top: 20px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
          animation: slideDown 0.3s cubic-bezier(0.16,1,0.3,1);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .input-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #475569;
          margin-bottom: 8px;
          display: block;
        }

        .field-group { margin-bottom: 20px; }

        .text-input {
          width: 100%;
          padding: 14px 18px;
          background: #0c0f1a;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          color: #e2e8f0;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .text-input::placeholder { color: #334155; }

        .text-input:focus {
          border-color: rgba(251,191,36,0.4);
          box-shadow: 0 0 0 3px rgba(251,191,36,0.08);
        }

        .datetime-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 480px) { .datetime-row { grid-template-columns: 1fr; } }

        .action-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 4px;
        }

        .btn-confirm {
          padding: 14px;
          background: linear-gradient(135deg, #fbbf24, #f97316);
          color: #0c0f1a;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(251,191,36,0.2);
        }

        .btn-confirm:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(251,191,36,0.3);
        }

        .btn-cancel {
          padding: 14px;
          background: transparent;
          color: #64748b;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover {
          background: rgba(255,255,255,0.03);
          color: #94a3b8;
          border-color: rgba(255,255,255,0.12);
        }

        /* Divider */
        .section-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 36px 0 24px;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.05);
        }

        .divider-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #334155;
          white-space: nowrap;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 64px 32px;
          color: #334155;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 16px;
          opacity: 0.5;
          display: block;
        }

        .empty-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 6px;
        }

        .empty-sub {
          font-size: 0.85rem;
          color: #334155;
        }

        /* Task List */
        .task-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 62vh;
          overflow-y: auto;
          padding-right: 4px;
          scrollbar-width: thin;
          scrollbar-color: #1e2535 transparent;
        }

        .task-list::-webkit-scrollbar { width: 4px; }
        .task-list::-webkit-scrollbar-track { background: transparent; }
        .task-list::-webkit-scrollbar-thumb { background: #1e2535; border-radius: 4px; }

        /* Task Card */
        .task-card {
          background: #141824;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.22s ease;
          position: relative;
          overflow: hidden;
          animation: fadeUp 0.3s ease both;
        }

        .task-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, #fbbf24, #f97316);
          opacity: 0;
          transition: opacity 0.2s;
        }

        .task-card:hover { 
          border-color: rgba(255,255,255,0.09);
          background: #181d2e;
          transform: translateX(2px);
        }

        .task-card:hover::before { opacity: 1; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .task-check {
          width: 22px; height: 22px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.1);
          cursor: pointer;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          background: transparent;
        }

        .task-check:hover {
          border-color: #fbbf24;
          background: rgba(251,191,36,0.08);
        }

        .task-check.checked {
          background: linear-gradient(135deg, #fbbf24, #f97316);
          border-color: transparent;
        }

        .task-check.checked::after {
          content: '';
          width: 6px; height: 10px;
          border: 2px solid #0c0f1a;
          border-top: none; border-left: none;
          transform: rotate(45deg) translateY(-1px);
          display: block;
        }

        .task-body { flex: 1; min-width: 0; }

        .task-text {
          font-size: 0.95rem;
          font-weight: 500;
          color: #cbd5e1;
          cursor: pointer;
          transition: color 0.2s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.4;
        }

        .task-text:hover { color: #f1f5f9; }
        .task-text.done { text-decoration: line-through; color: #334155; }

        .task-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 6px;
          flex-wrap: wrap;
        }

        .meta-chip {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          color: #475569;
        }

        .meta-chip svg { width: 12px; height: 12px; }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.68rem;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 20px;
        }

        .status-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
        }

        .delete-btn {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.05);
          color: #334155;
          font-size: 0.9rem;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .delete-btn:hover {
          background: rgba(239,68,68,0.1);
          border-color: rgba(239,68,68,0.25);
          color: #ef4444;
          transform: scale(1.05);
        }

        /* Stats bar */
        .stats-row {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          flex: 1;
          background: #141824;
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 14px;
          padding: 14px 18px;
          text-align: center;
        }

        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
          background: linear-gradient(135deg, #fbbf24, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 0.7rem;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 500;
        }
      `}</style>

      <div className="home-root">
        <Navbar />

        <div className="page-inner">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">My Tasks</h1>
            <p className="page-subtitle">Stay focused. Get things done.</p>
          </div>

          {/* Stats */}
          {tasks.length > 0 && (
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-num">{tasks.length}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">{tasks.filter(t => t.completed).length}</div>
                <div className="stat-label">Done</div>
              </div>
              <div className="stat-card">
                <div className="stat-num">{tasks.filter(t => getStatus(t.date, t.time) === "overdue" && !t.completed).length}</div>
                <div className="stat-label">Overdue</div>
              </div>
            </div>
          )}

          {/* Add Button */}
          {!showInput && (
            <button className="add-btn" onClick={() => setShowInput(true)}>
              <span className="add-btn-icon">+</span>
              New Task
            </button>
          )}

          {/* Input Card */}
          {showInput && (
            <div className="input-card">
              <div className="field-group">
                <label className="input-label">What needs to be done?</label>
                <input
                  className="text-input"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Enter your task..."
                  autoFocus
                />
              </div>

              <div className="field-group">
                <label className="input-label">Schedule</label>
                <div className="datetime-row">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime("");
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    className="text-input"
                    style={{ colorScheme: "dark" }}
                  />
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    min={getMinTime()}
                    className="text-input"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>

              <div className="action-row">
                <button className="btn-confirm" onClick={addTask}>
                  Add Task
                </button>
                <button className="btn-cancel" onClick={() => setShowInput(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Divider */}
          {tasks.length > 0 && (
            <div className="section-divider">
              <div className="divider-line" />
              <span className="divider-label">{tasks.length} task{tasks.length !== 1 ? "s" : ""}</span>
              <div className="divider-line" />
            </div>
          )}

          {/* Empty */}
          {tasks.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">◎</span>
              <p className="empty-title">Nothing here yet</p>
              <p className="empty-sub">Add your first task above to get started</p>
            </div>
          )}

          {/* Task List */}
          <div className="task-list">
            {tasks.map((item, index) => {
              const status = getStatus(item.date, item.time);
              const sc = statusConfig[status];

              return (
                <div
                  key={item._id || index}
                  className="task-card"
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  {/* Check circle */}
                  <div
                    className={`task-check ${item.completed ? "checked" : ""}`}
                    onClick={() => toggleComplete(index)}
                  />

                  {/* Body */}
                  <div className="task-body">
                    <p
                      className={`task-text ${item.completed ? "done" : ""}`}
                      onClick={() => toggleComplete(index)}
                    >
                      {item.text}
                    </p>
                    <div className="task-meta">
                      <span className="meta-chip">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="2" y="3" width="12" height="11" rx="2"/>
                          <path d="M5 1v4M11 1v4M2 7h12"/>
                        </svg>
                        {item.date}
                      </span>
                      <span className="meta-chip">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="8" cy="8" r="6"/>
                          <path d="M8 5v3.5l2.5 1.5"/>
                        </svg>
                        {item.time}
                      </span>
                      {sc && (
                        <span
                          className="status-pill"
                          style={{ background: sc.bg, color: sc.color }}
                        >
                          <span className="status-dot" style={{ background: sc.dot }} />
                          {sc.label}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(item._id)}
                    title="Delete task"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}