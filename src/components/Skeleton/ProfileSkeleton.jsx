import React from "react";

const ProfileSkeleton = () => {
  return (
    <main className="bg-opacity-25 py-6 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-5xl mx-auto mb-8">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row items-center py-4 md:py-8 text-center sm:text-left">
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gray-300 rounded-full border-2 border-gray-400 p-1" />

          <div className="sm:ml-6 mt-4 sm:mt-0 flex-1">
            <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-2 mb-4">
              <div className="h-6 w-40 bg-gray-300 rounded" />
              <div className="h-5 w-5 bg-gray-300 rounded-full" />
              <div className="h-8 w-24 bg-gray-300 rounded mt-2 sm:mt-0" />
            </div>

            <ul className="flex justify-center sm:justify-start space-x-6 text-sm text-gray-600">
              <li className="h-4 w-20 bg-gray-300 rounded" />
              <li className="h-4 w-20 bg-gray-300 rounded" />
              <li className="h-4 w-20 bg-gray-300 rounded" />
            </ul>

            <div className="h-5 w-full bg-gray-300 rounded mt-2" />
          </div>
        </header>

        {/* Post Navigation */}
        <div className="border-t mt-4">
          <ul className="flex justify-center space-x-6 text-xs sm:text-sm font-semibold text-gray-600 py-3">
            <li className="h-4 w-16 bg-gray-300 rounded" />
            <li className="h-4 w-16 bg-gray-300 rounded" />
            <li className="h-4 w-16 bg-gray-300 rounded" />
          </ul>
        </div>

        {/* Posts Section */}
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="h-40 bg-gray-300 rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfileSkeleton;
