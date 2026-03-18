import { useState } from "react";
import { useApp } from "../context/AppContext";

const PET_TYPES = [
  { type: "dog", emoji: "🐶", label: "Dog", suggestions: ["7:00", "12:00", "18:00"] },
  { type: "cat", emoji: "🐱", label: "Cat", suggestions: ["8:00", "18:00"] },
  { type: "bird", emoji: "🐦", label: "Bird", suggestions: ["7:00", "13:00", "19:00"] },
  { type: "fish", emoji: "🐠", label: "Fish", suggestions: ["8:00", "20:00"] },
  { type: "rabbit", emoji: "🐰", label: "Rabbit", suggestions: ["8:00", "12:00", "18:00"] },
  { type: "hamster", emoji: "🐹", label: "Hamster", suggestions: ["18:00", "22:00"] },
  { type: "turtle", emoji: "🐢", label: "Turtle", suggestions: ["9:00", "17:00"] },
  { type: "other", emoji: "🐾", label: "Other", suggestions: ["8:00", "18:00"] },
];

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function PetsManager() {
  const { pets, savePets, darkMode } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const c = darkMode ? colors.dark : colors.light;

  const openAdd = () => { setEditing(null); setShowModal(true); };
  const openEdit = (pet) => { setEditing(pet); setShowModal(true); };

  const deletePet = (id) => {
    if (window.confirm("Delete this pet?")) savePets(pets.filter(p => p.id !== id));
  };

  const handleSave = (data) => {
    if (editing) {
      savePets(pets.map(p => p.id === editing.id ? { ...p, ...data } : p));
    } else {
      savePets([...pets, { id: generateId(), ...data }]);
    }
    setShowModal(false);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: c.heading, letterSpacing: "-0.5px", marginBottom: "4px" }}>My Pets</h1>
          <p style={{ color: c.subtext, fontSize: "14px" }}>{pets.length} pet{pets.length !== 1 ? "s" : ""} registered</p>
        </div>
        <button onClick={openAdd} style={{
          background: "linear-gradient(135deg, #ff8c5a, #ff5722)",
          border: "none", color: "#fff", borderRadius: "14px",
          padding: "12px 20px", fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700, fontSize: "14px", cursor: "pointer",
          boxShadow: "0 6px 18px rgba(255,87,34,0.35)", whiteSpace: "nowrap"
        }}>
          + Add Pet
        </button>
      </div>

      {/* Grid */}
      {pets.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 20px",
          background: darkMode ? "rgba(255,140,90,0.03)" : "#fff",
          borderRadius: "20px", border: darkMode ? "1px solid rgba(255,140,90,0.08)" : "1px dashed #e8d8c8"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🐾</div>
          <h3 style={{ color: c.heading, fontWeight: 700, fontSize: "18px", marginBottom: "8px" }}>No pets yet</h3>
          <p style={{ color: c.subtext, fontSize: "14px", marginBottom: "20px" }}>Add your first pet to start scheduling their meals.</p>
          <button onClick={openAdd} style={{
            background: "linear-gradient(135deg, #ff8c5a, #ff5722)",
            border: "none", color: "#fff", borderRadius: "12px",
            padding: "12px 24px", fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700, fontSize: "14px", cursor: "pointer"
          }}>Add Your First Pet</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
          {pets.map(pet => (
            <PetCard key={pet.id} pet={pet} onEdit={openEdit} onDelete={deletePet} dark={darkMode} />
          ))}
        </div>
      )}

      {showModal && (
        <PetModal
          initial={editing}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
          dark={darkMode}
        />
      )}
    </div>
  );
}

function PetCard({ pet, onEdit, onDelete, dark }) {
  const c = dark ? colors.dark : colors.light;
  const typeInfo = PET_TYPES.find(t => t.type === pet.type) || PET_TYPES[7];
  return (
    <div className="card-hover" style={{
      background: dark ? "rgba(255,140,90,0.04)" : "#fff",
      borderRadius: "20px", padding: "22px",
      border: dark ? "1px solid rgba(255,140,90,0.1)" : "1px solid #f0e8e0",
      boxShadow: dark ? "none" : "0 4px 20px rgba(200,140,100,0.08)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
        <div style={{
          width: "52px", height: "52px", borderRadius: "16px",
          background: "linear-gradient(135deg, rgba(255,140,90,0.15), rgba(255,87,34,0.08))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "26px"
        }}>{pet.emoji || typeInfo.emoji}</div>
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={() => onEdit(pet)} style={{
            background: dark ? "rgba(255,255,255,0.06)" : "#f5f0ec",
            border: "none", borderRadius: "10px", padding: "7px 10px",
            cursor: "pointer", fontSize: "13px"
          }}>✏️</button>
          <button onClick={() => onDelete(pet.id)} style={{
            background: "rgba(255,87,34,0.08)",
            border: "none", borderRadius: "10px", padding: "7px 10px",
            cursor: "pointer", fontSize: "13px"
          }}>🗑️</button>
        </div>
      </div>
      <h3 style={{ fontWeight: 800, fontSize: "17px", color: c.heading, marginBottom: "4px" }}>{pet.name}</h3>
      <div style={{ fontSize: "13px", color: c.subtext, marginBottom: "10px", textTransform: "capitalize" }}>
        {typeInfo.label} · {pet.age ? `${pet.age} yr${pet.age > 1 ? "s" : ""}` : "Age unknown"}
      </div>
      {pet.notes && (
        <div style={{
          fontSize: "12px", color: c.subtext,
          background: dark ? "rgba(255,140,90,0.06)" : "#fdf5f0",
          padding: "8px 10px", borderRadius: "9px",
          borderLeft: "3px solid #ff8c5a"
        }}>{pet.notes}</div>
      )}
      <div style={{ marginTop: "12px", fontSize: "11px", color: "#ff8c5a", fontWeight: 600 }}>
        💡 Suggested: {typeInfo.suggestions.join(", ")}
      </div>
    </div>
  );
}

function PetModal({ initial, onSave, onClose, dark }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    type: initial?.type || "dog",
    age: initial?.age || "",
    notes: initial?.notes || "",
    emoji: initial?.emoji || ""
  });

  const c = dark ? colors.dark : colors.light;
  const typeInfo = PET_TYPES.find(t => t.type === form.type);

  const handleSubmit = () => {
    if (!form.name.trim()) return alert("Pet name is required.");
    onSave({ ...form, emoji: form.emoji || typeInfo?.emoji || "🐾" });
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
        width: "100%", maxWidth: "440px",
        boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
        border: dark ? "1px solid rgba(255,140,90,0.15)" : "1px solid #f0e8e0"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontWeight: 800, fontSize: "20px", color: c.heading }}>
            {initial ? "Edit Pet" : "Add New Pet"}
          </h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "20px", color: c.subtext, padding: "4px"
          }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Pet type selector */}
          <div>
            <label style={labelStyle}>PET TYPE</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {PET_TYPES.map(t => (
                <button key={t.type} onClick={() => setForm(f => ({ ...f, type: t.type, emoji: t.emoji }))}
                  style={{
                    padding: "10px 6px", borderRadius: "12px", border: "2px solid",
                    borderColor: form.type === t.type ? "#ff5722" : (dark ? "rgba(255,255,255,0.08)" : "#f0e8e0"),
                    background: form.type === t.type ? "rgba(255,87,34,0.08)" : "transparent",
                    cursor: "pointer", textAlign: "center", transition: "all 0.15s"
                  }}>
                  <div style={{ fontSize: "20px" }}>{t.emoji}</div>
                  <div style={{ fontSize: "10px", fontWeight: 600, color: form.type === t.type ? "#ff5722" : c.subtext, marginTop: "2px" }}>
                    {t.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <ModalInput label="Pet Name" placeholder="e.g. Buddy" value={form.name}
            onChange={v => setForm(f => ({ ...f, name: v }))} dark={dark} />

          <ModalInput label="Age (years)" type="number" placeholder="e.g. 3" value={form.age}
            onChange={v => setForm(f => ({ ...f, age: v }))} dark={dark} />

          <ModalInput label="Notes (optional)" placeholder="Dietary restrictions, preferences..."
            value={form.notes} onChange={v => setForm(f => ({ ...f, notes: v }))} dark={dark} />
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "13px", borderRadius: "13px",
            border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e8e0d8",
            background: "transparent", color: c.subtext,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            fontSize: "14px", cursor: "pointer"
          }}>Cancel</button>
          <button onClick={handleSubmit} style={{
            flex: 2, padding: "13px", borderRadius: "13px",
            background: "linear-gradient(135deg, #ff8c5a, #ff5722)",
            border: "none", color: "#fff",
            fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
            fontSize: "14px", cursor: "pointer",
            boxShadow: "0 6px 18px rgba(255,87,34,0.35)"
          }}>{initial ? "Save Changes" : "Add Pet"}</button>
        </div>
      </div>
    </div>
  );
}

function ModalInput({ label, type = "text", placeholder, value, onChange, dark }) {
  const c = dark ? colors.dark : colors.light;
  return (
    <div>
      <label style={labelStyle}>{label.toUpperCase()}</label>
      <input type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "11px 14px", borderRadius: "12px",
          border: dark ? "1.5px solid rgba(255,255,255,0.1)" : "1.5px solid #e8e0d8",
          background: dark ? "rgba(255,255,255,0.05)" : "#fafaf8",
          fontFamily: "'DM Sans', sans-serif", fontSize: "14px",
          color: c.text, outline: "none", transition: "border-color 0.2s"
        }}
        onFocus={e => e.target.style.borderColor = "#ff8c5a"}
        onBlur={e => e.target.style.borderColor = dark ? "rgba(255,255,255,0.1)" : "#e8e0d8"}
      />
    </div>
  );
}

const labelStyle = { display: "block", fontSize: "11px", fontWeight: 700, color: "#888", marginBottom: "8px", letterSpacing: "0.5px" };

const colors = {
  light: { heading: "#1a1a1a", text: "#2a2a2a", subtext: "#888" },
  dark: { heading: "#f0e0cc", text: "#e0ccb8", subtext: "#8a7060" }
};
