import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Failed to sign out:", error);
      alert("Failed to sign out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md transition-colors duration-200"
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-xl font-bold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
            >
              <span>Sadhanapada</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-indigo-600 p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/">Home</NavLink>
            {user ? (
              <>
                {user.role === "admin" && (
                  <NavLink to="/admin">Admin Dashboard</NavLink>
                )}
                <NavLink to="/profile">Profile</NavLink>
                <NavLink to="/create-post">Create Post</NavLink>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? "Signing out..." : "Sign Out"}
                </button>
              </>
            ) : (
              <>
                <NavLink to="/signin">Sign In</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/">Home</NavLink>
            {user ? (
              <div className="space-y-1">
                {user.role === "admin" && (
                  <NavLink to="/admin">Admin Dashboard</NavLink>
                )}
                <NavLink to="/profile">Profile</NavLink>
                <NavLink to="/create-post">Create Post</NavLink>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="w-full text-left text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? "Signing out..." : "Sign Out"}
                </button>
              </div>
            ) : (
              <>
                <NavLink to="/signin">Sign In</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
