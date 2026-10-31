import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
export const AppContext = createContext({});
//children: la nhung component ma no dang boc. Vi du neu AppProvider dang boc header
// thi children la header
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get("http://localhost:3000/auth/me", {
          withCredentials: true,
        });
        console.log("Da lay duoc res: ", res);
        setUser(res.data.data.user);
      } catch (error) {
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
  if (context == null) {
    console.log("ko su dung duoc userApp");
  }
  return context;
};
