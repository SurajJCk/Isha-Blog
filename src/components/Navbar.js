import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Home Link */}
            <Link
              to="/"
              className="flex items-center text-xl font-bold text-indigo-600 hover:text-indigo-500"
            >
              <span>Sadhnapada</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md"
            >
              Home
            </Link>
            {user ? (
              <>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/create-post"
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md"
                >
                  Create Post
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
