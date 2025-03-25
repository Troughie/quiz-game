import withParams from "@/HOC/defaultParam";
import { Navigate, Outlet } from "react-router-dom";

interface PublicRouteProps {
  isAuthenticated: boolean;
}

const PublicRoute = ({ isAuthenticated }: PublicRouteProps) => {
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const ProtectedComponent = withParams(() => <Outlet />);
  return <ProtectedComponent />;
};

export default PublicRoute;
