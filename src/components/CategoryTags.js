import React from "react";

const CategoryTags = ({ categories, onSelect }) => {
  return (
    <div className="flex gap-2 flex-wrap mb-6">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryTags;
