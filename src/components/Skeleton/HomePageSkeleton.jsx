import React from 'react'
import PostCardSkeleton from './PostCardSkelonton';

const skeletonArray = Array(5).fill(null);
const HomePageSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      {skeletonArray.map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default HomePageSkeleton