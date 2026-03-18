import { useState, useEffect } from "react";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import { AppProvider } from "./context/AppContext";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("pawtime_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return (
    <AppProvider user={user} setUser={setUser}>
      {!user ? <Auth /> : <Dashboard />}
    </AppProvider>
  );
}
