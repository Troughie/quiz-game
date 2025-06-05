// useAuthentication.js
import { useState } from "react";

import { createClient } from "@supabase/supabase-js";
import type { RegisterCredentials, SignInCredentials } from "@/types/AuthType";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const useAuthentication = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const signUp = async ({ email, password, username }: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    });
    setLoading(false);
    if (error) setError(error.message || "");
    return { user: data?.user, session: data?.session, error };
  };

  const signIn = async ({ email, password }: SignInCredentials) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) setError(error.message);
    return { user: data?.user, session: data?.session, error };
  };

  const resetPassword = async ({ email }: Pick<SignInCredentials, "email">) => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) setError(error.message);
    return { data, error };
  };

  const logOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Đăng xuất thất bại:", error.message);
    } else {
      console.log("Đăng xuất thành công");
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) setError(error.message);
    return { data, error };
  };

  return {
    loading,
    error,
    signUp,
    logOut,
    signIn,
    resetPassword,
    signInWithGoogle,
  };
};
