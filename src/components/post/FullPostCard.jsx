import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { useLocation } from "react-router-dom";
import { getFullPostDetail } from "../../services/PostService";
import { useSelector } from "react-redux";

const FullPostCard = () => {
    const [cardDetails, setCardDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const postId = params.get("postId");
    const { userId } = useSelector((state) => state.user);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getFullPostDetail({ postId, userId }); 
                setCardDetails(data);
            } catch (error) {
                console.error('Error fetching card details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (postId && userId) {
            fetchData();
        }
    }, [postId, userId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!cardDetails || !cardDetails.postTitle) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">No Post Found</p>
            </div>
        );
    }
 
    return (
        <div>
            <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
                <div className="md:max-w-[75%] mx-auto px-4">
                    <PostCard
                        username={cardDetails.username}
                        likeStatus={cardDetails.likeStatus}
                        userEmail={cardDetails.userEmail}
                        postId={postId}
                        postTitle={cardDetails.postTitle} 
                        commentCount={cardDetails.commentCount} 
                        profilePicture={cardDetails.profilePicture}
                        likeCount={cardDetails.likeCount} 
                        postImage={cardDetails.postImage}
                        postContent={cardDetails.postContent} 
                        isFullPost={true}
                    />
                </div>
            </section>
        </div>
    );
};

export default FullPostCard;