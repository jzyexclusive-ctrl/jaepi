import { useState } from "react";
import { useApp } from "../context/AppContext";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function Auth() {
  const { } = useApp?.() || {};
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Access setUser from context via localStorage workaround
  const handleSubmit = () => {
    setError("");
    if (!form.email || !form.password) return setError("Please fill all fields.");
    if (mode === "signup" && !form.name) return setError("Name is required.");

    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("pawtime_users") || "[]");

      if (mode === "login") {
        const found = users.find(u => u.email === form.email && u.password === form.password);
        if (!found) { setError("Invalid credentials."); setLoading(false); return; }
        localStorage.setItem("pawtime_user", JSON.stringify(found));
        window.location.reload();
      } else {
        if (users.find(u => u.email === form.email)) { setError("Email already exists."); setLoading(false); return; }
        const newUser = { id: generateId(), name: form.name, email: form.email, password: form.password };
        users.push(newUser);
        localStorage.setItem("pawtime_users", JSON.stringify(users));
        localStorage.setItem("pawtime_user", JSON.stringify(newUser));
        window.location.reload();
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fdf6f0 0%, #fce8d8 40%, #f9d5bc 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      padding: "20px"
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: "fixed", top: "-80px", right: "-80px", width: "320px", height: "320px",
        background: "radial-gradient(circle, rgba(255,160,100,0.25) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none"
      }} />
      <div style={{
        position: "fixed", bottom: "-60px", left: "-60px", width: "280px", height: "280px",
        background: "radial-gradient(circle, rgba(255,120,80,0.15) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none"
      }} />

      <div style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        borderRadius: "28px",
        padding: "48px 44px",
        width: "100%",
        maxWidth: "420px",
        boxShadow: "0 20px 60px rgba(200,100,50,0.15), 0 4px 16px rgba(0,0,0,0.06)",
        border: "1px solid rgba(255,255,255,0.9)"
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "20px",
            background: "linear-gradient(135deg, #ff8c5a, #ff5722)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: "28px",
            boxShadow: "0 8px 24px rgba(255,87,34,0.35)"
          }}>🐾</div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 700, color: "#1a1a1a", letterSpacing: "-0.5px" }}>
            PawTime
          </h1>
          <p style={{ margin: "6px 0 0", color: "#888", fontSize: "14px" }}>
            {mode === "login" ? "Welcome back! Sign in to continue." : "Create your account to get started."}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", background: "#f5f0ec", borderRadius: "14px",
          padding: "4px", marginBottom: "28px"
        }}>
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }}
              style={{
                flex: 1, padding: "10px", border: "none", cursor: "pointer",
                borderRadius: "11px", fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600, fontSize: "14px", transition: "all 0.2s",
                background: mode === m ? "#fff" : "transparent",
                color: mode === m ? "#ff5722" : "#888",
                boxShadow: mode === m ? "0 2px 8px rgba(0,0,0,0.08)" : "none"
              }}>
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {mode === "signup" && (
            <Input label="Full Name" placeholder="e.g. Alex Johnson"
              value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
          )}
          <Input label="Email" type="email" placeholder="you@example.com"
            value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
          <Input label="Password" type="password" placeholder="••••••••"
            value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))}
            onEnter={handleSubmit} />
        </div>

        {error && (
          <div style={{
            marginTop: "14px", padding: "12px 16px", borderRadius: "12px",
            background: "rgba(255,87,34,0.08)", color: "#e53e3e",
            fontSize: "13px", fontWeight: 500
          }}>{error}</div>
        )}

        <button onClick={handleSubmit} disabled={loading}
          style={{
            width: "100%", marginTop: "22px", padding: "15px",
            background: loading ? "#ccc" : "linear-gradient(135deg, #ff8c5a, #ff5722)",
            border: "none", borderRadius: "14px", color: "#fff",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: "15px", cursor: loading ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 6px 20px rgba(255,87,34,0.4)",
            transition: "all 0.2s", letterSpacing: "0.2px"
          }}>
          {loading ? "Please wait…" : (mode === "login" ? "Sign In →" : "Create Account →")}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#aaa" }}>
          Demo: use any email + password to register
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

function Input({ label, type = "text", placeholder, value, onChange, onEnter }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#555", marginBottom: "6px", letterSpacing: "0.3px" }}>
        {label.toUpperCase()}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onEnter?.()}
        style={{
          width: "100%", padding: "12px 16px", borderRadius: "12px",
          border: "1.5px solid #e8e0d8", outline: "none",
          fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#1a1a1a",
          background: "#fafaf8", transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = "#ff8c5a"}
        onBlur={e => e.target.style.borderColor = "#e8e0d8"}
      />
    </div>
  );
}
