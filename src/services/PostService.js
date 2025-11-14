import axios from 'axios';
import { getCurrentUser } from './authService';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${BASE}/api/posts`;

// Logger utility
const logger = {
  info: (message, data) => console.log(`[POST INFO] ${message}`, data || ''),
  error: (message, error) => console.error(`[POST ERROR] ${message}`, error),
  success: (message, data) => console.log(`[POST SUCCESS] ${message}`, data || '')
};

const getToken = () => {
  const user = getCurrentUser();
  return user ? user.userId : null;
};

export const getCardDetails = async ({ userId, excludedIds = [] }) => {
  logger.info('Fetching card details', { userId, excludedCount: excludedIds.length });
  
  const authToken = getToken();

  if (!authToken) {
    logger.error('No auth token found');
    return false;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/cardDetails`,
      { userId, excludedIds },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logger.success('Card details fetched successfully', { count: response.data.length });
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch card details', error.response?.data || error.message);
    throw error;
  }
};

export const getFullPostDetail = async ({ postId, userId }) => {
  logger.info('Fetching full post details', { postId, userId });
  
  const authToken = getToken();
  
  if (!authToken) {
    logger.error('No auth token found');
    return false;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/fullPostDetails`,
      { postId, userId },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logger.success('Full post details fetched successfully', { postId });
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch post details', error.response?.data || error.message);
    throw error;
  }
};

export const addPost = async (formData) => {
  logger.info('Adding new post');
  
  const authToken = getToken();
  
  if (!authToken) {
    logger.error('No auth token found');
    return false;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/addPost`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logger.success('Post added successfully', { postId: response.data?.postId });
    return response;
  } catch (error) {
    logger.error('Failed to add post', error.response?.data || error.message);
    throw error;
  }
};

export const searchPost = async (formData) => {
  logger.info('Searching posts', formData);
  
  const authToken = getToken();
  
  if (!authToken) {
    logger.error('No auth token found');
    return false;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/search`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logger.success('Posts searched successfully', { count: response.data?.length });
    return response;
  } catch (error) {
    logger.error('Failed to search posts', error.response?.data || error.message);
    throw error;
  }
};