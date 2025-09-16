import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  console.log("ProtectedRoute check:", { user, loading });


  // Jab tak firebase user check kar raha hai → loader
  if (loading) {
    return <div>Loading...</div>;
  }

  // Agar user null hai → redirect login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Agar user mila → child routes render
  return <Outlet />;
};

export default ProtectedRoute;
