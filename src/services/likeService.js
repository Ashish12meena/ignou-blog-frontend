import axios from "axios";
import { getCurrentUser } from "./authService";

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const REST_API_BASE_URL = `${BASE}/api/like`;

const getToken = () => {
  const user = getCurrentUser();
  return user ? user.userId : null;
};

export const checkIfLiked = async (userId, postId) => {
  const authToken = getToken();

  if (!authToken) {
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
      return response;
    } else {
      throw new Error('Failed to check like status');
    }
  } catch (error) {
    console.error('Error checking like status:', error);
    throw error;
  }
};

export const addLike = async (userId, postId) => {
  const authToken = getToken();

  if (!authToken) {
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
      return response;
    } else {
      throw new Error('Failed to add like');
    }
  } catch (error) {
    console.error('Error adding like:', error);
    throw error;
  }
};

export const removeLike = async (userId, postId) => {
  const authToken = getToken();

  if (!authToken) {
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
      return response;
    } else {
      throw new Error('Failed to remove like');
    }
  } catch (error) {
    console.error('Error removing like:', error);
    throw error;
  }
};

export const LikeCommentCount = async (postId) => {
  const authToken = getToken();

  if (!authToken) {
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
      return response;
    } else {
      throw new Error('Failed to get count');
    }
  } catch (error) {
    console.error('Error getting like/comment count:', error);
    throw error;
  }
};