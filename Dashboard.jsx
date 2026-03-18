import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import Sidebar from "../components/Sidebar";
import DashboardHome from "../components/DashboardHome";
import PetsManager from "../components/PetsManager";
import ScheduleManager from "../components/ScheduleManager";

export default function Dashboard() {
  const { darkMode, activeView } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const bg = darkMode
    ? "linear-gradient(160deg, #0f0f0f 0%, #1a1410 50%, #120f0c 100%)"
    : "linear-gradient(160deg, #fdf6f0 0%, #faf0e8 50%, #f5e8d8 100%)";

  return (
    <div style={{
      minHeight: "100vh",
      background: bg,
      fontFamily: "'DM Sans', sans-serif",
      display: "flex",
      transition: "background 0.4s"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,600;1,500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,140,90,0.3); border-radius: 3px; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255,87,34,0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255,87,34,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255,87,34,0); }
        }
        .animate-in { animation: fadeSlideUp 0.4s ease forwards; }
        .card-hover { transition: transform 0.2s, box-shadow 0.2s; }
        .card-hover:hover { transform: translateY(-2px); }
      `}</style>

      {/* Mobile hamburger */}
      <button onClick={() => setSidebarOpen(true)} style={{
        position: "fixed", top: "16px", left: "16px", zIndex: 100,
        background: darkMode ? "#2a1f16" : "#fff",
        border: "none", borderRadius: "12px", padding: "10px",
        cursor: "pointer", display: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        fontSize: "18px"
      }} id="hamburger">☰</button>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{
        flex: 1,
        marginLeft: "260px",
        padding: "32px",
        minHeight: "100vh",
        overflowY: "auto"
      }}>
        <div className="animate-in">
          {activeView === "dashboard" && <DashboardHome />}
          {activeView === "pets" && <PetsManager />}
          {activeView === "schedules" && <ScheduleManager />}
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          #hamburger { display: block !important; }
          main { margin-left: 0 !important; padding: 16px !important; padding-top: 56px !important; }
        }
      `}</style>
    </div>
  );
}
