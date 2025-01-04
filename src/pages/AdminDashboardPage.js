import React, { useEffect, useState } from "react";
import {
  fetchPosts,
  deletePost,
  updatePost,
  uploadFile,
  updateUserRole, // New import - you'll need to implement this in postService
} from "../services/postService";

const AdminDashboardPage = () => {
  const [posts, setPosts] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState({
    image: null,
    video: null,
  });
  const [previews, setPreviews] = useState({
    image: null,
    video: null,
  });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const { data, error } = await fetchPosts();
    setLoading(false);
    if (data) {
      setPosts(data);
    } else {
      console.error("Error fetching posts:", error);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

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

  // Clean up preview URLs when modal closes
  useEffect(() => {
    if (!isEditModalOpen) {
      Object.values(previews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
      setPreviews({ image: null, video: null });
      setFiles({ image: null, video: null });
    }
  }, [isEditModalOpen]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let image_url = editingPost.image_url;
      let video_url = editingPost.video_url;

      if (files.image) {
        const { url, error: imageError } = await uploadFile(
          files.image,
          "images"
        );
        if (imageError) throw imageError;
        image_url = url;
      }

      if (files.video) {
        const { url, error: videoError } = await uploadFile(
          files.video,
          "videos"
        );
        if (videoError) throw videoError;
        video_url = url;
      }

      const { error } = await updatePost(editingPost.id, {
        ...editingPost,
        image_url,
        video_url,
      });

      if (!error) {
        setIsEditModalOpen(false);
        loadPosts();
        setFiles({ image: null, video: null });
      }
    } catch (err) {
      console.error("Error updating post:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const { error } = await deletePost(postId);
      if (!error) {
        setPosts(posts.filter((post) => post.id !== postId));
      }
    }
  };

  const handleAdminToggle = async (userId, currentStatus) => {
    try {
      const { error } = await updateUserRole(userId, !currentStatus);
      if (!error) {
        // Update the posts state to reflect the change
        setPosts(
          posts.map((post) => {
            if (post.author_id === userId) {
              return { ...post, is_admin: !currentStatus };
            }
            return post;
          })
        );
      }
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {post.author_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() =>
                        handleAdminToggle(post.author_id, post.is_admin)
                      }
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        post.is_admin ? "bg-indigo-600" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          post.is_admin ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal - Unchanged */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-black opacity-30"
              onClick={() => setIsEditModalOpen(false)}
            ></div>
            <div className="relative bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                Edit Post
              </h3>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingPost?.title || ""}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, title: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <textarea
                    value={editingPost?.content || ""}
                    onChange={(e) =>
                      setEditingPost({
                        ...editingPost,
                        content: e.target.value,
                      })
                    }
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Update Image
                  </label>
                  {(previews.image || editingPost?.image_url) && (
                    <img
                      src={previews.image || editingPost.image_url}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Update Video
                  </label>
                  {(previews.video || editingPost?.video_url) && (
                    <div className="mt-2 aspect-video">
                      {previews.video ? (
                        <video
                          src={previews.video}
                          controls
                          className="w-full h-full rounded-md"
                        />
                      ) : (
                        <iframe
                          src={editingPost.video_url}
                          className="w-full h-full rounded-md"
                          title="Current video"
                          allowFullScreen
                        />
                      )}
                    </div>
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

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setFiles({ image: null, video: null });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
