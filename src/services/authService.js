import { supabase } from "./supabaseClient"; // Adjust the import based on your project structure

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { user: data?.user, error };
};

export const signup = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    return { error };
  }

  // Check if email confirmation is required
  if (data?.user?.identities?.length === 0) {
    return {
      user: data.user,
      message: "Please check your email for the confirmation link.",
    };
  }

  return { user: data.user };
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
