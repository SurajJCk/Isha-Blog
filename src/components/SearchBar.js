import React from "react";

const SearchBar = ({ onSearch }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search posts..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
};

export default SearchBar;
