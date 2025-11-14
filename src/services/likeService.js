import axios from "axios";
import { getCurrentUser } from "./authService";

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const REST_API_BASE_URL = `${BASE}/api/like`;

// Logger utility
const logger = {
  info: (message, data) => console.log(`[LIKE INFO] ${message}`, data || ''),
  error: (message, error) => console.error(`[LIKE ERROR] ${message}`, error),
  success: (message, data) => console.log(`[LIKE SUCCESS] ${message}`, data || '')
};

const getToken = () => {
  const user = getCurrentUser();
  return user ? user.userId : null;
};

export const checkIfLiked = async (userId, postId) => {
  logger.info('Checking like status', { userId, postId });
  
  const authToken = getToken();

  if (!authToken) {
    logger.error('No auth token found');
    return false;
  }

  try {
    const response = await axios.post(
      `${REST_API_BASE_URL}/likeStatus`,
      { userId, postId },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      logger.success('Like status checked', { liked: response.data });
      return response;
    } else {
      throw new Error('Failed to check like status');
    }
  } catch (error) {
    logger.error('Failed to check like status', error.response?.data || error.message);
    throw error;
  }
};

export const addLike = async (userId, postId) => {
  logger.info('Adding like', { userId, postId });
  
  const authToken = getToken();

  if (!authToken) {
    logger.error('No auth token found');
    return false;
  }

  try {
    const response = await axios.post(
      `${REST_API_BASE_URL}/addlike`,
      { userId, postId },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      logger.success('Like added successfully', { postId });
      return response;
    } else {
      throw new Error('Failed to add like');
    }
  } catch (error) {
    logger.error('Failed to add like', error.response?.data || error.message);
    throw error;
  }
};

export const removeLike = async (userId, postId) => {
  logger.info('Removing like', { userId, postId });
  
  const authToken = getToken();

  if (!authToken) {
    logger.error('No auth token found');
    return false;
  }

  try {
    const response = await axios.post(
      `${REST_API_BASE_URL}/removelike`,
      { userId, postId },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      logger.success('Like removed successfully', { postId });
      return response;
    } else {
      throw new Error('Failed to remove like');
    }
  } catch (error) {
    logger.error('Failed to remove like', error.response?.data || error.message);
    throw error;
  }
};

export const LikeCommentCount = async (postId) => {
  logger.info('Fetching like/comment count', { postId });
  
  const authToken = getToken();

  if (!authToken) {
    logger.error('No auth token found');
    return false;
  }

  try {
    const response = await axios.post(
      `${REST_API_BASE_URL}/getCount`,
      { postId },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      logger.success('Count fetched successfully', response.data);
      return response;
    } else {
      throw new Error('Failed to get count');
    }
  } catch (error) {
    logger.error('Failed to get like/comment count', error.response?.data || error.message);
    throw error;
  }
};