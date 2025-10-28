import axios from "axios";
import { getCurrentUser } from "./authService";

const BASE = import.meta.env.VITE_API_URL;
const REST_API_BASE_URL = `${BASE}/api/like`;

const getToken = () => {
    const user = getCurrentUser();
    return user ? user : null;
};

export const checkIfLiked = async (userId, postId) => {
    const authToken = getToken();


    if (!authToken) {
        return false;
    }


    try {
        const response = await axios.post(
            `${REST_API_BASE_URL}/likeStatus`,
            { userId, postId }, // Send email as part of the request body in an object
            {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Add the Bearer token in the Authorization header
                },
            }
        );



        if (response.status === 200) {
            return response;  // Return true to indicate successful like addition
        } else {
            throw new Error; // Return false if the like addition fails
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error; // Re-throw the error for further handling
    }
};
export const addLike = async (userId, postId) => {
    const authToken = getToken();


    if (!authToken) {
        return false;
    }
    

    try {
        const response = await axios.post(
            `${REST_API_BASE_URL}/addlike`,
            { userId, postId }, // Send email as part of the request body in an object
            {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Add the Bearer token in the Authorization header
                },
            }
        );

        if (response.status === 200) {
            return response;
        } else {
            throw new Error;
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error; // Re-throw the error for further handling
    }
};
export const removeLike = async (userId, postId) => {
    const authToken = getToken();


    if (!authToken) {
        return false;
    }

    try {
        const response = await axios.post(
            `${REST_API_BASE_URL}/removelike`,
            { userId, postId }, // Send email as part of the request body in an object
            {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Add the Bearer token in the Authorization header
                },
            }
        );

        if (response.status === 200) {
            return response;
        } else {
            throw new Error;
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error; // Re-throw the error for further handling
    }
};
export const LikeCommentCount = async (postId) => {
    const authToken = getToken();


    if (!authToken) {
        return false;
    }
    try {
        const response = await axios.post(
            `${REST_API_BASE_URL}/getCount`,
            { postId }, // Send email as part of the request body in an object
            {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Add the Bearer token in the Authorization header
                },
            }
        );
        
        
        if (response.status === 200) {
            return response;
        } else {
            throw new Error;
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error; // Re-throw the error for further handling
    }
};