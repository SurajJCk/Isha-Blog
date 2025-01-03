import React, { useState } from "react";
import { FaImage, FaVideo, FaTimes } from "react-icons/fa";

const MediaGallery = ({ posts }) => {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Extract all unique tags from posts
  const allTags = [...new Set(posts.flatMap((post) => post.tags || []))];

  // Filter media based on type and tags
  const filteredMedia = posts.filter((post) => {
    const typeMatch =
      selectedType === "all" ||
      (selectedType === "image" && post.image_url) ||
      (selectedType === "video" && post.video_url);

    const tagMatch =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => post.tags?.includes(tag));

    return typeMatch && tagMatch;
  });

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const openModal = (media) => {
    setSelectedMedia(media);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filter Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-4 py-2 rounded-lg ${
              selectedType === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedType("image")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              selectedType === "image"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <FaImage /> Images
          </button>
          <button
            onClick={() => setSelectedType("video")}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              selectedType === "video"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <FaVideo /> Videos
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag)
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((post) => (
          <div
            key={post.id}
            className="relative group cursor-pointer rounded-lg overflow-hidden"
            onClick={() => openModal(post)}
          >
            {post.image_url ? (
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            ) : post.video_url ? (
              <video
                src={post.video_url}
                className="w-full h-48 object-cover"
              />
            ) : null}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <h3 className="text-white text-center px-4">{post.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="max-w-4xl w-full mx-4 bg-white rounded-lg overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
              <h3 className="text-xl font-semibold">{selectedMedia.title}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4">
              {selectedMedia.image_url ? (
                <img
                  src={selectedMedia.image_url}
                  alt={selectedMedia.title}
                  className="w-full max-h-[70vh] object-contain"
                />
              ) : selectedMedia.video_url ? (
                <video
                  src={selectedMedia.video_url}
                  controls
                  className="w-full max-h-[70vh]"
                />
              ) : null}
              <div className="mt-4">
                <p className="text-gray-600">{selectedMedia.content}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedMedia.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaGallery;
