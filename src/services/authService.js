import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const REST_API_BASE_URL = `${BASE}/auth/users`;

export const createUsers = async (user) => {
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/register`, user);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (user) => {
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/login`, user);

    if (response.status >= 200 && response.status < 300 && response.data.user) {
      const { userId, username, profilePicture, email } = response.data.user;

      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("profilePicture", profilePicture || "");
      localStorage.setItem("email", email);
    }

    return response.data.user;
  } catch (error) {
    return error.response?.data || { message: "Login failed" };
  }
};

export const logoutUser = async () => {
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

export const getCurrentUser = () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const profilePicture = localStorage.getItem("profilePicture");
  const email = localStorage.getItem("email");

  if (!userId) return null;

  return { userId, username, profilePicture, email };
};