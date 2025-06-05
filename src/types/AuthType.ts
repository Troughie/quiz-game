import type { Session, User } from "@supabase/supabase-js";

export type AuthUser = User;

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
}

export type SocialProvider = "google" | "facebook" | "github" | "twitter";

export interface SocialProviderOption {
  id: SocialProvider;
  name: string;
}

export interface AuthSessionData {
  session: Session | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser | null;
}
