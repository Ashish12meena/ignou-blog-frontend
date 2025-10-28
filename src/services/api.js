import axios from 'axios';

// Base URL for the API (change to your own API endpoint)
const BASE_URL = 'http://localhost:5000/api';

// Get the token from localStorage (or sessionStorage or cookies)
const getToken = () => localStorage.getItem('authToken');

// Create Operation (POST)
export const createData = async (data) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.post(`${BASE_URL}/posts`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating data:', error);
    throw error;
  }
};

// Read Operation (GET)
export const getData = async () => {
  const token = getToken();

  
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.get(`${BASE_URL}/posts`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// Update Operation (PUT)
export const updateData = async (id, updatedData) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.put(`${BASE_URL}/data/${id}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

// Delete Operation (DELETE)
export const deleteData = async (id) => {
  const token = getToken();
  if (!token) {
    throw new Error('No token found');
  }

  try {
    const response = await axios.delete(`${BASE_URL}/data/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};
