import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layouts/Layout";
import Login from "@/pages/Authentication/Login";
import Register from "@/pages/Authentication/Register";
import Home from "@/pages/Home";
import PrivateRoute from "@/routes/PrivateRoute";
import PublicRoute from "@/routes/PublicRoute";
import Dashboard from "./pages/Dashboard";
import Detail from "./pages/Detail";
import Play from "./pages/Play";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route element={<PublicRoute isAuthenticated={false} />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path=":title" element={<Detail />} />
          </Route>

          {/* Private Routes */}
          <Route element={<PrivateRoute isAuthenticated={false} />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<div>Profile Page</div>} />
          </Route>
        </Route>
        <Route path="play/:title" element={<Play />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
