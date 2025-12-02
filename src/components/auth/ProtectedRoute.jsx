import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Save intended path for post-auth redirect
    localStorage.setItem("returnUrl", location.pathname);
    return <Navigate to="/login" />;
  }

  return children;
}
