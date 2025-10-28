import React, { useState } from 'react';
import IconStrip from '../IconStrip';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import truncate from "html-truncate";

const PostCard = ({ username, userEmail, profilePicture, postTitle, postContent, postImage, likeStatus, likeCount, commentCount, isFullPost, postId }) => {
  const navigate = useNavigate();


  const handleReadMore = () => {
    navigate(`/post?postId=${encodeURIComponent(postId)}`, { state: { postId } });
  };

  return (
    <div className="w-full m-3 overflow-x-hidden rounded-lg shadow-md border border-gray-100 bg-white mx-4 md:mx-8 p-4 flex flex-col justify-between h-full">
      <div className={`flex flex-col flex-1 ${!isFullPost ? "md:flex-row" : ""} gap-4`}>

        {/* Content Section */}
        <div className="flex flex-col flex-1" >
          {/* User Info */}
          {(profilePicture || username) && (
            <div className="flex items-center gap-2 mb-2">
              <img
                src={profilePicture || "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="}
                alt={username || "Unknown"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-semibold text-gray-800">
                <Link to={`/profile/${userEmail}`} className=" hover:underline">
                  {username || "Unknown"}
                </Link>
              </span>
            </div>
          )}

          <div className="flex flex-col justify-center md:text-start flex-grow" onClick={handleReadMore}>
            <h1 className={`font-bold ${isFullPost ? "md:text-4xl sm:text-3xl text-xl" : "text-lg"} text-gray-900`}>
              {postTitle || "Untitled"}
            </h1>

            {isFullPost && postImage && (
              <div className="flex justify-center m-2 md:px-16">
                <img
                  src={postImage}
                  alt="Post"
                  className="w-full m-11 max-w-full max-h-[50%] object-cover rounded-lg"
                />
              </div>
            )}

            <div className="text-sm text-gray-600" onClick={handleReadMore}>
              {isFullPost ? (
                <span className="break-words whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: postContent || "No content available." }}>
                </span>
              ) : (
                <>
                  <span className="break-words whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: truncate(postContent || "", 100) }}>
                  </span>
                  {postContent && postContent.length > 100 && (
                    <button className="text-sm text-gray-600">...read More</button>
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
              className="w-full max-w-60 sm:max-w-96 md:w-48 max-h-60 md:max-h-40 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* IconStrip should always be at the bottom */}
      <div className="mt-auto pt-4" onClick={handleReadMore}>
        <IconStrip likeStatus={likeStatus} likeCount={likeCount} commentCount={commentCount} postId={postId} />
      </div>
    </div>
  );
};

export default PostCard;
