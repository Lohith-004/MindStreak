import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import {
  Home,
  CalendarDays,
  Brain,
  Flame,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";

function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const [dark, setDark] = useState(false);

  const [sessions, setSessions] = useState([]);
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("");
  const [task, setTask] = useState("");

  const [insights, setInsights] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const [streakDetails, setStreakDetails] = useState({});
  const [date, setDate] = useState(new Date());

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 🌙 Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    fetchSessions();
    fetchStreakDetails();
  }, []);

  const fetchSessions = async () => {
    const res = await axios.get(`${API}/api/study`, {
      headers: { Authorization: token },
    });
    setSessions(res.data);
  };

  const fetchStreakDetails = async () => {
    const res = await axios.get(`${API}/api/study/streak-details`, {
      headers: { Authorization: token },
    });
    setStreakDetails(res.data);
  };

  const addSession = async () => {
    if (!subject || !hours || !task) return;

    await axios.post(
      `${API}/api/study/add`,
      { subject, hours, task },
      { headers: { Authorization: token } },
    );

    setSubject("");
    setHours("");
    setTask("");

    fetchSessions();
    fetchStreakDetails();
  };

  const toggleStatus = async (id) => {
    await axios.put(
      `${API}/api/study/toggle/${id}`,
      {},
      { headers: { Authorization: token } },
    );

    fetchSessions();
    fetchStreakDetails();
  };

  const getInsights = async () => {
    setLoadingAI(true);
    try {
      const res = await axios.get(`${API}/api/ai/insights`, {
        headers: { Authorization: token },
      });
      setInsights(res.data.insights);
    } catch {
      setInsights("AI temporarily unavailable");
    }
    setLoadingAI(false);
  };

  // 🔥 LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // 📅 Calendar
  const completedDates = sessions
    .filter((s) => s.completed)
    .map((s) => new Date(s.date).toDateString());

  const pendingDates = sessions
    .filter((s) => !s.completed)
    .map((s) => new Date(s.date).toDateString());

  // 🏆 Badge
  let badge = "Beginner";
  if (streakDetails.currentStreak >= 5) badge = "Pro 🚀";
  if (streakDetails.currentStreak >= 10) badge = "Master 🏆";

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-[#1e293b]">
      {/* SIDEBAR */}
      <div className="w-64 bg-white dark:bg-[#0f172a] border-r dark:border-slate-700 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-8 text-gray-800 dark:text-gray-100">
            MindStreak
          </h2>

          <div className="space-y-3">
            <SidebarItem
              icon={<Home />}
              label="Dashboard"
              active={active === "dashboard"}
              onClick={() => setActive("dashboard")}
            />
            <SidebarItem
              icon={<CalendarDays />}
              label="Calendar"
              active={active === "calendar"}
              onClick={() => setActive("calendar")}
            />
            <SidebarItem
              icon={<Brain />}
              label="AI Planner"
              active={active === "ai"}
              onClick={() => setActive("ai")}
            />
          </div>
        </div>

        {/* Bottom actions */}
        <div className="space-y-3">
          {/* Dark mode */}
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center justify-center gap-2 bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-700 transition"
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
            Theme
          </button>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8 text-gray-800 dark:text-gray-100">
        {active === "dashboard" && (
          <>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-orange-400 to-pink-500 text-white p-5 rounded-xl mb-6 shadow"
            >
              🔥 Current: {streakDetails.currentStreak || 0} days <br />
              🏆 Max: {streakDetails.maxStreak || 0} days <br />
              📅 Year: {streakDetails.yearStreak || 0} days <br />
              🎖 Badge: {badge}
            </motion.div>

            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow mb-6 space-y-3">
              <input
                className="input"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <input
                className="input"
                placeholder="Hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
              <input
                className="input"
                placeholder="Task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />

              <button onClick={addSession} className="btn-primary">
                Add Session
              </button>
            </div>

            <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow">
              {sessions.map((s) => (
                <motion.div
                  key={s._id}
                  whileHover={{ scale: 1.02 }}
                  className="border-b border-gray-200 dark:border-gray-700 py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">
                      {s.subject} ({s.hours}h)
                    </p>
                    <p className="text-sm text-gray-500">{s.task}</p>
                  </div>

                  <button
                    onClick={() => toggleStatus(s._id)}
                    className={`px-3 py-1 rounded text-white ${
                      s.completed ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {s.completed ? "Done ✔" : "Mark Done"}
                  </button>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {active === "calendar" && (
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow">
            <h2 className="mb-4 font-semibold">📅 Calendar</h2>

            <Calendar
              onChange={setDate}
              value={date}
              tileContent={({ date }) => {
                const d = date.toDateString();

                if (completedDates.includes(d)) {
                  return <span style={{ color: "green" }}>✔</span>;
                }

                if (pendingDates.includes(d)) {
                  return <span style={{ color: "red" }}>✖</span>;
                }
              }}
            />
          </div>
        )}

        {active === "ai" && (
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow">
            <h2 className="mb-4 font-semibold">🤖 AI Planner</h2>

            <button onClick={getInsights} className="btn-primary">
              {loadingAI ? "Generating..." : "Generate Plan"}
            </button>

            <p className="mt-4 text-gray-600 dark:text-gray-300">{insights}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition
      ${
        active
          ? "bg-orange-100 text-orange-600"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}

export default Dashboard;
