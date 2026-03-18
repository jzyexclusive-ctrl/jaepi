/**
 * PawTime API Client
 * Wraps all backend calls with auth token handling.
 * Set VITE_API_URL in .env to point to your backend.
 */

const BASE = import.meta.env.VITE_API_URL || "/api";

function getToken() {
  const user = localStorage.getItem("pawtime_user");
  return user ? JSON.parse(user).token : null;
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const api = {
  auth: {
    register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
    login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
    me: () => request("/auth/me"),
  },

  // ── Pets ────────────────────────────────────────────────────────────────────
  pets: {
    list: () => request("/pets"),
    create: (body) => request("/pets", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) => request(`/pets/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id) => request(`/pets/${id}`, { method: "DELETE" }),
  },

  // ── Schedules ───────────────────────────────────────────────────────────────
  schedules: {
    list: () => request("/schedules"),
    today: () => request("/schedules/today"),
    create: (body) => request("/schedules", { method: "POST", body: JSON.stringify(body) }),
    update: (id, body) => request(`/schedules/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    markFed: (id, time) => request(`/schedules/${id}/fed`, { method: "PATCH", body: JSON.stringify({ time }) }),
    delete: (id) => request(`/schedules/${id}`, { method: "DELETE" }),
  },
};
