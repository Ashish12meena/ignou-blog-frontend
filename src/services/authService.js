import axios from "axios";

const BASE = import.meta.env.VITE_API_URL;
const REST_API_BASE_URL = `${BASE}/auth/users`;

// Register user
export const createUsers = async (user) => {
    try {
        const response = await axios.post(`${REST_API_BASE_URL}/register`, user);
        // Registration does not return user info, so nothing to store
        return response.data;
    } catch (error) {
        throw error;    
    }
};

// Login user
export const loginUser = async (user) => {
    try {
        const response = await axios.post(`${REST_API_BASE_URL}/login`, user);

        if (response.status >= 200 && response.status < 300 && response.data.user) {
            const { userId, username, profilePicture, email } = response.data.user;

            // Store each field separately in localStorage
            localStorage.setItem("userId", userId);
            localStorage.setItem("username", username);
            localStorage.setItem("profilePicture", profilePicture || "");
            localStorage.setItem("email", email);
        }

        return response.data;
    } catch (error) {
        return error.response?.data || { message: "Login failed" };
    }
};

// Logout user
export const logoutUser = async () => {
    // Remove all user-related data
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("profilePicture");
    localStorage.removeItem("email");

    try {
        const response = await axios.post(`${REST_API_BASE_URL}/logout`);
        return response.data;
    } catch (error) {
        return { message: "Logout failed" };
    }
};

// Get current logged-in user
export const getCurrentUser = () => {
    const userId = localStorage.getItem("userId");
    const username = localStorage.getItem("username");
    const profilePicture = localStorage.getItem("profilePicture");
    const email = localStorage.getItem("email");

    if (!userId) return null;

    return { userId, username, profilePicture, email };
};
