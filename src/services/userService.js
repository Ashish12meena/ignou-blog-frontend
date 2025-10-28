import axios from "axios";
import { getCurrentUser } from "./authService";


const BASE = import.meta.env.VITE_API_URL;

const REST_API_BASE_URL =`${BASE}/api/users`;

const getToken = () => {
    const user = getCurrentUser();
    return user ? user : null;
};

export const getUserByEmail = async (email,userId) => {
    const authToken = getToken();
    
    

    if (!authToken) {
        return false;
    }
    try {
        const response = await axios.post(
            `${REST_API_BASE_URL}/userdetails`, 
            { email ,userId}, // Send email as part of the request body in an object
            {
                headers: {
                    Authorization: `Bearer ${authToken}`, // Add the Bearer token in the Authorization header
                },
            }
        );
        

        return response.data; // Return the data part of the response
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error; // Re-throw the error for further handling
    }
};


