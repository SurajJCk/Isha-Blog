import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center py-4">
      <p>
        &copy; {new Date().getFullYear()} Your Blog Name. All rights reserved.
      </p>
      <div className="mt-2">
        <a href="/privacy-policy" className="text-blue-400 hover:underline">
          Privacy Policy
        </a>
        <span className="mx-2">|</span>
        <a href="/terms-of-service" className="text-blue-400 hover:underline">
          Terms of Service
        </a>
      </div>
    </footer>
  );
};

export default Footer;
