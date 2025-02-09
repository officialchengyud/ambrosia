import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, auth } from "../firebaseConfig";

// Create Context
const UserContext = createContext();

// User Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

// Hook to use User Context
export const useUser = () => {
  return useContext(UserContext);
};
