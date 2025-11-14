import axios from 'axios';
import { getAuthHeader } from './authService';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${BASE}/api/category`;

axios.defaults.withCredentials = true;

// Logger utility
const logger = {
  info: (message, data) => console.log(`[CATEGORY INFO] ${message}`, data || ''),
  error: (message, error) => console.error(`[CATEGORY ERROR] ${message}`, error),
  success: (message, data) => console.log(`[CATEGORY SUCCESS] ${message}`, data || '')
};

const getHeaders = () => ({
  'Authorization': getAuthHeader(),
  'Content-Type': 'application/json'
});

export const getCategories = async () => {
  logger.info('Fetching categories');

  try {
    const response = await axios.post(
      `${BASE_URL}/list`,
      {},
      {
        headers: getHeaders(),
        withCredentials: true
      }
    );

    logger.success('Categories fetched successfully', { count: response.data?.length });
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch categories', error.response?.data || error.message);
    throw error;
  }
};