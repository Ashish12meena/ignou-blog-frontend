import axios from "axios";
import { getCurrentUser } from "./authService";

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const REST_API_BASE_URL = `${BASE}/api/users`;

// Logger utility
const logger = {
  info: (message, data) => console.log(`[USER INFO] ${message}`, data || ''),
  error: (message, error) => console.error(`[USER ERROR] ${message}`, error),
  success: (message, data) => console.log(`[USER SUCCESS] ${message}`, data || '')
};

const getToken = () => {
  const user = getCurrentUser();
  return user ? user : null;
};

export const getUserByEmail = async (email, userId) => {
  logger.info('Fetching user by email', { email, userId });
  
  const authToken = getToken();

  if (!authToken) {
    logger.error('No auth token found');
    return false;
  }

  try {
    const response = await axios.post(
      `${REST_API_BASE_URL}/userdetails`,
      { email, userId },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logger.success('User details fetched successfully', { email });
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user details', error.response?.data || error.message);
    throw error;
  }
};