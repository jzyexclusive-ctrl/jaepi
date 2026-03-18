import { useState } from "react";
import { useApp } from "../context/AppContext";

const DAYS = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
  { key: "sun", label: "Sun" },
];

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getTimeLabel(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export default function ScheduleManager() {
  const { pets, schedules, saveSchedules, darkMode } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // list | weekly

  const c = darkMode ? colors.dark : colors.light;

  const openAdd = () => { setEditing(null); setShowModal(true); };
  const openEdit = (s) => { setEditing(s); setShowModal(true); };

  const deleteSchedule = (id) => {
    if (window.confirm("Delete this schedule?")) saveSchedules(schedules.filter(s => s.id !== id));
  };

  const handleSave = (data) => {
    if (editing) {
      saveSchedules(schedules.map(s => s.id === editing.id ? { ...s, ...data } : s));
    } else {
      saveSchedules([...schedules, { id: generateId(), ...data, fedTimes: {} }]);
    }
    setShowModal(false);
  };

  // Weekly grid data
  const weeklyData = DAYS.map(day => ({
    ...day,
    entries: schedules
      .filter(s => s.days?.includes(day.key))
      .flatMap(s => s.times.map(t => ({
        id: `${s.id}-${t}`, schedId: s.id,
        petName: pets.find(p => p.id === s.petId)?.name || "?",
        petEmoji: pets.find(p => p.id === s.petId)?.emoji || "🐾",
        time: t, label: s.label || "Meal"
      })))
      .sort((a, b) => a.time.localeCompare(b.time))
  }));

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: c.heading, letterSpacing: "-0.5px", marginBottom: "4px" }}>Schedules</h1>
          <p style={{ color: c.subtext, fontSize: "14px" }}>{schedules.length} schedule{schedules.length !== 1 ? "s" : ""} set up</p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {/* View toggle */}
          <div style={{
            display: "flex", background: darkMode ? "rgba(255,255,255,0.06)" : "#f0e8e0",
            borderRadius: "12px", padding: "3px", gap: "2px"
          }}>
            {["list", "weekly"].map(v => (
              <button key={v} onClick={() => setViewMode(v)} style={{
                padding: "7px 14px", borderRadius: "9px", border: "none",
                background: viewMode === v ? (darkMode ? "#2a1f16" : "#fff") : "transparent",
                color: viewMode === v ? "#ff5722" : c.subtext,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                fontSize: "12px", cursor: "pointer", transition: "all 0.2s",
                boxShadow: viewMode === v ? "0 2px 6px rgba(0,0,0,0.08)" : "none",
                textTransform: "capitalize"
              }}>{v === "list" ? "📋 List" : "📅 Weekly"}</button>
            ))}
          </div>
          <button onClick={openAdd} disabled={pets.length === 0} style={{
            background: pets.length === 0 ? "#ccc" : "linear-gradient(135deg, #ff8c5a, #ff5722)",
            border: "none", color: "#fff", borderRadius: "14px",
            padding: "12px 20px", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: "14px",
            cursor: pets.length === 0 ? "not-allowed" : "pointer",
            boxShadow: pets.length === 0 ? "none" : "0 6px 18px rgba(255,87,34,0.35)",
            whiteSpace: "nowrap"
          }}>
            + Add Schedule
          </button>
        </div>
      </div>

      {pets.length === 0 && (
        <div style={{
          textAlign: "center", padding: "48px 20px",
          background: darkMode ? "rgba(255,140,90,0.03)" : "#fff",
          borderRadius: "20px", border: darkMode ? "1px solid rgba(255,140,90,0.08)" : "1px dashed #e8d8c8"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🐾</div>
          <p style={{ color: c.subtext, fontWeight: 600 }}>Add a pet first to create schedules.</p>
        </div>
      )}

      {pets.length > 0 && schedules.length === 0 && (
        <div style={{
          textAlign: "center", padding: "80px 20px",
          background: darkMode ? "rgba(255,140,90,0.03)" : "#fff",
          borderRadius: "20px", border: darkMode ? "1px solid rgba(255,140,90,0.08)" : "1px dashed #e8d8c8"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🕐</div>
          <h3 style={{ color: c.heading, fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>No schedules yet</h3>
          <p style={{ color: c.subtext, fontSize: "14px", marginBottom: "20px" }}>Set up feeding times for your pets.</p>
          <button onClick={openAdd} style={{
            background: "linear-gradient(135deg, #ff8c5a, #ff5722)",
            border: "none", color: "#fff", borderRadius: "12px",
            padding: "12px 24px", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: "14px", cursor: "pointer"
          }}>Create First Schedule</button>
        </div>
      )}

      {/* List view */}
      {viewMode === "list" && schedules.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {schedules.map(s => {
            const pet = pets.find(p => p.id === s.petId);
            return (
              <div key={s.id} className="card-hover" style={{
                background: darkMode ? "rgba(255,140,90,0.04)" : "#fff",
                borderRadius: "18px", padding: "20px",
                border: darkMode ? "1px solid rgba(255,140,90,0.1)" : "1px solid #f0e8e0",
                boxShadow: darkMode ? "none" : "0 4px 16px rgba(200,140,100,0.07)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "46px", height: "46px", borderRadius: "14px",
                      background: "linear-gradient(135deg, rgba(255,140,90,0.15), rgba(255,87,34,0.08))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "22px", flexShrink: 0
                    }}>{pet?.emoji || "🐾"}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "16px", color: c.heading }}>{pet?.name || "Unknown Pet"}</div>
                      <div style={{ fontSize: "12px", color: c.subtext, marginTop: "2px" }}>{s.label || "Meal"}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => openEdit(s)} style={{
                      background: darkMode ? "rgba(255,255,255,0.06)" : "#f5f0ec",
                      border: "none", borderRadius: "10px", padding: "8px 12px",
                      cursor: "pointer", fontSize: "13px"
                    }}>✏️ Edit</button>
                    <button onClick={() => deleteSchedule(s.id)} style={{
                      background: "rgba(255,87,34,0.08)", border: "none",
                      borderRadius: "10px", padding: "8px 12px",
                      cursor: "pointer", fontSize: "13px", color: "#ff5722"
                    }}>🗑️</button>
                  </div>
                </div>

                <div style={{ marginTop: "14px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {s.times.map(t => (
                    <span key={t} style={{
                      padding: "5px 12px", borderRadius: "8px",
                      background: "linear-gradient(135deg, rgba(255,140,90,0.12), rgba(255,87,34,0.07))",
                      color: "#ff5722", fontWeight: 700, fontSize: "13px",
                      border: "1px solid rgba(255,87,34,0.15)"
                    }}>⏰ {getTimeLabel(t)}</span>
                  ))}
                </div>

                <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {DAYS.map(d => (
                    <span key={d.key} style={{
                      padding: "3px 10px", borderRadius: "6px", fontSize: "11px",
                      fontWeight: 600,
                      background: s.days?.includes(d.key)
                        ? (darkMode ? "rgba(255,87,34,0.2)" : "rgba(255,87,34,0.1)")
                        : (darkMode ? "rgba(255,255,255,0.04)" : "#f5f0ec"),
                      color: s.days?.includes(d.key) ? "#ff5722" : c.subtext
                    }}>{d.label}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Weekly view */}
      {viewMode === "weekly" && schedules.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(120px, 1fr))", gap: "10px", minWidth: "840px" }}>
            {weeklyData.map(day => {
              const isToday = day.key === ["sun","mon","tue","wed","thu","fri","sat"][new Date().getDay()];
              return (
                <div key={day.key} style={{
                  background: darkMode ? "rgba(255,140,90,0.04)" : "#fff",
                  borderRadius: "16px", padding: "14px",
                  border: isToday
                    ? "2px solid #ff8c5a"
                    : darkMode ? "1px solid rgba(255,140,90,0.08)" : "1px solid #f0e8e0"
                }}>
                  <div style={{
                    fontWeight: 700, fontSize: "12px", marginBottom: "10px",
                    color: isToday ? "#ff5722" : c.subtext,
                    letterSpacing: "0.5px", textTransform: "uppercase"
                  }}>
                    {day.label} {isToday ? "· Today" : ""}
                  </div>
                  {day.entries.length === 0 ? (
                    <div style={{ fontSize: "11px", color: c.subtext, textAlign: "center", padding: "8px 0" }}>—</div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {day.entries.map(e => (
                        <div key={e.id} style={{
                          padding: "7px 9px", borderRadius: "9px",
                          background: "linear-gradient(135deg, rgba(255,140,90,0.1), rgba(255,87,34,0.06))",
                          border: "1px solid rgba(255,87,34,0.12)"
                        }}>
                          <div style={{ fontSize: "13px" }}>{e.petEmoji}</div>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: c.text, marginTop: "2px" }}>
                            {getTimeLabel(e.time)}
                          </div>
                          <div style={{ fontSize: "10px", color: c.subtext }}>{e.petName}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showModal && (
        <ScheduleModal
          initial={editing}
          pets={pets}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          dark={darkMode}
        />
      )}
    </div>
  );
}

function ScheduleModal({ initial, pets, onSave, onClose, dark }) {
  const PET_TYPES_SUGGESTIONS = {
    dog: ["07:00", "12:00", "18:00"],
    cat: ["08:00", "18:00"],
    bird: ["07:00", "13:00", "19:00"],
    fish: ["08:00", "20:00"],
    rabbit: ["08:00", "12:00", "18:00"],
    hamster: ["18:00", "22:00"],
    turtle: ["09:00", "17:00"],
    other: ["08:00", "18:00"]
  };

  const [form, setForm] = useState({
    petId: initial?.petId || (pets[0]?.id || ""),
    label: initial?.label || "Meal",
    times: initial?.times || ["08:00"],
    days: initial?.days || ["mon","tue","wed","thu","fri","sat","sun"],
    notes: initial?.notes || ""
  });

  const c = dark ? colors.dark : colors.light;
  const selectedPet = pets.find(p => p.id === form.petId);

  const addTime = () => setForm(f => ({ ...f, times: [...f.times, "12:00"] }));
  const removeTime = (i) => setForm(f => ({ ...f, times: f.times.filter((_, idx) => idx !== i) }));
  const updateTime = (i, v) => setForm(f => ({ ...f, times: f.times.map((t, idx) => idx === i ? v : t) }));
  const toggleDay = (d) => setForm(f => ({
    ...f, days: f.days.includes(d) ? f.days.filter(x => x !== d) : [...f.days, d]
  }));

  const applySuggestions = () => {
    const pet = pets.find(p => p.id === form.petId);
    const suggestions = PET_TYPES_SUGGESTIONS[pet?.type] || ["08:00", "18:00"];
    setForm(f => ({ ...f, times: suggestions }));
  };

  const handleSubmit = () => {
    if (!form.petId) return alert("Select a pet.");
    if (form.times.length === 0) return alert("Add at least one time.");
    if (form.days.length === 0) return alert("Select at least one day.");
    onSave(form);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 200, padding: "20px", backdropFilter: "blur(4px)"
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: dark ? "#1a1208" : "#fff",
        borderRadius: "24px", padding: "32px",
        width: "100%", maxWidth: "480px",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
        border: dark ? "1px solid rgba(255,140,90,0.15)" : "1px solid #f0e8e0"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontWeight: 800, fontSize: "20px", color: c.heading }}>
            {initial ? "Edit Schedule" : "New Schedule"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px", color: c.subtext }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Pet selector */}
          <div>
            <label style={labelStyle}>PET</label>
            <select value={form.petId} onChange={e => setForm(f => ({ ...f, petId: e.target.value }))}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: "12px",
                border: dark ? "1.5px solid rgba(255,255,255,0.1)" : "1.5px solid #e8e0d8",
                background: dark ? "rgba(255,255,255,0.05)" : "#fafaf8",
                fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
                color: c.text, outline: "none", cursor: "pointer"
              }}>
              {pets.map(p => <option key={p.id} value={p.id}>{p.emoji || "🐾"} {p.name}</option>)}
            </select>
          </div>

          {/* Label */}
          <div>
            <label style={labelStyle}>MEAL LABEL</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["Breakfast", "Lunch", "Dinner", "Snack", "Meal"].map(l => (
                <button key={l} onClick={() => setForm(f => ({ ...f, label: l }))} style={{
                  padding: "7px 14px", borderRadius: "9px", border: "2px solid",
                  borderColor: form.label === l ? "#ff5722" : (dark ? "rgba(255,255,255,0.08)" : "#e8e0d8"),
                  background: form.label === l ? "rgba(255,87,34,0.08)" : "transparent",
                  color: form.label === l ? "#ff5722" : c.subtext,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                  fontSize: "12px", cursor: "pointer", transition: "all 0.15s"
                }}>{l}</button>
              ))}
            </div>
          </div>

          {/* Times */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ ...labelStyle, margin: 0 }}>FEEDING TIMES</label>
              <button onClick={applySuggestions} style={{
                fontSize: "11px", color: "#ff8c5a", background: "none", border: "none",
                cursor: "pointer", fontWeight: 700, fontFamily: "'DM Sans', sans-serif"
              }}>💡 Auto-suggest</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {form.times.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input type="time" value={t} onChange={e => updateTime(i, e.target.value)}
                    style={{
                      flex: 1, padding: "10px 14px", borderRadius: "12px",
                      border: dark ? "1.5px solid rgba(255,255,255,0.1)" : "1.5px solid #e8e0d8",
                      background: dark ? "rgba(255,255,255,0.05)" : "#fafaf8",
                      fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
                      color: c.text, outline: "none"
                    }} />
                  {form.times.length > 1 && (
                    <button onClick={() => removeTime(i)} style={{
                      background: "rgba(255,87,34,0.08)", border: "none",
                      borderRadius: "10px", padding: "8px 10px",
                      cursor: "pointer", fontSize: "13px"
                    }}>✕</button>
                  )}
                </div>
              ))}
              <button onClick={addTime} style={{
                padding: "9px", borderRadius: "11px",
                border: dark ? "1.5px dashed rgba(255,140,90,0.3)" : "1.5px dashed #f0b89a",
                background: "transparent", color: "#ff8c5a",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                fontSize: "13px", cursor: "pointer"
              }}>+ Add Another Time</button>
            </div>
          </div>

          {/* Days */}
          <div>
            <label style={labelStyle}>REPEAT ON</label>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {DAYS.map(d => (
                <button key={d.key} onClick={() => toggleDay(d.key)} style={{
                  padding: "8px 12px", borderRadius: "9px", border: "2px solid",
                  borderColor: form.days.includes(d.key) ? "#ff5722" : (dark ? "rgba(255,255,255,0.08)" : "#e8e0d8"),
                  background: form.days.includes(d.key) ? "rgba(255,87,34,0.1)" : "transparent",
                  color: form.days.includes(d.key) ? "#ff5722" : c.subtext,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                  fontSize: "12px", cursor: "pointer", transition: "all 0.15s"
                }}>{d.label}</button>
              ))}
              <button onClick={() => setForm(f => ({ ...f, days: DAYS.map(d => d.key) }))} style={{
                padding: "8px 12px", borderRadius: "9px", border: "2px solid #ff8c5a",
                background: "transparent", color: "#ff8c5a",
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                fontSize: "12px", cursor: "pointer"
              }}>Every Day</button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={labelStyle}>NOTES (OPTIONAL)</label>
            <input placeholder="e.g. Half cup dry food" value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              style={{
                width: "100%", padding: "11px 14px", borderRadius: "12px",
                border: dark ? "1.5px solid rgba(255,255,255,0.1)" : "1.5px solid #e8e0d8",
                background: dark ? "rgba(255,255,255,0.05)" : "#fafaf8",
                fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
                color: c.text, outline: "none"
              }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "13px", borderRadius: "13px",
            border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e8e0d8",
            background: "transparent", color: c.subtext,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "14px", cursor: "pointer"
          }}>Cancel</button>
          <button onClick={handleSubmit} style={{
            flex: 2, padding: "13px", borderRadius: "13px",
            background: "linear-gradient(135deg, #ff8c5a, #ff5722)",
            border: "none", color: "#fff",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: "14px", cursor: "pointer",
            boxShadow: "0 6px 18px rgba(255,87,34,0.35)"
          }}>{initial ? "Save Changes" : "Create Schedule"}</button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", fontSize: "11px", fontWeight: 700, color: "#888", marginBottom: "8px", letterSpacing: "0.5px" };

const colors = {
  light: { heading: "#1a1a1a", text: "#2a2a2a", subtext: "#888" },
  dark: { heading: "#f0e0cc", text: "#e0ccb8", subtext: "#8a7060" }
};
