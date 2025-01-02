import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getComments, addComment } from "../services/commentService";
import { useNavigate } from "react-router-dom";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    const { data, error } = await getComments(postId);
    if (!error) {
      setComments(data || []);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    if (!newComment.trim()) return;

    setLoading(true);
    console.log("Submitting comment:", { postId, content: newComment.trim() });

    const { data, error } = await addComment(postId, newComment.trim());
    console.log("Response:", { data, error });

    setLoading(false);

    if (error) {
      console.error("Error adding comment:", error);
      return;
    }

    if (data) {
      setNewComment("");
      setComments([data, ...comments]);
    }
  };

  return (
    <div className="mt-8 space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Comments</h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={user ? "Add a comment..." : "Please login to comment"}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          rows="3"
          disabled={!user}
        />
        <button
          type="submit"
          disabled={loading || !newComment.trim() || !user}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Posting..." : "Post Comment"}
        </button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="font-medium text-gray-900">
                {comment.profiles?.name || "Anonymous"}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="mt-2 text-gray-600">{comment.content}</div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 text-center">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
