import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import { useAuth } from "./context/AuthContext"; // ✅ get user state
import { SentimentPage } from "./pages/SentimentPage";
import { JournalPage } from "./pages/JournalPage";
import { ChatbotPage } from "./pages/ChatbotPage";
import { ProfilePage } from "./pages/ProfilePage";

function App() {
  const { user } = useAuth(); // check if logged in

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Root → depends on auth */}
      <Route
        path="/"
        element={user ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
      />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          {/* ✅ add future protected routes here */}
          <Route path="/sentiment" element={<SentimentPage/>}/>
          <Route path="/journal" element={<JournalPage/>}/>
          <Route path="/chatbot" element={<ChatbotPage/>}/>
          <Route path="/profile" element={<ProfilePage/>}/>
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
