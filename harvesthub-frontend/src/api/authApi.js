import axiosInstance from './axiosInstance.js';

export const registerFarmer = async (payload) => {
  const response = await axiosInstance.post(
    '/auth/register',
    payload
  );

  return response.data;
};

export const login = async (payload) => {
  const response = await axiosInstance.post(
    '/auth/login',
    payload
  );

  return response.data;
};

export const getMe = async () => {
  const response = await axiosInstance.get('/auth/me');

  return response.data;
};

export const changePassword = async (payload) => {
  const response = await axiosInstance.put(
    '/auth/change-password',
    payload
  );

  return response.data;
};