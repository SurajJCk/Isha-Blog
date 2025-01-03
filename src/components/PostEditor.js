import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RichTextEditor from "./RichTextEditor";
import { handlePost } from "../services/postService";
import { useAuth } from "../contexts/AuthContext";

const PostEditor = ({ post = null }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
    author_name: post?.author_name || "",
    place: post?.place || "",
    tags: [],
  });

  const [files, setFiles] = useState({
    image: null,
    video: null,
  });

  const [previews, setPreviews] = useState({
    image: post?.image_url || null,
    video: post?.video_url || null,
  });

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles?.[0]) {
      setFiles((prev) => ({
        ...prev,
        [name]: selectedFiles[0],
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedFiles[0]);
      setPreviews((prev) => ({
        ...prev,
        [name]: previewUrl,
      }));
    }
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url && !url.startsWith("http")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [previews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const postData = {
        ...formData,
        id: post?.id, // Include ID if editing
        user_id: user.id,
        image_url: post?.image_url,
        video_url: post?.video_url,
      };

      const { data, error } = await handlePost(postData, files);

      if (error) throw error;

      // Redirect to the post detail page or home page
      navigate(post ? `/post/${post.id}` : "/");
    } catch (err) {
      console.error("Error saving post:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {post ? "Edit Post" : "Create New Post"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Rich Text Editor for Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(content) =>
              setFormData((prev) => ({ ...prev, content }))
            }
          />
        </div>

        {/* Author Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Author Name
          </label>
          <input
            type="text"
            value={formData.author_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, author_name: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        {/* Place Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Place
          </label>
          <input
            type="text"
            value={formData.place}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, place: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Image
          </label>
          {previews.image && (
            <img
              src={previews.image}
              alt="Preview"
              className="mt-2 h-32 w-full object-cover rounded-md"
            />
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>

        {/* Video Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Video
          </label>
          {previews.video && (
            <video
              src={previews.video}
              controls
              className="mt-2 w-full rounded-md"
            />
          )}
          <input
            type="file"
            name="video"
            accept="video/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <div className="mt-1">
            <input
              type="text"
              placeholder="Add tags (comma separated)"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === ",") {
                  e.preventDefault();
                  const newTag = e.target.value.trim();
                  if (newTag && !formData.tags.includes(newTag)) {
                    setFormData((prev) => ({
                      ...prev,
                      tags: [...prev.tags, newTag],
                    }));
                    e.target.value = "";
                  }
                }
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      tags: prev.tags.filter((t) => t !== tag),
                    }))
                  }
                  className="ml-1 hover:text-indigo-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? "Saving..." : post ? "Update Post" : "Create Post"}
          </button>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default PostEditor;
