import { useEffect, useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import { Home, CalendarDays, Brain, Flame, Moon, Sun } from "lucide-react";

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

  // 🌙 Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    fetchSessions();
    fetchStreakDetails();
  }, []);

  const fetchSessions = async () => {
    const res = await axios.get("http://localhost:5000/api/study", {
      headers: { Authorization: token },
    });
    setSessions(res.data);
  };

  const fetchStreakDetails = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/study/streak-details",
      { headers: { Authorization: token } },
    );
    setStreakDetails(res.data);
  };

  const addSession = async () => {
    if (!subject || !hours || !task) return;

    await axios.post(
      "http://localhost:5000/api/study/add",
      { subject, hours, task },
      { headers: { Authorization: token } },
    );

    setSubject("");
    setHours("");
    setTask("");

    fetchSessions();
    fetchStreakDetails();
  };

  // ✅ TOGGLE COMPLETE
  const toggleStatus = async (id) => {
    await axios.put(
      `http://localhost:5000/api/study/toggle/${id}`,
      {},
      { headers: { Authorization: token } },
    );

    fetchSessions();
    fetchStreakDetails();
  };

  const getInsights = async () => {
    setLoadingAI(true);
    try {
      const res = await axios.get("http://localhost:5000/api/ai/insights", {
        headers: { Authorization: token },
      });
      setInsights(res.data.insights);
    } catch {
      setInsights("AI temporarily unavailable");
    }
    setLoadingAI(false);
  };

  // 📅 Calendar Logic
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      {/* SIDEBAR */}
      <div className="w-64 bg-white dark:bg-[#020617] border-r dark:border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-8 text-gray-800 dark:text-white">
            StudyTracker
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

        {/* Dark Mode */}
        <button
          onClick={() => setDark(!dark)}
          className="flex items-center justify-center gap-2 bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          Toggle
        </button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">
        {/* DASHBOARD */}
        {active === "dashboard" && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Dashboard
            </h1>

            {/* STREAK */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-orange-400 to-pink-500 text-white p-5 rounded-xl mb-6 shadow"
            >
              🔥 Current: {streakDetails.currentStreak || 0} days <br />
              🏆 Max: {streakDetails.maxStreak || 0} days <br />
              📅 This Year: {streakDetails.yearStreak || 0} days <br />
              🎖 Badge: {badge}
            </motion.div>

            {/* INPUT */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow mb-6 space-y-3">
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

            {/* SESSIONS */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
              {sessions.map((s) => (
                <motion.div
                  key={s._id}
                  whileHover={{ scale: 1.02 }}
                  className="border-b py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {s.subject} ({s.hours}h)
                    </p>
                    <p className="text-sm text-gray-500">{s.task}</p>
                  </div>

                  {/* ✅ BUTTON */}
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

        {/* CALENDAR */}
        {active === "calendar" && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
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

        {/* AI */}
        {active === "ai" && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
            <h2 className="mb-4 font-semibold">🤖 AI Planner</h2>

            <button onClick={getInsights} className="btn-primary">
              {loadingAI ? "Generating..." : "Generate Plan"}
            </button>

            <p className="mt-4 text-gray-700 dark:text-gray-300">{insights}</p>
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
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
      }`}
    >
      {icon}
      {label}
    </div>
  );
}

export default Dashboard;
