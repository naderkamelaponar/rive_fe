import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const createUser = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/emails`, { email });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUser = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/emails/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updateUser = async (email, newEmail) => {
  try {
    const response = await axios.put(`${API_URL}/emails/${email}`, { newEmail });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (email) => {
  try {
    const response = await axios.delete(`${API_URL}/emails/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const resendVerificationEmail = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/emails/resend`, { email });
    return response.data;
  } catch (error) {
    console.error('Error resending verification email:', error);
    throw error;
  }
};
export const verifyEmail = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/verify`, { email });
    return response.data;
  } catch (error) {
    console.error('Error verifying email:', error);
    throw error;
  }
};