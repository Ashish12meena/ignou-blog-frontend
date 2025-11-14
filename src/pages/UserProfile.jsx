import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { getUserByEmail } from "../services/userService";
import PostCard from "../components/post/PostCard";
import profileEmptyLogo from "../assets/images/No-Avtar.png";
import ProfileSkeleton from "../components/Skeleton/ProfileSkeleton";
import { useParams } from "react-router-dom";
import { GiCheckMark } from "react-icons/gi";
import { addFollower, removeFollower } from "../services/followService";

const Profile = () => {
  const { userEmail } = useParams();
  const dispatch = useDispatch();
  const { email: loggedInEmail, userId } = useSelector((state) => state.user);
  
  // Ensure userId is available from localStorage if not in Redux
  const effectiveUserId = userId || localStorage.getItem('userId');
  const effectiveEmail = loggedInEmail || localStorage.getItem('email');
  
  const emailToFetch = userEmail || effectiveEmail;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followStatus, setFollowStatus] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    // Ensure Redux store is populated from localStorage
    if (!userId && localStorage.getItem('userId')) {
      dispatch(setUser({
        userId: localStorage.getItem('userId'),
        username: localStorage.getItem('username'),
        email: localStorage.getItem('email'),
        profilePicture: localStorage.getItem('profilePicture')
      }));
    }
  }, [userId, dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!emailToFetch || !effectiveUserId) {
        console.error('Missing required data:', { emailToFetch, effectiveUserId });
        setError('Missing user information');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Fetching user data for:', emailToFetch);
        const response = await getUserByEmail(emailToFetch, effectiveUserId);
        
        console.log('User data response:', response);

        if (response && response.user) {
          setUser(response.user);
          setPosts(response.posts || []);
          setFollowStatus(response.user.followStatus || false);
        } else {
          setError('User data not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.response?.data?.error || 'Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [emailToFetch, effectiveUserId]);

  const handleFollow = async () => {
    if (!user?.userId || !effectiveUserId) {
      console.error("User ID is missing");
      return;
    }

    const previousStatus = followStatus;
    setFollowStatus(!followStatus);

    try {
      if (previousStatus) {
        await removeFollower(effectiveUserId, user.userId);
      } else {
        await addFollower(effectiveUserId, user.userId);
      }
    } catch (error) {
      console.error("Error updating follow status:", error);
      setFollowStatus(previousStatus);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <main className="bg-opacity-25 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto mb-8">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row items-center py-4 md:py-8 text-center sm:text-left">
          <div className="w-32 h-32 sm:w-40 sm:h-40">
            <img
              className="w-full h-full object-cover rounded-full border-2 border-pink-600 p-1"
              src={user.profilePicture || profileEmptyLogo}
              alt="Profile"
              onError={(e) => {
                e.target.src = profileEmptyLogo;
              }}
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
                    <span className="flex flex-row items-center gap-2 px-4 py-2 font-semibold text-sm rounded mt-2 sm:mt-0 text-black bg-gray-300 hover:bg-gray-400">
                      Following <GiCheckMark />
                    </span>
                  ) : (
                    <span className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 font-semibold text-sm rounded mt-2 sm:mt-0">
                      Follow
                    </span>
                  )}
                </button>
              )}
            </div>

            {/* Stats Section */}
            <ul className="flex justify-center sm:justify-start space-x-6 text-sm text-gray-600">
              <li>
                <span className="font-semibold">{user.postCount || 0}</span> posts
              </li>
              <li>
                <span className="font-semibold">{user.followerCount || 0}</span> followers
              </li>
              <li>
                <span className="font-semibold">{user.followingCount || 0}</span> following
              </li>
            </ul>

            {/* Bio Section */}
            {user.userBio && (
              <p className="mt-2 text-gray-700 text-sm sm:text-base">{user.userBio}</p>
            )}
          </div>
        </header>

        {/* Post Navigation */}
        <div className="border-t mt-4">
          <ul className="flex justify-center space-x-6 text-xs sm:text-sm font-semibold text-gray-600 py-3">
            <li>
              <button
                className={`pb-1 cursor-pointer ${
                  activeTab === "posts" ? "border-b-2 border-gray-700 text-gray-700" : ""
                }`}
                onClick={() => setActiveTab("posts")}
              >
                Posts
              </button>
            </li>
            <li>
              <button
                className={`pb-1 cursor-pointer ${
                  activeTab === "saved" ? "border-b-2 border-gray-700 text-gray-700" : ""
                }`}
                onClick={() => setActiveTab("saved")}
              >
                Saved
              </button>
            </li>
            <li>
              <button
                className={`pb-1 cursor-pointer ${
                  activeTab === "tagged" ? "border-b-2 border-gray-700 text-gray-700" : ""
                }`}
                onClick={() => setActiveTab("tagged")}
              >
                Tagged
              </button>
            </li>
          </ul>
        </div>

        {/* Posts Section */}
        <div className="p-4">
          {activeTab === "posts" && (
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
              {posts && posts.length > 0 ? (
                posts.map((post, index) => (
                  <PostCard
                    key={post.postId || index}
                    postId={post.postId}
                    postTitle={post.postTitle}
                    postContent={post.postContent}
                    postImage={post.postImage}
                    likeCount={post.likeCount}
                    commentCount={post.commentCount}
                    likeStatus={post.likeStatus}
                  />
                ))
              ) : (
                <div className="text-center col-span-full text-gray-500">
                  No posts available
                </div>
              )}
            </div>
          )}

          {activeTab === "saved" && (
            <div className="text-center text-gray-500">
              Saved posts feature coming soon
            </div>
          )}

          {activeTab === "tagged" && (
            <div className="text-center text-gray-500">
              Tagged posts feature coming soon
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Profile;