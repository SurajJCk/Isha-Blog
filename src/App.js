import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CreatePostPage from "./pages/CreatePostPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import useAuth from "./hooks/useAuth";
import PostDetailPage from "./pages/PostDetailPage";

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/create-post" element={<CreatePostPage />} />
        {user && <Route path="/admin" element={<AdminDashboardPage />} />}
        <Route path="/post/:id" element={<PostDetailPage />} />
        {/* Add more routes as needed */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
