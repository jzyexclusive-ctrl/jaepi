import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AppContext = createContext(null);

export function AppProvider({ children, user, setUser }) {
  const [pets, setPets] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    if (user) {
      const storedPets = localStorage.getItem(`pawtime_pets_${user.id}`);
      const storedSchedules = localStorage.getItem(`pawtime_schedules_${user.id}`);
      const storedDark = localStorage.getItem("pawtime_dark");
      if (storedPets) setPets(JSON.parse(storedPets));
      if (storedSchedules) setSchedules(JSON.parse(storedSchedules));
      if (storedDark) setDarkMode(JSON.parse(storedDark));
    }
  }, [user]);

  const savePets = useCallback((updated) => {
    setPets(updated);
    localStorage.setItem(`pawtime_pets_${user.id}`, JSON.stringify(updated));
  }, [user]);

  const saveSchedules = useCallback((updated) => {
    setSchedules(updated);
    localStorage.setItem(`pawtime_schedules_${user.id}`, JSON.stringify(updated));
  }, [user]);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("pawtime_dark", JSON.stringify(next));
  };

  const logout = () => {
    localStorage.removeItem("pawtime_user");
    setUser(null);
  };

  return (
    <AppContext.Provider value={{
      user, pets, schedules, darkMode, activeView,
      setActiveView, savePets, saveSchedules, toggleDark, logout
    }}>
      <div className={darkMode ? "dark" : ""}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
