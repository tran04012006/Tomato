import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      console.log("chay AppProvider");

      try {
        const res = await api.get("/auth/me");

        console.log("res.data.data.user:", res.data.data.user);
        setUser(res.data.data.user);
      } catch (error) {
        console.error("Check login failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error("useApp must be used within AppProvider");
  }

  return context;
};