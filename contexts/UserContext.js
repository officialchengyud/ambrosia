import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, auth } from "../firebaseConfig";
import { getUserFromDB } from "../api/user";

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
      console.log(currentUser);
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, [user]);

  useEffect(() => {
    console.log("email", user);
    if (user?.email) {
      getUserFromDB(user.email).then((data) => {
        setUserData(data);
      });
    }
  }, [user]);

  function refetchUserData() {
    getUserFromDB(user.email).then((data) => {
      setUserData(data);
    });
  }

  return (
    <UserContext.Provider
      value={{ user, loading, setUser, userData, setUserData, refetchUserData }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
};

// Hook to use User Context
export const useUser = () => {
  return useContext(UserContext);
};
