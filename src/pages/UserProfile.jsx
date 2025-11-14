import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserByEmail } from "../services/userService";
import PostCard from "../components/post/PostCard";
import profileEmptyLogo from "../assets/images/No-Avtar.png";
import ProfileSkeleton from "../components/Skeleton/ProfileSkeleton";
import { useParams } from "react-router-dom";
import { GiCheckMark } from "react-icons/gi";
import { addFollower, getFollowStatus, removeFollower } from "../services/followService";


const Profile = () => {
  const { userEmail } = useParams();
  const { email: loggedInEmail, userId } = useSelector((state) => state.user);
  const emailToFetch = userEmail || loggedInEmail;
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);


  const [posts, setPosts] = useState([]);
  const [followStatus, setFollowStatus] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

 


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  useEffect(() => {
    try {
      if (emailToFetch) {
        getUserByEmail(emailToFetch, userId)
          .then((response) => {
            setUser(response.user || []);
            setPosts(response.posts || []);
            setFollowStatus(response.user.followStatus || false);
          }).finally(() => setLoading(false));

      }

    } catch (error) {
       console.log("Error fetching user:", error);
    }

  }, [emailToFetch]);


  const handleFollow = async () => {
    if (!user.userId || !userId) {
      console.error("User ID is missing");
      return;
    }
    try {
      setFollowStatus(!followStatus);
      if (followStatus) {
        // If already following, remove the follower
        await removeFollower(userId, user.userId);
      } else {
        // If not following, add the follower
        await addFollower(userId, user.userId);
      }

      // Toggle the follow status after a successful API call
    } catch (error) {
      console.error("Error updating follow status:", error);
    }
  };

  if (!user||loading) {
    return <ProfileSkeleton />;
  }



  return (
    <main className="bg-opacity-25 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto mb-8">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row items-center py-4 md:py-8 text-center sm:text-left">
          <div className="w-32 h-32 sm:w-40 sm:h-40">
            <img
              className="w-full h-full object-cover rounded-full border-2 border-pink-600 p-1"
              src={user.profilePicture === "" ? profileEmptyLogo : user.profilePicture}
              alt="Profile"
            />
          </div>

          {/* Profile Meta */}
          <div className="sm:ml-6 mt-4 sm:mt-0 flex-1">
            <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-2 mb-4">
              <h2 className="text-2xl sm:text-3xl font-light">{user.username}</h2>
              <span className="text-blue-500 text-xl relative">
                <i className="fas fa-check-circle"></i>
              </span>
              {userEmail && userEmail !== loggedInEmail && (
                <button
                  className="cursor-pointer"
                  onClick={handleFollow}
                >
                  {followStatus ? (
                    <span className="flex flex-row px-4 py-2 font-semibold text-sm rounded mt-2 sm:mt-0 text-black bg-gray-500">Following <GiCheckMark /></span>
                  ) : (
                    <span className="bg-blue-500 px-4 py-2 font-semibold text-sm rounded mt-2 sm:mt-0">Follow</span>
                  )}
                </button>
              )}
            </div>

            {/* Stats Section */}
            <ul className="flex justify-center sm:justify-start space-x-6 text-sm text-gray-600">
              <li><span className="font-semibold">{user.postCount}</span> posts</li>
              <li><span className="font-semibold">{user.followerCount}</span> followers</li>
              <li><span className="font-semibold">{user.followingCount}</span> following</li>
            </ul>

            {/* Bio Section */}
            <p className="mt-2 text-gray-700 text-sm sm:text-base">{user.bio}</p>
          </div>
        </header>

        {/* Post Navigation */}
        <div className="border-t mt-4">
          <ul className="flex justify-center space-x-6 text-xs sm:text-sm font-semibold text-gray-600 py-3">
            <li>
              <a className={`pb-1 cursor-pointer ${activeTab === "posts" ? "border-b-2 border-gray-700 text-gray-700" : ""}`}
                onClick={() => setActiveTab("posts")}>Posts</a>
            </li>
            <li>
              <a className={`pb-1 cursor-pointer ${activeTab === "saved" ? "border-b-2 border-gray-700 text-gray-700" : ""}`}
                onClick={() => setActiveTab("saved")}>Saved</a>
            </li>
            <li>
              <a className={`pb-1 cursor-pointer ${activeTab === "tagged" ? "border-b-2 border-gray-700 text-gray-700" : ""}`}
                onClick={() => setActiveTab("tagged")}>Tagged</a>
            </li>
          </ul>
        </div>

        {/* Posts Section */}
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
            {posts && posts.length > 0 ? (
              posts.map((post, index) => (
                <PostCard
                  key={index}
                  postTitle={post.postTitle}
                  postContent={post.postContent}
                  postImage={post.postImage}
                  likeCount={post.likeCount}
                  commentCount={post.commentCount}
                  postId={post.postId}
                  likeStatus={post.likeStatus}
                />
              ))
            ) : (
              <div className="text-center col-span-full">No Post Available</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
