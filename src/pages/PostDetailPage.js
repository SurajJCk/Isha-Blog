import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../services/postService";
import VoteButtons from "../components/VoteButtons";
import CommentSection from "../components/CommentSection";

const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await getPost(id);
      setLoading(false);
      if (!error) {
        setPost(data);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return <div className="animate-spin">Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const showImage = post.image_url && !imageError;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>

      <div className="flex items-center space-x-4 text-gray-600 mb-8">
        <span>{post.author_name}</span>
        {post.place && (
          <>
            <span>•</span>
            <span>{post.place}</span>
          </>
        )}
        <span>•</span>
        <span>{new Date(post.created_at).toLocaleDateString()}</span>
      </div>

      {showImage && (
        <div className="w-full h-96 relative mb-8">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover rounded-lg"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      )}

      {post.video_url && (
        <div className="aspect-w-16 aspect-h-9 mb-8">
          <iframe
            src={post.video_url}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      )}

      <div className="prose prose-lg max-w-none">{post.content}</div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <VoteButtons postId={post.id} />
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
};

export default PostDetailPage;
