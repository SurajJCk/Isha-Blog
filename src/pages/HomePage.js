import React, { useState, useEffect } from "react";
import { fetchPosts } from "../services/postService";
import PostCard from "../components/PostCard";
import SearchBar from "../components/SearchBar";
import CategoryTags from "../components/CategoryTags";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Sample categories - update based on your needs
  const categories = [
    "Sadhguru",
    "Sadhnapada",
    "Dhyanlinga",
    "Linga Bhairavi",
    "Seva",
    "Volunteering",
  ];

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

  // Filter posts based on search term and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div>
      {/* Banner Section */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img
          src="/sp_banner.png"
          alt="Sadhnapada Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white"></div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchBar onSearch={setSearchTerm} />
          <CategoryTags
            categories={categories}
            onSelect={(category) =>
              setSelectedCategory(category === selectedCategory ? "" : category)
            }
            selectedCategory={selectedCategory}
          />
        </div>

        {/* Posts Section */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Posts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">
              No posts found.
            </p>
          ) : (
            filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
