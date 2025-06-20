import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/layouts/Layout";
import Home from "@/pages/Home";
import PrivateRoute from "@/routes/PrivateRoute";
import PublicRoute from "@/routes/PublicRoute";
import Dashboard from "./pages/Dashboard";
import Detail from "./pages/Detail";
import Lobby from "./pages/Lobby";
import CreateQuiz from "./pages/CreateQuiz";
import Authentication from "./pages/Authentication";
import { useEffect, useState } from "react";
import { supabase } from "./features/authentication/hooks/useAuthentication";
import Profile from "./pages/Profile";
import { SocketProvider } from "./context/Socket";

function App() {
  const [sessionSupabase, setSessionSupabase] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Kiểm tra session hiện tại
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionSupabase(!!session);
      setLoading(false);
    });

    // Lắng nghe thay đổi trạng thái đăng nhập
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSessionSupabase(!!session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route element={<PublicRoute isAuthenticated={sessionSupabase} />}>
            <Route path="login" element={<Authentication />} />
            <Route path="register" element={<Authentication />} />
          </Route>

          <Route path="detail/:title" element={<Detail />} />
          {/* Private Routes */}
        </Route>
        <Route element={<PrivateRoute isAuthenticated={sessionSupabase} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="/edit/:id/:num?" element={<CreateQuiz />} />
          {/* <Route path="/edit" element={<CreateQuiz />} /> */}
        </Route>
        <Route
          path="play/:title"
          element={
            <SocketProvider>
              <Lobby />
            </SocketProvider>
          }
        />
        <Route
          path="/:pin"
          element={
            <SocketProvider>
              <Lobby />
            </SocketProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
