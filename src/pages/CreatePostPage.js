import React, { useState, useEffect } from "react";
import { createPost, uploadFile } from "../services/postService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const CreatePostPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author_name: "",
    place: "",
  });
  const [files, setFiles] = useState({
    image: null,
    video: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState({
    image: null,
    video: null,
  });
  const navigate = useNavigate();
  const { user } = useAuth();

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
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let image_url = null;
      let video_url = null;

      // Upload image if exists
      if (files.image) {
        console.log("Uploading image...");
        const { url, error: imageError } = await uploadFile(
          files.image,
          "images"
        );
        if (imageError) throw imageError;
        console.log("Image uploaded successfully:", url);
        image_url = url;
      }

      // Upload video if exists
      if (files.video) {
        const { url, error: videoError } = await uploadFile(
          files.video,
          "videos"
        );
        if (videoError) throw videoError;
        video_url = url;
      }

      // Create post with uploaded file URLs
      const { data, error } = await createPost({
        ...formData,
        image_url,
        video_url,
      });

      if (error) throw error;

      navigate("/");
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="author_name"
            className="block text-sm font-medium text-gray-700"
          >
            Your Name
          </label>
          <input
            type="text"
            id="author_name"
            name="author_name"
            value={formData.author_name}
            onChange={(e) =>
              setFormData({ ...formData, author_name: e.target.value })
            }
            placeholder="Enter your name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="place"
            className="block text-sm font-medium text-gray-700"
          >
            Place
          </label>
          <input
            type="text"
            id="place"
            name="place"
            value={formData.place}
            onChange={(e) =>
              setFormData({ ...formData, place: e.target.value })
            }
            placeholder="Enter your place"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Image
          </label>
          <input
            type="file"
            id="image"
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
          {previews.image && (
            <div className="mt-2">
              <img
                src={previews.image}
                alt="Preview"
                className="h-32 w-full object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="video"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Video
          </label>
          <input
            type="file"
            id="video"
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
          {previews.video && (
            <div className="mt-2 aspect-video">
              <video
                src={previews.video}
                controls
                className="w-full h-full rounded-md"
              />
            </div>
          )}
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;
