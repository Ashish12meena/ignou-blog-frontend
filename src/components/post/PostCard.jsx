import React from 'react';
import PropTypes from 'prop-types';
import IconStrip from '../IconStrip';
import { Link, useNavigate } from 'react-router-dom';
import truncate from "html-truncate";

const PostCard = ({ 
  username = "Unknown", 
  userEmail = "", 
  profilePicture = "", 
  postTitle = "Untitled", 
  postContent = "", 
  postImage = "", 
  likeStatus = false, 
  likeCount = 0, 
  commentCount = 0, 
  isFullPost = false, 
  postId 
}) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    if (postId) {
      navigate(`/post?postId=${encodeURIComponent(postId)}`, { state: { postId } });
    }
  };

  return (
    <div className="w-full m-3 overflow-x-hidden rounded-lg shadow-md border border-gray-100 bg-white mx-4 md:mx-8 p-4 flex flex-col justify-between h-full">
      <div className={`flex flex-col flex-1 ${!isFullPost ? "md:flex-row" : ""} gap-4`}>
        <div className="flex flex-col flex-1">
          {(profilePicture || username) && (
            <div className="flex items-center gap-2 mb-2">
              <img
                src={profilePicture || "https://via.placeholder.com/150"}
                alt={username}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <span className="font-semibold text-gray-800">
                {userEmail ? (
                  <Link to={`/profile/${userEmail}`} className="hover:underline">
                    {username}
                  </Link>
                ) : (
                  <span>{username}</span>
                )}
              </span>
            </div>
          )}

          <div className="flex flex-col justify-center md:text-start flex-grow" onClick={handleReadMore}>
            <h1 className={`font-bold ${isFullPost ? "md:text-4xl sm:text-3xl text-xl" : "text-lg"} text-gray-900 cursor-pointer hover:text-blue-600`}>
              {postTitle}
            </h1>

            {isFullPost && postImage && (
              <div className="flex justify-center m-2 md:px-16">
                <img
                  src={postImage}
                  alt="Post"
                  className="w-full m-11 max-w-full max-h-[50%] object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="text-sm text-gray-600 cursor-pointer">
              {isFullPost ? (
                <div className="break-words whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: postContent || "No content available." }}>
                </div>
              ) : (
                <>
                  <div className="break-words whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: truncate(postContent || "No content available.", 100) }}>
                  </div>
                  {postContent && postContent.length > 100 && (
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-1">
                      ...read more
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {!isFullPost && postImage && (
          <div className="flex justify-center m-2">
            <img
              src={postImage}
              alt="Post"
              className="w-full max-w-60 sm:max-w-96 md:w-48 max-h-60 md:max-h-40 object-cover rounded-lg cursor-pointer hover:opacity-90"
              onClick={handleReadMore}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      <div className="mt-auto pt-4">
        <IconStrip 
          likeStatus={likeStatus} 
          likeCount={likeCount} 
          commentCount={commentCount} 
          postId={postId} 
        />
      </div>
    </div>
  );
};

PostCard.propTypes = {
  username: PropTypes.string,
  userEmail: PropTypes.string,
  profilePicture: PropTypes.string,
  postTitle: PropTypes.string,
  postContent: PropTypes.string,
  postImage: PropTypes.string,
  likeStatus: PropTypes.bool,
  likeCount: PropTypes.number,
  commentCount: PropTypes.number,
  isFullPost: PropTypes.bool,
  postId: PropTypes.string.isRequired,
};

export default PostCard;