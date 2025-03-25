import withParams from "@/HOC/defaultParam";
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  isAuthenticated: boolean;
}

const PrivateRoute = ({ isAuthenticated }: PrivateRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const ProtectedComponent = withParams(() => <Outlet />);
  return <ProtectedComponent />;
};

export default PrivateRoute;
