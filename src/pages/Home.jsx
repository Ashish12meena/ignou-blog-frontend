import React, { useEffect, useState } from "react";
import PostCard from "../components/post/PostCard";
import { getCardDetails } from "../services/PostService";
import HomePageSkeleton from "../components/Skeleton/HomePageSkeleton";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("foryou");
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          setError("Please login to view posts");
          setLoading(false);
          return;
        }

        const data = await getCardDetails({ userId, excludedIds: [] });
        
        if (data && Array.isArray(data)) {
          setPosts(data);
        } else {
          setPosts([]);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadMorePosts = async () => {
    try {
      setLoadingMore(true);
      const userId = localStorage.getItem('userId');
      const postIds = posts.map((post) => post.postId);
      const newPosts = await getCardDetails({ userId, excludedIds: postIds });
      
      if (newPosts && newPosts.length > 0) {
        setPosts([...posts, ...newPosts]);
      } else {
        console.log("No more posts to load");
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
      setError("Failed to load more posts");
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) return <HomePageSkeleton />;

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <ul className="flex justify-center space-x-6 text-xs sm:text-xl font-semibold text-gray-600 py-3">
          <button
            className={`cursor-pointer ${activeTab === "foryou" ? "border-b-2 border-gray-700 text-gray-700" : ""}`}
            onClick={() => setActiveTab("foryou")}
          >
            For You
          </button>
          <button
            className={`cursor-pointer ${activeTab === "following" ? "border-b-2 border-gray-700 text-gray-700" : ""}`}
            onClick={() => setActiveTab("following")}
          >
            Following
          </button>
          <button
            className={`cursor-pointer ${activeTab === "category" ? "border-b-2 border-gray-700 text-gray-700" : ""}`}
            onClick={() => setActiveTab("category")}
          >
            Category
          </button>
        </ul>
      </div>

      <div className="p-8 flex flex-col gap-6" style={{ margin: "10px" }}>
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>No posts available</p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.postId}
                postId={post.postId}
                userEmail={post.userEmail}
                username={post.username}
                profilePicture={post.profilePicture}
                postTitle={post.postTitle}
                postContent={post.postContent}
                postImage={post.postImage}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                likeStatus={post.likeStatus}
              />
            ))}
            <button
              onClick={loadMorePosts}
              disabled={loadingMore}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loadingMore ? "Loading..." : "Load More..."}
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Home;