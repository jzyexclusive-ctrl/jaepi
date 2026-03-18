import { useApp } from "../context/AppContext";

const navItems = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "pets", icon: "🐾", label: "My Pets" },
  { id: "schedules", icon: "🕐", label: "Schedules" },
];

export default function Sidebar({ open, onClose }) {
  const { user, darkMode, toggleDark, logout, activeView, setActiveView } = useApp();

  const bg = darkMode ? "#1a1208" : "#fff";
  const border = darkMode ? "rgba(255,140,90,0.1)" : "#f0e8e0";
  const text = darkMode ? "#e8d5c0" : "#2a1f16";
  const subtext = darkMode ? "#8a7060" : "#aaa";

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div onClick={onClose} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          zIndex: 149, display: "none"
        }} id="overlay" />
      )}

      <aside style={{
        position: "fixed", left: 0, top: 0, bottom: 0,
        width: "260px", background: bg,
        borderRight: `1px solid ${border}`,
        display: "flex", flexDirection: "column",
        padding: "24px 16px",
        zIndex: 150,
        boxShadow: darkMode ? "4px 0 20px rgba(0,0,0,0.3)" : "4px 0 20px rgba(200,140,100,0.08)",
        transition: "all 0.3s"
      }}>
        {/* Logo */}
        <div style={{ padding: "8px 12px 28px", borderBottom: `1px solid ${border}`, marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "13px",
              background: "linear-gradient(135deg, #ff8c5a, #ff5722)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", boxShadow: "0 4px 12px rgba(255,87,34,0.35)",
              flexShrink: 0
            }}>🐾</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "17px", color: text, letterSpacing: "-0.3px" }}>PawTime</div>
              <div style={{ fontSize: "11px", color: subtext, fontWeight: 500 }}>Pet Feeding Scheduler</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: subtext, letterSpacing: "1.2px", padding: "0 12px", marginBottom: "8px" }}>
            MENU
          </div>
          {navItems.map(item => {
            const active = activeView === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveView(item.id); onClose(); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: "12px",
                  padding: "11px 14px", borderRadius: "13px", border: "none",
                  cursor: "pointer", marginBottom: "4px", transition: "all 0.2s",
                  background: active ? "linear-gradient(135deg, rgba(255,140,90,0.15), rgba(255,87,34,0.08))" : "transparent",
                  color: active ? "#ff5722" : text,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: active ? 700 : 500, fontSize: "14px",
                  textAlign: "left",
                  borderLeft: active ? "3px solid #ff5722" : "3px solid transparent"
                }}>
                <span style={{ fontSize: "17px", flexShrink: 0 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop: `1px solid ${border}`, paddingTop: "16px" }}>
          {/* User info */}
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "10px 12px", borderRadius: "13px",
            background: darkMode ? "rgba(255,140,90,0.06)" : "#fdf5f0",
            marginBottom: "10px"
          }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "linear-gradient(135deg, #ff8c5a, #ff5722)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: "13px", flexShrink: 0
            }}>
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 600, fontSize: "13px", color: text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.name}
              </div>
              <div style={{ fontSize: "11px", color: subtext, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.email}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={toggleDark} style={{
              flex: 1, padding: "9px", borderRadius: "11px",
              border: `1px solid ${border}`, cursor: "pointer",
              background: "transparent", color: text,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              fontSize: "12px", transition: "all 0.2s"
            }}>
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button onClick={logout} style={{
              flex: 1, padding: "9px", borderRadius: "11px",
              border: "1px solid rgba(255,87,34,0.2)", cursor: "pointer",
              background: "rgba(255,87,34,0.06)", color: "#ff5722",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              fontSize: "12px", transition: "all 0.2s"
            }}>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          aside { transform: ${open ? "translateX(0)" : "translateX(-100%)"}; }
          #overlay { display: ${open ? "block" : "none"} !important; }
        }
      `}</style>
    </>
  );
}
