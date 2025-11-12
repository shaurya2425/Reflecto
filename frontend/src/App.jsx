import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import { SentimentPage } from "./pages/SentimentPage";
import { JournalPage } from "./pages/JournalPage";
import { ChatbotPage } from "./pages/ChatbotPage";
import { ProfilePage } from "./pages/ProfilePage";

function App() {
  const { user, loading } = useAuth();

  // ✅ Prevent flashing between routes while Firebase checks auth
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B1210] text-white text-lg">
        <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        Checking session...
      </div>
    );
  }

  return (
    <Routes>
      {/* 🟢 Public Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* 🏠 Root Redirect Logic */}
      <Route
        path="/"
        element={
          user ? (
            // If logged in → go to HomePage inside Layout
            <Navigate to="/home" replace />
          ) : (
            // If not logged in → show Landing version of Home
            <HomePage />
          )
        }
      />

      {/* 🛡️ Protected Routes */}
      <Route element={<ProtectedRoute />}>                
        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/sentiment" element={<SentimentPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* 🚧 Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
