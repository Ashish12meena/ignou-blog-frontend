import React, { useState, useEffect } from "react";
import { getCategories } from "../services/CategoryService";
import { useSelector } from "react-redux";
import HomePageSkeleton from "../components/Skeleton/HomePageSkeleton";
import { searchPost } from "../services/PostService";
import PostCard from "../components/post/PostCard";

const Explore = () => {
    const [category, setCategory] = useState([]); // Selected categories
    const [categoriesList, setCategoriesList] = useState([]); // All categories from API
    const [filteredCategories, setFilteredCategories] = useState([]); // Filtered categories for search
    const [searchText, setSearchText] = useState(""); // User input
    const { userId } = useSelector(state => state.user);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadmore, setLoadmore] = useState(false);


    // Fetch available categories on mount
    useEffect(() => {
        const fetchCategoryList = async () => {
            setLoading(true)
            try {
                const response = await getCategories();
                setCategoriesList(response);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false)
            }
        };
        fetchCategoryList();
    }, []);

    // Handle category search input
    const handleCategorySearch = (e) => {
        const text = e.target.value;
        setSearchText(text);

        if (text.trim() === "") {
            setFilteredCategories([]);
            return;
        }

        const matchedCategories = categoriesList
            .filter((cat) => cat.name.toLowerCase().includes(text.toLowerCase()))
            .sort((a, b) => a.name.toLowerCase().indexOf(text.toLowerCase()) - b.name.toLowerCase().indexOf(text.toLowerCase()))
            .slice(0, 4); // Limit suggestions

        setFilteredCategories(matchedCategories);
    };

    // Handle category selection
    const handleCategorySelect = (selectedCategory) => {
        if (!category.some((cat) => cat.id === selectedCategory.id)) {
            setCategory([...category, selectedCategory]);
        }
        setSearchText("");
        setFilteredCategories([]);
    };

    // Remove selected category
    const handleRemoveCategory = (id) => {
        setCategory(category.filter((cat) => cat.id !== id));
    };

    // Check if search button should be enabled
    const isSearchEnabled = category.length > 0 || searchText.length >= 3;

    // Handle API search
    const handleSearch = async () => {
        if (!isSearchEnabled) return; // Prevent unnecessary calls
        if (category.length === 0 && searchText.length < 3) return;
        setLoading(true)

        try {
            const searchData = {
                excludedIds: [],
                listOfCategories: category.length > 0 ? category.map((c) => c.name) : null,
                userId: userId,
                text: category.length === 0 ? searchText : null,
                sample: 30
            };
            const response = await searchPost(searchData) 
            setPosts(response.data);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false)
            setLoadmore(true)
        }
    };


    const handleKeyDown = (e) => {
        if (e.key === "Enter" && isSearchEnabled) {
            handleSearch();
        }
    };
    const loadMorePosts = async () => {
        try {
            const postIds = posts.map((post) => post.postId);
            const searchData = {
                excludedIds: postIds,
                listOfCategories: category.length > 0 ? category.map((c) => c.name) : null,
                userId: userId,
                text: category.length === 0 ? searchText : null,
                sample: 30
            };
            const response = await searchPost(searchData);
            setPosts((prevPosts) => [...prevPosts, ...response.data])

        } catch (error) {
            console.error("Error loading more posts:", error);
        }
    };

    if (loading) return <HomePageSkeleton />;

    return (
        <div className="max-w-3xl mx-auto  p-5">
            {/* Search Input & Button (Side by Side) */}
            <div className="flex items-center gap-2 bg-white shadow-md rounded-lg">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchText}
                        onChange={handleCategorySearch}
                        onKeyDown={handleKeyDown} // Handle Enter key
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {/* Category Suggestions */}
                    {filteredCategories.length > 0 && (
                        <ul className="absolute w-full bg-white shadow-md rounded-md mt-1 border border-gray-200 z-10">
                            {filteredCategories.map((cat) => (
                                <li
                                    key={cat.id}
                                    onClick={() => handleCategorySelect(cat)}
                                    className="p-2 hover:bg-blue-100 cursor-pointer"
                                >
                                    {cat.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    disabled={!isSearchEnabled}
                    className={`px-5 py-3 rounded-lg transition duration-300 ${isSearchEnabled
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Search
                </button>
            </div>

            {/* Selected Categories */}
            {category.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    {category.map((cat) => (
                        <span
                            key={cat.id}
                            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center"
                        >
                            {cat.name}
                            <button
                                onClick={() => handleRemoveCategory(cat.id)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                ✕
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Search Results */}
            <div className=" flex flex-col my-6" >
                {posts.map((post, index) => (
                    <PostCard
                        key={index}
                        postId={post.postId}
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
            </div>
            {(loadmore && posts.length>5) && (
                <button
                    onClick={loadMorePosts}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Load More...
                </button>
            )}
        </div>
    );
};

export default Explore;
