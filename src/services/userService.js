import axios from "axios";
import { getAuthHeader } from "./authService";

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const REST_API_BASE_URL = `${BASE}/api/users`;

axios.defaults.withCredentials = true;

// Logger utility
const logger = {
  info: (message, data) => console.log(`[USER INFO] ${message}`, data || ''),
  error: (message, error) => console.error(`[USER ERROR] ${message}`, error),
  success: (message, data) => console.log(`[USER SUCCESS] ${message}`, data || '')
};

const getHeaders = () => ({
  'Authorization': getAuthHeader(),
  'Content-Type': 'application/json'
});

export const getUserByEmail = async (email, userId) => {
  logger.info('Fetching user by email', { email, userId });
  
  if (!email || !userId) {
    logger.error('Missing parameters');
    throw new Error('Email and User ID are required');
  }

  try {
    const response = await axios.post(
      `${REST_API_BASE_URL}/userdetails`,
      { email, userId },
      {
        headers: getHeaders(),
        withCredentials: true
      }
    );

    logger.success('User details fetched successfully', { email });
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user details', error.response?.data || error.message);
    throw error;
  }
};