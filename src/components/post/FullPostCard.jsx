import React, { useDebugValue, useEffect, useState } from "react";
import CommentCard from "./CommentCard";
import PostCard from "./PostCard";
import { useLocation } from "react-router-dom";
import { getFullPostDetail } from "../../services/PostService";
import { useSelector } from "react-redux";
import { submitComment } from "../../services/CommentService";


const FullPostCard = () => {
    const [cardDetails, setCardDetails] = useState({})
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const postId = params.get("postId");
    const { userId } = useSelector((state) => state.user)
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getFullPostDetail({ postId, userId }); // Fetch data from the API
                setCardDetails(data); // Update state with the fetched data
                
                setLoading(false); // Set loading to false
            } catch (error) {
                console.error('Error fetching card details:', error);
                setLoading(false); // Set loading to false in case of error
            }finally{
                setLoading(false)
            }
        };

        fetchData();
    }, [postId, userId]);




    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { postId, userId, commentText };
        if (!commentText.trim()) return;

        try {

            // Call an API to submit the comment
            const response = await submitComment({ data });

            if (response.status === 200) {
                // Optionally, refresh the post details to include the new comment
                setCardDetails((prev) => ({
                    ...prev,
                    comments: [...(prev.comments || []), response.data.id],
                    commentCount: (prev.commentCount || 0) + 1,
                }));


                
                setCommentText(""); // Clear input field after successful submission
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    }
    const handleChange = (e) => {
        setCommentText(e.target.value);
    };

    const handleCancel = () => {
        setCommentText("")
        setIsTyping(false)
    }
    if (loading) return <p>loading..</p>;
    if (!cardDetails) return <p>No Post Found</p>;
 
    return (
        <>
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
                            isFullPost={true}>
                        </PostCard>

                        <form className="mb-6 mx-4 md:mx-8" onSubmit={handleSubmit}>
                            <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                                <label htmlFor="comment" className="sr-only">
                                    Your comment
                                </label>
                                <textarea
                                    id="comment"
                                    name="comment"
                                    value={commentText}
                                    onFocus={() => setIsTyping(true)}
                                    rows="4"
                                    onChange={handleChange}
                                    className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                    placeholder="Write a comment..."
                                    required
                                ></textarea>
                            </div>
                            {isTyping && (
                                <div className="flex justify-end">
                                    <div>
                                        <button
                                            type="submit"
                                            onClick={handleCancel}
                                            className="  cursor-pointer hover:bg-gray-100  py-2.5 px-4 text-xs font-medium  text-black rounded-full  "
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={!commentText.trim()} // Disable button when commentText is empty
                                            className={`py-2.5 px-4 text-xs font-medium rounded-full focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 
                                            ${commentText.trim() ? "bg-blue-500 text-white cursor-pointer hover:bg-blue-600" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
                                        >
                                            Post comment
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                        {/* Render Multiple Comments Dynamically */}
                        {cardDetails.comments && cardDetails.comments.length > 0 ? (
                            cardDetails.comments.map((commentId) => (
                                <CommentCard key={commentId} commentId={commentId} />
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm text-center">No comments yet</p>
                        )}
                    </div>
                </section>

            </div>
        </>
    );
};

export default FullPostCard;
