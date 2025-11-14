import axios from 'axios';
import { getCurrentUser, getAuthHeader } from './authService';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${BASE}/api/posts`;

// Configure axios
axios.defaults.withCredentials = true;

// Logger utility
const logger = {
  info: (message, data) => console.log(`[POST INFO] ${message}`, data || ''),
  error: (message, error) => console.error(`[POST ERROR] ${message}`, error),
  success: (message, data) => console.log(`[POST SUCCESS] ${message}`, data || '')
};

// Get auth headers
const getHeaders = (isMultipart = false) => {
  const authHeader = getAuthHeader();
  const headers = {
    'Authorization': authHeader
  };
  
  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

export const getCardDetails = async ({ userId, excludedIds = [] }) => {
  logger.info('Fetching card details', { userId, excludedCount: excludedIds.length });
  
  if (!userId) {
    logger.error('No userId provided');
    throw new Error('User ID is required');
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/cardDetails`,
      { userId, excludedIds },
      {
        headers: getHeaders(),
        withCredentials: true
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
  
  if (!userId || !postId) {
    logger.error('Missing required parameters');
    throw new Error('Post ID and User ID are required');
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/fullPostDetails`,
      { postId, userId },
      {
        headers: getHeaders(),
        withCredentials: true
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
  
  // Verify userId is in formData
  const userId = formData.get('userId');
  if (!userId) {
    logger.error('No userId in formData');
    throw new Error('User ID is required to create a post');
  }
  
  logger.info('Post data', { 
    userId, 
    title: formData.get('title'),
    hasImage: !!formData.get('postImage')
  });

  try {
    const authHeader = getAuthHeader();
    
    const response = await axios.post(
      `${BASE_URL}/addPost`,
      formData,
      {
        headers: {
          'Authorization': authHeader,
          // Don't set Content-Type for multipart/form-data
          // Let browser set it with boundary
        },
        withCredentials: true
      }
    );

    logger.success('Post added successfully', { 
      status: response.status,
      data: response.data 
    });
    return response;
  } catch (error) {
    logger.error('Failed to add post', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export const searchPost = async (formData) => {
  logger.info('Searching posts', formData);
  
  try {
    const response = await axios.post(
      `${BASE_URL}/search`,
      formData,
      {
        headers: getHeaders(),
        withCredentials: true
      }
    );

    logger.success('Posts searched successfully', { count: response.data?.length });
    return response;
  } catch (error) {
    logger.error('Failed to search posts', error.response?.data || error.message);
    throw error;
  }
};