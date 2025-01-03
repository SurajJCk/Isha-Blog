import React from "react";
import { FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";

const ShareButtons = ({ url, title }) => {
  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={() =>
          window.open(
            `https://twitter.com/intent/tweet?url=${url}&text=${title}`
          )
        }
        className="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500"
      >
        <FaTwitter />
      </button>
      <button
        onClick={() =>
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`)
        }
        className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
      >
        <FaFacebook />
      </button>
      <button
        onClick={() =>
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
          )
        }
        className="p-2 rounded-full bg-blue-800 text-white hover:bg-blue-900"
      >
        <FaLinkedin />
      </button>
    </div>
  );
};

export default ShareButtons;
