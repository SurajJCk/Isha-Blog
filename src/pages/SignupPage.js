import React from "react";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();

  return <AuthForm mode="signup" onSuccess={() => navigate("/")} />;
};

export default SignupPage;
// ... existing code ...
