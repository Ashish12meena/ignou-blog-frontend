import axios from "axios";
import { getAuthHeader } from './authService';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

axios.defaults.withCredentials = true;

// Logger utility
const logger = {
  info: (message, data) => console.log(`[FOLLOW INFO] ${message}`, data || ''),
  error: (message, error) => console.error(`[FOLLOW ERROR] ${message}`, error),
  success: (message, data) => console.log(`[FOLLOW SUCCESS] ${message}`, data || '')
};

const getHeaders = () => ({
  'Authorization': getAuthHeader(),
  'Content-Type': 'application/json'
});

export const addFollower = async (loggedUserId, followedUserId) => {
  logger.info('Adding follower', { loggedUserId, followedUserId });
  
  if (!loggedUserId || !followedUserId) {
    logger.error('Missing parameters');
    throw new Error('Both user IDs are required');
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/api/follow/add`,
      { loggedUserId, followedUserId },
      {
        headers: getHeaders(),
        withCredentials: true
      }
    );

    logger.success('Follower added successfully', { followedUserId });
    return response.data;
  } catch (error) {
    logger.error('Failed to add follower', error.response?.data || error.message);
    throw error;
  }
};

export const removeFollower = async (loggedUserId, followedUserId) => {
  logger.info('Removing follower', { loggedUserId, followedUserId });
  
  if (!loggedUserId || !followedUserId) {
    logger.error('Missing parameters');
    throw new Error('Both user IDs are required');
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/api/follow/remove`,
      { loggedUserId, followedUserId },
      {
        headers: getHeaders(),
        withCredentials: true
      }
    );

    logger.success('Follower removed successfully', { followedUserId });
    return response.data;
  } catch (error) {
    logger.error('Failed to remove follower', error.response?.data || error.message);
    throw error;
  }
};

export const getFollowStatus = async (loggedUserId, followedUserId) => {
  logger.info('Checking follow status', { loggedUserId, followedUserId });
  
  if (!loggedUserId || !followedUserId) {
    logger.error('Missing parameters');
    throw new Error('Both user IDs are required');
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/api/follow/status`,
      { loggedUserId, followedUserId },
      {
        headers: getHeaders(),
        withCredentials: true
      }
    );

    logger.success('Follow status retrieved', { isFollowing: response.data });
    return response.data;
  } catch (error) {
    logger.error('Failed to get follow status', error.response?.data || error.message);
    throw error;
  }
};