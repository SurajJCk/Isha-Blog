import React, { useState } from "react";
import { Link } from "react-router-dom";
import VoteButtons from "./VoteButtons";

const PostCard = ({ post }) => {
  const [imageError, setImageError] = useState(false);

  // Only show image if we have a URL and haven't encountered an error
  const showImage = post.image_url && !imageError;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {showImage && (
        <div className="w-full h-48 relative">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover rounded-t-lg"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col">
        <Link to={`/post/${post.id}`}>
          <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600">
            {post.title}
          </h2>
        </Link>

        <div className="text-gray-600 text-sm mb-4">
          <span>{post.author_name}</span>
          {post.place && (
            <>
              <span className="mx-2">•</span>
              <span>{post.place}</span>
            </>
          )}
          <span className="mx-2">•</span>
          <span>{new Date(post.created_at).toLocaleDateString()}</span>
        </div>

        <p className="text-gray-600 mb-4 flex-grow">
          {post.content.length > 150
            ? `${post.content.substring(0, 150)}...`
            : post.content}
        </p>

        <div className="pt-4 border-t border-gray-100">
          <VoteButtons postId={post.id} />
        </div>
      </div>
    </div>
  );
};

export default PostCard;
