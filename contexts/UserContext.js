import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, auth } from "../firebaseConfig";
import { getUserFromDB, getUserFromDb } from "../api/user";

// Create Context
const UserContext = createContext();

// User Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  useEffect(() => {
    console.log("email", user);
    if (user?.email) {
      getUserFromDB(user.email).then((data) => {
        setUserData(data);
      });
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{ user, loading, setUser, userData, setUserData }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
};

// Hook to use User Context
export const useUser = () => {
  return useContext(UserContext);
};
