import { createClient } from "@supabase/supabase-js";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import useRequest from "./useMutation";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export const useAuthentication = () => {
  const navigate = useNavigate();

  const loginMutation = useRequest({
    mutationFn: async (credentials: AuthCredentials) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      return { data, error };
    },
    onSuccess: (data: AuthResponse) => {
      if (data.error) {
        throw new Error(data.error.message);
      }
      navigate("/dashboard");
    },
  });

  const registerMutation = useRequest({
    mutationFn: async (credentials: AuthCredentials) => {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });
      return { data, error };
    },
    onSuccess: (data: AuthResponse) => {
      if (data.error) {
        throw new Error(data.error.message);
      }
      navigate("/login");
    },
  });

  const logoutMutation = useRequest({
    mutationFn: async () => {
      await supabase.auth.signOut();
    },
    onSuccess: (data: { error: AuthError | null }) => {
      if (data.error) {
        throw new Error(data.error.message);
      }
      navigate("/");
    },
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
  };
};
