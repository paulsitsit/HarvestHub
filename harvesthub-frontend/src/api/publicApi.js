import axiosInstance from './axiosInstance.js';

export const getCategories = async () => {
  const response = await axiosInstance.get(
    '/public/categories'
  );

  return response.data;
};

export const getPublicProducts = async (params = {}) => {
  const response = await axiosInstance.get(
    '/public/products',
    {
      params
    }
  );

  return response.data;
};

export const getPublicProductById = async (id) => {
  const response = await axiosInstance.get(
    `/public/products/${id}`
  );

  return response.data;
};

export const getPublicFarmerById = async (id) => {
  const response = await axiosInstance.get(
    `/public/farmers/${id}`
  );

  return response.data;
};

export const getFarmerReviews = async (id) => {
  const response = await axiosInstance.get(
    `/public/farmers/${id}/reviews`
  );

  return response.data;
};

export const getFeatured = async () => {
  const response = await axiosInstance.get(
    '/public/featured'
  );

  return response.data;
};

export const createInquiry = async (payload) => {
  const response = await axiosInstance.post(
    '/public/inquiries',
    payload
  );

  return response.data;
};

export const createReview = async (payload) => {
  const response = await axiosInstance.post(
    '/public/reviews',
    payload
  );

  return response.data;
};