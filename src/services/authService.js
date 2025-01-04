import { supabase } from "./supabaseClient"; // Adjust the import based on your project structure

export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { user: data?.user, error };
};

export const signup = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error };
  }

  // Create a user profile
  const { error: profileError } = await supabase
    .from("user_profiles")
    .insert([{ user_id: data.user.id, name, email }]);

  if (profileError) {
    return { error: profileError };
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
