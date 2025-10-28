import axios from 'axios';
import { getCurrentUser } from './authService';

// Base URL for the API
const BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${BASE}/api/posts`;

const getToken = () => {
    const user = getCurrentUser(); 
    return user ? user : null; 
};

// Function to fetch card details with Bearer token
export const  getCardDetails = async ({userId, excludedIds = []}) => {

    const authToken = getToken();
    
    
    if (!authToken) {
        return false;
    }
  try {
    const response = await axios.post(
      `${BASE_URL}/cardDetails`,
      {userId,excludedIds},
      {
        headers: {
          Authorization: `Bearer ${authToken}`, // Add the Bearer token in the Authorization header
        },
      }
    );

    
    
    return response.data; // Return the data part of the response
  } catch (error) {
    console.error('Error fetching card details:', error);
    throw error; // Re-throw the error for further handling
  }
};
export const  getFullPostDetail = async ({postId,userId}) => {

    const authToken = getToken();
    if (!authToken) {
        return false;
    }
    
    
  try {
    const response = await axios.post(
      `${BASE_URL}/fullPostDetails`,
      {postId,userId},
      {
        headers: {
          Authorization: `Bearer ${authToken}`, // Add the Bearer token in the Authorization header
        },
      }
    );
    
    
    return response.data; // Return the data part of the response
  } catch (error) {
    console.error('Error fetching card details:', error);
    throw error; // Re-throw the error for further handling
  }
};
export const  addPost = async (formData) => {
  
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
          Authorization: `Bearer ${authToken}`, // Add the Bearer token in the Authorization header
        },
      }
    );
    
    return response; // Return the data part of the response
  } catch (error) {
    console.error('Error fetching card details:', error);
    throw error; // Re-throw the error for further handling
  }
};
export const  searchPost = async (formData) => {
  
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
          Authorization: `Bearer ${authToken}`, // Add the Bearer token in the Authorization header
        },
      }
    );
    
    return response; 
  } catch (error) {
    console.error('Error fetching card details:', error);
    throw error; // Re-throw the error for further handling
  }
};
