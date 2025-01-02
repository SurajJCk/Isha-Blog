import React from "react";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <Link to={`/post/${post.id}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {post.image_url && (
          <div className="h-40 overflow-hidden rounded-t-lg">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center space-x-2 mb-3">
            <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {post.author_name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {post.author_name}
              </span>
              {post.place && (
                <span className="text-xs text-gray-500">{post.place}</span>
              )}
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {post.title}
          </h2>
          <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
            {post.content}
          </p>

          <div className="text-xs text-gray-500 mt-auto">
            <span>{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
