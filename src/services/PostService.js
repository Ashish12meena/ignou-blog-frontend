import axios from 'axios';
import { getCurrentUser } from './authService';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const BASE_URL = `${BASE}/api/posts`;

const getToken = () => {
  const user = getCurrentUser();
  return user ? user.userId : null;
};

export const getCardDetails = async ({ userId, excludedIds = [] }) => {
  const authToken = getToken();

  if (!authToken) {
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

    return response.data;
  } catch (error) {
    console.error('Error fetching card details:', error);
    throw error;
  }
};

export const getFullPostDetail = async ({ postId, userId }) => {
  const authToken = getToken();
  
  if (!authToken) {
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

    return response.data;
  } catch (error) {
    console.error('Error fetching post details:', error);
    throw error;
  }
};

export const addPost = async (formData) => {
  const authToken = getToken();
  
  if (!authToken) {
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

    return response;
  } catch (error) {
    console.error('Error adding post:', error);
    throw error;
  }
};

export const searchPost = async (formData) => {
  const authToken = getToken();
  
  if (!authToken) {
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

    return response;
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
};