//Protected route is a component that will allow only logged in users to reach the pages.
//If the user is not logged in, the web will take them to the login pages

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;
