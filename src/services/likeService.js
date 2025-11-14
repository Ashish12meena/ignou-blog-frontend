import axios from "axios";
import { getAuthHeader } from "./authService";

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const REST_API_BASE_URL = `${BASE}/api/like`;

axios.defaults.withCredentials = true;

// Logger utility
const logger = {
  info: (message, data) => console.log(`[LIKE INFO] ${message}`, data || ''),
  error: (message, error) => console.error(`[LIKE ERROR] ${message}`, error),
  success: (message, data) => console.log(`[LIKE SUCCESS] ${message}`, data || '')
};

const getHeaders = () => ({
  'Authorization': getAuthHeader(),
  'Content-Type': 'application/json'
});

export const checkIfLiked = async (userId, postId) => {
  logger.info('Checking like status', { userId, postId });
  
  if (!userId || !postId) {
    logger.error('Missing parameters');
    throw new Error('User ID and Post ID are required');
  }

  try {
    const response = await axios.post(
      `${REST_API_BASE_URL}/likeStatus`,
      { userId, postId },
      {
        headers: getHeaders(),
        withCredentials: true
      }
    );

    logger.success('Like status checked', { liked: response.data });
    return response;
  } catch (error) {
    logger.error('Failed to check like status', error.response?.data || error.message);
    throw error;
  }
};

export const addLike = async (userId, postId) => {
  logger.info('Adding like', { userId, postId });
  
  if (!userId || !postId) {
    logger.error('Missing parameters');
    throw new Error('User ID and Post ID are required');
  }

  try {
    const response = await axios.post(
      `${REST_API_BASE_URL}/addlike`,
      { userId, postId },
      {
        headers: getHeaders(),
        withCredentials: true
      }
    );

    logger.success('Like added successfully', { postId });
    return response;
  } catch (error) {
    logger.error('Failed to add like', error.response?.data || error.message);
    throw error;
  }
};

export const removeLike = async (userId, postId) => {
  logger.info('Removing like', { userId, postId });
  
  if (!userId || !postId) {
    logger.error('Missing parameters');
    throw new Error('User ID and Post ID are required');
  }

  try {
    const response = await axios.post(
      `${REST_API_BASE_URL}/removelike`,
      { userId, postId },
      {
        headers: getHeaders(),
        withCredentials: true
      }
    );

    logger.success('Like removed successfully', { postId });
    return response;
  } catch (error) {
    logger.error('Failed to remove like', error.response?.data || error.message);
    throw error;
  }
};

export const LikeCommentCount = async (postId) => {
  logger.info('Fetching like/comment count', { postId });
  
  if (!postId) {
    logger.error('Missing postId');
    throw new Error('Post ID is required');
  }

  try {
    const response = await axios.post(
      `${REST_API_BASE_URL}/getCount`,
      { postId },
      {
        headers: getHeaders(),
        withCredentials: true
      }
    );

    logger.success('Count fetched successfully', response.data);
    return response;
  } catch (error) {
    logger.error('Failed to get like/comment count', error.response?.data || error.message);
    throw error;
  }
};