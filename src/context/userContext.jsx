import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstanc";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      axiosInstance
        .get(API_PATHS.AUTH.GET_PROFILE)
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const updateUser = (userData) => setUser(userData);
  const clearUser = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;