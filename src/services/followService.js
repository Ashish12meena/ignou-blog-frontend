import React from 'react'
import axios from "axios";



import { getCurrentUser } from './authService';

const getToken = () => {
    const user = getCurrentUser(); // Get the current user from localStorage
    return user ? user : null; // If user exists, return the authToken, else null
};
const BASE_URL = import.meta.env.VITE_API_URL;


export const addFollower = async (loggedUserId, followedUserId) => {
    const authToken = getToken();
    

    if (!authToken) {
        return false;
    }
    try {
        const response = await axios.post(`${BASE_URL}/api/follow/add`,
        {
            loggedUserId,
            followedUserId,
        },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json", // Explicitly set Content-Type
                },
            }
        );
        
    } catch (error) {
        console.error("Error saving token:", error.response?.data || error.message);
    }
}

export const removeFollower = async (loggedUserId, followedUserId) => {
    const authToken = getToken();
    if (!authToken) {
        return false;
    }
    try {
        const response = await axios.post(`${BASE_URL}/api/follow/remove`,
        {
            loggedUserId,
            followedUserId,
        },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json", // Explicitly set Content-Type
                },
            }
        );        

        
    } catch (error) {
        console.error("Error saving token:", error.response?.data || error.message);
    }
}

export const getFollowStatus = async (Follower, userId) => {
    const authToken = getToken();
    

    if (!authToken) {
        return false;
    }
    try {
        const response = await axios.post(`${BASE_URL}/api/follow/remove`,
        {
            loggedUserId,
            followedUserId,
        },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json", // Explicitly set Content-Type
                },
            }
        );

        
    } catch (error) {
        console.error("Error saving token:", error.response?.data || error.message);
    }
}