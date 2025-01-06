import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (mounted) {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setError(error.message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (mounted) {
          setUser(session?.user ?? null);
        }
      }
    );

    return () => {
      mounted = false;
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from("user_profiles")
            .select("is_admin")
            .eq("user_id", user.id)
            .single();

          if (profileError) {
            console.error("Error fetching user profile:", profileError);
          } else {
            setUser({ ...user, is_admin: profile.is_admin });
          }
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

  const handleGoogleCallback = async () => {
    const { data, error } = await supabase.auth.getSessionFromUrl();
    if (error) throw error;
    setUser(data.user);
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
