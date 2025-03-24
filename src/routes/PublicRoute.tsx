import { Navigate, Outlet } from "react-router-dom";

interface PublicRouteProps {
  isAuthenticated: boolean;
}

const PublicRoute = ({ isAuthenticated }: PublicRouteProps) => {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
