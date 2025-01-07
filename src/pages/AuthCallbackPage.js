import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient"; // Ensure this import is correct

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        navigate("/login"); // Redirect to login if there's an error
        return;
      }

      // If session is successfully retrieved, navigate to the homepage
      if (data) {
        navigate("/"); // Redirect to homepage
      }
    };

    handleCallback();
  }, [navigate]);

  return <div>Loading...</div>; // Optional: Add a spinner or loader here
};

export default AuthCallbackPage;
