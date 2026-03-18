import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

function getTimeLabel(time24) {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function getNow() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function timeToMinutes(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export default function DashboardHome() {
  const { user, pets, schedules, saveSchedules, darkMode } = useApp();
  const [now, setNow] = useState(getNow());
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => { setNow(getNow()); setTime(new Date()); }, 30000);
    return () => clearInterval(t);
  }, []);

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Check for upcoming feeds and notify
  useEffect(() => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" }).toLowerCase();
    const upcoming = todayFeeds.filter(f => {
      const diff = timeToMinutes(f.time) - now;
      return diff > 0 && diff <= 5;
    });
    upcoming.forEach(f => {
      new Notification(`🐾 Feed ${f.petName}!`, {
        body: `Time to feed ${f.petName} - ${f.mealLabel} at ${getTimeLabel(f.time)}`,
        icon: "/favicon.ico"
      });
    });
  }, [now]);

  const c = darkMode ? colors.dark : colors.light;

  const today = new Date().toLocaleDateString("en-US", { weekday: "short" }).toLowerCase();
  const todayNames = { sun: "sun", mon: "mon", tue: "tue", wed: "wed", thu: "thu", fri: "fri", sat: "sat" };
  const todayKey = new Date().getDay();
  const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const todayFeeds = schedules
    .filter(s => s.days?.includes(dayKeys[todayKey]))
    .flatMap(s => s.times.map(t => ({
      id: `${s.id}-${t}`,
      schedId: s.id,
      petId: s.petId,
      petName: pets.find(p => p.id === s.petId)?.name || "Unknown",
      petEmoji: pets.find(p => p.id === s.petId)?.emoji || "🐾",
      time: t,
      mealLabel: s.label || "Meal",
      fedTimes: s.fedTimes || {},
      notes: s.notes || ""
    })))
    .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

  const markFed = (schedId, time) => {
    const dateKey = new Date().toDateString();
    const updated = schedules.map(s => s.id === schedId
      ? { ...s, fedTimes: { ...s.fedTimes, [`${dateKey}-${time}`]: true } }
      : s
    );
    saveSchedules(updated);
  };

  const isFed = (schedId, time) => {
    const dateKey = new Date().toDateString();
    const sched = schedules.find(s => s.id === schedId);
    return sched?.fedTimes?.[`${dateKey}-${time}`] || false;
  };

  const totalToday = todayFeeds.length;
  const fedCount = todayFeeds.filter(f => isFed(f.schedId, f.time)).length;
  const nextFeed = todayFeeds.find(f => timeToMinutes(f.time) > now && !isFed(f.schedId, f.time));

  const greeting = time.getHours() < 12 ? "Good morning" : time.getHours() < 17 ? "Good afternoon" : "Good evening";

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: c.heading, letterSpacing: "-0.5px", marginBottom: "4px" }}>
          {greeting}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ color: c.subtext, fontSize: "14px", fontWeight: 500 }}>
          {time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        <StatCard icon="🐾" label="Total Pets" value={pets.length} color="#ff8c5a" dark={darkMode} />
        <StatCard icon="📋" label="Today's Feeds" value={totalToday} color="#ff5722" dark={darkMode} />
        <StatCard icon="✅" label="Fed Today" value={fedCount} color="#4caf50" dark={darkMode} />
        <StatCard icon="⏳" label="Remaining" value={totalToday - fedCount} color="#2196f3" dark={darkMode} />
      </div>

      {/* Next feed banner */}
      {nextFeed && (
        <div style={{
          background: "linear-gradient(135deg, #ff8c5a, #ff5722)",
          borderRadius: "20px", padding: "20px 24px",
          marginBottom: "28px", display: "flex",
          alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 8px 28px rgba(255,87,34,0.35)",
          animation: "pulse-ring 2s infinite"
        }}>
          <div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", fontWeight: 600, letterSpacing: "0.8px" }}>NEXT FEEDING</div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginTop: "4px" }}>
              {nextFeed.petEmoji} {nextFeed.petName} — {getTimeLabel(nextFeed.time)}
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", marginTop: "2px" }}>
              {nextFeed.mealLabel} · {Math.max(0, timeToMinutes(nextFeed.time) - now)} min away
            </div>
          </div>
          <button onClick={() => markFed(nextFeed.schedId, nextFeed.time)} style={{
            background: "rgba(255,255,255,0.25)", border: "2px solid rgba(255,255,255,0.5)",
            color: "#fff", borderRadius: "14px", padding: "10px 20px",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "13px",
            cursor: "pointer", backdropFilter: "blur(4px)", flexShrink: 0
          }}>
            Mark Fed ✓
          </button>
        </div>
      )}

      {/* Today's timeline */}
      <div style={{
        background: darkMode ? "rgba(255,140,90,0.04)" : "#fff",
        borderRadius: "20px", padding: "24px",
        border: darkMode ? "1px solid rgba(255,140,90,0.1)" : "1px solid #f0e8e0",
        boxShadow: darkMode ? "none" : "0 4px 20px rgba(200,140,100,0.08)"
      }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: c.heading, marginBottom: "18px" }}>
          Today's Schedule
        </h2>

        {todayFeeds.length === 0 ? (
          <EmptyState message="No feeds scheduled for today." cta="Go to Schedules to add one!" dark={darkMode} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {todayFeeds.map(f => {
              const fed = isFed(f.schedId, f.time);
              const past = timeToMinutes(f.time) < now;
              const upcoming = !fed && !past;
              return (
                <div key={f.id} style={{
                  display: "flex", alignItems: "center", gap: "14px",
                  padding: "14px 16px", borderRadius: "14px",
                  background: fed
                    ? (darkMode ? "rgba(76,175,80,0.1)" : "rgba(76,175,80,0.06)")
                    : upcoming
                    ? (darkMode ? "rgba(255,140,90,0.08)" : "rgba(255,140,90,0.06)")
                    : (darkMode ? "rgba(255,255,255,0.03)" : "#fafaf8"),
                  border: fed ? "1px solid rgba(76,175,80,0.2)"
                    : upcoming ? "1px solid rgba(255,140,90,0.2)"
                    : `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "#f0e8e0"}`,
                  opacity: past && !fed ? 0.55 : 1,
                  transition: "all 0.2s"
                }}>
                  <div style={{
                    width: "42px", height: "42px", borderRadius: "13px",
                    background: fed ? "rgba(76,175,80,0.15)" : "linear-gradient(135deg, rgba(255,140,90,0.15), rgba(255,87,34,0.1))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "20px", flexShrink: 0
                  }}>{f.petEmoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: c.text }}>{f.petName}</div>
                    <div style={{ fontSize: "12px", color: c.subtext, marginTop: "2px" }}>{f.mealLabel}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: fed ? "#4caf50" : c.heading }}>
                      {getTimeLabel(f.time)}
                    </div>
                    {fed
                      ? <div style={{ fontSize: "11px", color: "#4caf50", fontWeight: 600 }}>✓ Fed</div>
                      : <button onClick={() => markFed(f.schedId, f.time)} style={{
                          background: "linear-gradient(135deg, #ff8c5a, #ff5722)",
                          border: "none", color: "#fff", borderRadius: "8px",
                          padding: "4px 10px", fontSize: "11px", fontWeight: 700,
                          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                          marginTop: "2px"
                        }}>Mark Fed</button>
                    }
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick stats — weekly progress */}
      {pets.length > 0 && (
        <div style={{
          marginTop: "20px",
          background: darkMode ? "rgba(255,140,90,0.04)" : "#fff",
          borderRadius: "20px", padding: "24px",
          border: darkMode ? "1px solid rgba(255,140,90,0.1)" : "1px solid #f0e8e0",
          boxShadow: darkMode ? "none" : "0 4px 20px rgba(200,140,100,0.08)"
        }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: c.heading, marginBottom: "16px" }}>
            Your Pets
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "12px" }}>
            {pets.map(pet => (
              <div key={pet.id} className="card-hover" style={{
                padding: "16px", borderRadius: "16px", textAlign: "center",
                background: darkMode ? "rgba(255,140,90,0.06)" : "#fdf5f0",
                border: darkMode ? "1px solid rgba(255,140,90,0.1)" : "1px solid #f5e0d0",
                cursor: "pointer"
              }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>{pet.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: "13px", color: c.text }}>{pet.name}</div>
                <div style={{ fontSize: "11px", color: c.subtext, marginTop: "2px", textTransform: "capitalize" }}>{pet.type}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color, dark }) {
  const bg = dark ? "rgba(255,140,90,0.05)" : "#fff";
  const border = dark ? "rgba(255,140,90,0.1)" : "#f0e8e0";
  const textC = dark ? "#e8d5c0" : "#1a1a1a";
  const subC = dark ? "#8a7060" : "#aaa";
  return (
    <div className="card-hover" style={{
      background: bg, borderRadius: "18px", padding: "20px",
      border: `1px solid ${border}`,
      boxShadow: dark ? "none" : "0 4px 16px rgba(200,140,100,0.06)"
    }}>
      <div style={{ fontSize: "22px", marginBottom: "10px" }}>{icon}</div>
      <div style={{ fontSize: "28px", fontWeight: 800, color, letterSpacing: "-0.5px" }}>{value}</div>
      <div style={{ fontSize: "12px", color: subC, fontWeight: 600, marginTop: "2px" }}>{label}</div>
    </div>
  );
}

function EmptyState({ message, cta, dark }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: "48px", marginBottom: "12px" }}>📅</div>
      <div style={{ fontWeight: 600, fontSize: "15px", color: dark ? "#e8d5c0" : "#444", marginBottom: "6px" }}>{message}</div>
      <div style={{ fontSize: "13px", color: dark ? "#8a7060" : "#aaa" }}>{cta}</div>
    </div>
  );
}

const colors = {
  light: { heading: "#1a1a1a", text: "#2a2a2a", subtext: "#888", bg: "#fff" },
  dark: { heading: "#f0e0cc", text: "#e0ccb8", subtext: "#8a7060", bg: "#1a1208" }
};
