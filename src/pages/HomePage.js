import React, { useState, useEffect } from "react";
import { fetchPosts } from "../services/postService";
import PostCard from "../components/PostCard";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPosts = async () => {
      const { data, error } = await fetchPosts();
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setPosts(data || []);
      }
    };
    getPosts();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 text-center p-4">
        Error loading posts: {error}
      </div>
    );

  return (
    <div>
      {/* Banner Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src="/sp_banner.png" // You'll need to add your banner image to the public folder
          alt="Sadhnapada Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
          {/* <h1 className="text-5xl font-bold mb-4">Sadhnapada</h1>
          <p className="text-xl max-w-2xl text-center px-4">
            Explore the journey of learning and growth
          </p> */}
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">
              No posts yet.
            </p>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
