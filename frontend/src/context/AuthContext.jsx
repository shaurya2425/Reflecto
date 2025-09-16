import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";

// Context create kiya
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);      // ✅ current logged in user
  const [loading, setLoading] = useState(true); // ✅ jab tak firebase check karega

  useEffect(() => {
    // ✅ Firebase listener (runs once)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);   // user set ho jayega ya null
      setLoading(false);      // ✅ check complete hone ke baad false
    });

    return () => unsubscribe(); // cleanup
  }, []);

  // ✅ logout function
  const logout = () => signOut(auth);

  return (
    // ✅ ab context me user, setUser, logout aur loading sab available hain
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ custom hook banaya
export const useAuth = () => useContext(AuthContext);
