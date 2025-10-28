import React from "react";

const PostCardSkeleton = () => {
  return (
    <div className="rounded-lg shadow-md border border-gray-100 bg-white mx-4 md:mx-8 p-4 animate-pulse">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Content */}
        <div className="flex flex-col flex-1">
          {/* User Info */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <div className="w-24 h-4 bg-gray-300 rounded"></div>
          </div>

          {/* Title */}
          <div className="w-3/4 h-6 bg-gray-300 rounded mb-2"></div>

          <div className="w-full h-4 bg-gray-300 rounded mb-1"></div>
          <div className="w-5/6 h-4 bg-gray-300 rounded mb-1"></div>
          <div className="w-2/3 h-4 bg-gray-300 rounded"></div>
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <div className="w-12 h-4 bg-gray-300 rounded"></div>
        <div className="w-12 h-4 bg-gray-300 rounded"></div>
        <div className="w-12 h-4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;
