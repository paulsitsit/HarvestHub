import axiosInstance from './axiosInstance.js';

const unwrapResponse = (response) => {
  return response.data?.data || response.data;
};

export const registerFarmer = async (payload) => {
  const response = await axiosInstance.post(
    '/auth/register',
    payload
  );

  return unwrapResponse(response);
};

export const login = async (payload) => {
  const response = await axiosInstance.post(
    '/auth/login',
    payload
  );

  return unwrapResponse(response);
};

export const getMe = async () => {
  const response = await axiosInstance.get('/auth/me');

  return unwrapResponse(response);
};

export const changePassword = async (payload) => {
  const response = await axiosInstance.put(
    '/auth/change-password',
    payload
  );

  return unwrapResponse(response);
};