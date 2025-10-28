import axios from 'axios';
import { getCurrentUser } from './authService';


const BASE = import.meta.env.VITE_API_URL;

const BASE_URL = `${BASE}/api/category`;

const getToken = () => {
    const user = getCurrentUser(); 
    return user ? user : null; 
};

export const  getCategories = async () => {

    const authToken = getToken();
    
    
    if (!authToken) {
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
    return response.data; 
  } catch (error) {
    console.error('Error fetching card details:', error);
    throw error; 
  }
};
