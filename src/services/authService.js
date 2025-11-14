import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const REST_API_BASE_URL = `${BASE}/auth/users`;

// Logger utility
const logger = {
  info: (message, data) => console.log(`[AUTH INFO] ${message}`, data || ''),
  error: (message, error) => console.error(`[AUTH ERROR] ${message}`, error),
  success: (message, data) => console.log(`[AUTH SUCCESS] ${message}`, data || '')
};

export const createUsers = async (user) => {
  logger.info('Creating new user', { username: user.username });
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/register`, user);
    logger.success('User created successfully', { userId: response.data.userId });
    return response.data;
  } catch (error) {
    logger.error('Failed to create user', error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (user) => {
  logger.info('User login attempt', { username: user.username });
  try {
    const response = await axios.post(`${REST_API_BASE_URL}/login`, user);

    if (response.status >= 200 && response.status < 300 && response.data.user) {
      const { userId, username, profilePicture, email } = response.data.user;

      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("profilePicture", profilePicture || "");
      localStorage.setItem("email", email);

      logger.success('User logged in successfully', { userId, username });
    }

    return response.data.user;
  } catch (error) {
    logger.error('Login failed', error.response?.data || error.message);
    return error.response?.data || { message: "Login failed" };
  }
};

export const logoutUser = async () => {
  const userId = localStorage.getItem("userId");
  logger.info('User logout', { userId });

  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("profilePicture");
  localStorage.removeItem("email");

  try {
    const response = await axios.post(`${REST_API_BASE_URL}/logout`);
    logger.success('User logged out successfully');
    return response.data;
  } catch (error) {
    logger.error('Logout failed', error);
    return { message: "Logout failed" };
  }
};

export const getCurrentUser = () => {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const profilePicture = localStorage.getItem("profilePicture");
  const email = localStorage.getItem("email");

  if (!userId) {
    logger.info('No current user found');
    return null;
  }

  logger.info('Retrieved current user', { userId, username });
  return { userId, username, profilePicture, email };
};