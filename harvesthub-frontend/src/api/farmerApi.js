import axiosInstance from './axiosInstance.js';

export const getFarmerProfile = async () => {
  const response = await axiosInstance.get(
    '/farmer/profile'
  );

  return response.data;
};

export const updateFarmerProfile = async (payload) => {
  const response = await axiosInstance.put(
    '/farmer/profile',
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data;
};

export const getFarmerDashboard = async () => {
  const response = await axiosInstance.get(
    '/farmer/dashboard'
  );

  return response.data;
};

export const getFarmerProducts = async (params = {}) => {
  const response = await axiosInstance.get(
    '/farmer/products',
    {
      params
    }
  );

  return response.data;
};

export const createProduct = async (payload) => {
  const response = await axiosInstance.post(
    '/farmer/products',
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data;
};

export const updateProduct = async (id, payload) => {
  const response = await axiosInstance.put(
    `/farmer/products/${id}`,
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axiosInstance.delete(
    `/farmer/products/${id}`
  );

  return response.data;
};

export const updateProductAvailability = async (
  id,
  payload
) => {
  const response = await axiosInstance.patch(
    `/farmer/products/${id}/availability`,
    payload
  );

  return response.data;
};

export const getFarmerInquiries = async (params = {}) => {
  const response = await axiosInstance.get(
    '/farmer/inquiries',
    {
      params
    }
  );

  return response.data;
};

export const updateInquiryStatus = async (id, status) => {
  const response = await axiosInstance.patch(
    `/farmer/inquiries/${id}/status`,
    {
      status
    }
  );

  return response.data;
};

export const getFarmerReviews = async (params = {}) => {
  const response = await axiosInstance.get(
    '/farmer/reviews',
    {
      params
    }
  );

  return response.data;
};

export const getFarmerPayments = async (params = {}) => {
  const response = await axiosInstance.get(
    '/farmer/payments',
    {
      params
    }
  );

  return response.data;
};

export const submitPaymentProof = async (payload) => {
  const response = await axiosInstance.post(
    '/farmer/payments',
    payload,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );

  return response.data;
};