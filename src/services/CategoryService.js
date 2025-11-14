import axios from 'axios';
import { getCurrentUser } from './authService';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${BASE}/api/category`;

// Logger utility
const logger = {
  info: (message, data) => console.log(`[CATEGORY INFO] ${message}`, data || ''),
  error: (message, error) => console.error(`[CATEGORY ERROR] ${message}`, error),
  success: (message, data) => console.log(`[CATEGORY SUCCESS] ${message}`, data || '')
};

const getToken = () => {
  const user = getCurrentUser();
  return user ? user : null;
};

export const getCategories = async () => {
  logger.info('Fetching categories');
  
  const authToken = getToken();

  if (!authToken) {
    logger.error('No auth token found');
    return false;
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/list`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    logger.success('Categories fetched successfully', { count: response.data?.length });
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch categories', error.response?.data || error.message);
    throw error;
  }
};