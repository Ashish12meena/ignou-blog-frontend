import React from "react";

export default function SidebarSkleton() {
  return (
    <div className="flex h-screen p-4 animate-pulse">
      {/* Sidebar Skeleton */}
      <nav className="shadow-md h-screen p-2 flex flex-col bg-gray-200 text-gray-300 fixed top-0 left-0 w-60">
        <div className="px-3 py-2 h-20 flex justify-between items-center">
          <div className="w-28 h-8 bg-gray-300 rounded-md"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>

        {/* Sidebar Menu Skeleton */}
        <ul className="flex-1">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <li
                key={index}
                className="px-3 py-2 my-2 flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-gray-300 rounded-md"></div>
                <div className="w-24 h-5 bg-gray-300 rounded-md"></div>
              </li>
            ))}
        </ul>

        {/* Footer Skeleton */}
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-20 h-5 bg-gray-300 rounded-md"></div>
        </div>
      </nav>
    </div>
  );
}
