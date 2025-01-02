import React, { useState, useEffect } from "react";
import {
  AiFillLike,
  AiFillDislike,
  AiOutlineLike,
  AiOutlineDislike,
} from "react-icons/ai";
import { getVotes, getUserVote, vote } from "../services/postService";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const VoteButtons = ({ postId }) => {
  const [voteCount, setVoteCount] = useState(0);
  const [userVote, setUserVote] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadVotes();
  }, [postId]);

  const loadVotes = async () => {
    const { data: totalVotes } = await getVotes(postId);
    setVoteCount(Math.abs(totalVotes) || 0);

    if (user) {
      const { data: userVoteType } = await getUserVote(postId);
      setUserVote(userVoteType);
    }
  };

  const handleVote = async (voteType) => {
    if (!user) {
      navigate("/login");
      return;
    }

    const { error } = await vote(postId, voteType);
    if (!error) {
      loadVotes();
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={() => handleVote(1)}
        className={`flex items-center space-x-1 p-1.5 rounded-md transition-colors ${
          userVote === 1
            ? "text-blue-600 bg-blue-50"
            : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
        }`}
      >
        {userVote === 1 ? (
          <AiFillLike className="text-xl" />
        ) : (
          <AiOutlineLike className="text-xl" />
        )}
        <span className="text-sm font-medium">{voteCount}</span>
      </button>

      <button
        onClick={() => handleVote(-1)}
        className={`flex items-center space-x-1 p-1.5 rounded-md transition-colors ${
          userVote === -1
            ? "text-red-600 bg-red-50"
            : "text-gray-500 hover:text-red-600 hover:bg-red-50"
        }`}
      >
        {userVote === -1 ? (
          <AiFillDislike className="text-xl" />
        ) : (
          <AiOutlineDislike className="text-xl" />
        )}
      </button>
    </div>
  );
};

export default VoteButtons;
