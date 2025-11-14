import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaRegHeart, FaCommentDots, FaRegBookmark, FaEllipsisH, FaHeart, FaBookmark } from 'react-icons/fa';
import { addLike, removeLike } from '../services/likeService';

const IconStrip = ({ likeCount = 0, commentCount = 0, saves = 0, postId, likeStatus = false }) => {
  const [liked, setLiked] = useState(likeStatus);
  const [likeCounts, setLikeCounts] = useState(likeCount);
  const [bookMark, setBookMark] = useState(false);

  const handleLike = async () => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      console.error('User not logged in');
      return;
    }

    try {
      if (liked) {
        setLiked(false);
        setLikeCounts(likeCounts - 1);
        await removeLike(userId, postId);
      } else {
        setLiked(true);
        setLikeCounts(likeCounts + 1);
        await addLike(userId, postId);
      }
    } catch (error) {
      console.error('Error handling like:', error);
      // Revert changes on error
      setLiked(!liked);
      setLikeCounts(liked ? likeCounts + 1 : likeCounts - 1);
    }
  };

  return (
    <div className="flex justify-between items-center mt-4 px-4 py-2">
      <div className="flex items-center space-x-6">
        <button onClick={handleLike} className="flex items-center space-x-2">
          <FaHeart
            className="transition duration-200 cursor-pointer text-xl hover:text-red-500"
            color={liked ? "red" : "gray"}
          />
          <span className="text-sm">{likeCounts}</span>
        </button>

        <div className="flex items-center space-x-2">
          <FaCommentDots className="text-xl cursor-pointer hover:text-blue-500" />
          <span className="text-sm">{commentCount}</span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2" onClick={() => setBookMark(!bookMark)}>
          {bookMark ? (
            <FaBookmark className="text-xl cursor-pointer" />
          ) : (
            <FaRegBookmark className="text-xl cursor-pointer" />
          )}
          <span className="text-sm">{saves}</span>
        </div>

        <div className="flex items-center">
          <FaEllipsisH className="text-xl cursor-pointer hover:text-gray-600" />
        </div>
      </div>
    </div>
  );
};

IconStrip.propTypes = {
  likeCount: PropTypes.number,
  commentCount: PropTypes.number,
  saves: PropTypes.number,
  postId: PropTypes.string.isRequired,
  likeStatus: PropTypes.bool,
};

export default IconStrip;