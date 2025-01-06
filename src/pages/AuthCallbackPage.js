import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth(); // Ensure this function processes Google OAuth

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleGoogleCallback(); // Handle token and authentication logic
        navigate("/"); // Redirect to homepage
      } catch (error) {
        console.error("Error during Google callback:", error);
        navigate("/login"); // Redirect to login if something goes wrong
      }
    };

    handleCallback();
  }, [navigate, handleGoogleCallback]);

  return <div>Loading...</div>; // Optional: Add a spinner or loader here
};

export default AuthCallbackPage;
