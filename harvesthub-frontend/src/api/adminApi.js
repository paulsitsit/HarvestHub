import axiosInstance from './axiosInstance.js';

export const getAdminDashboard = async () => {
  const response = await axiosInstance.get(
    '/admin/dashboard'
  );

  return response.data;
};

export const getAdminFarmers = async (params = {}) => {
  const response = await axiosInstance.get(
    '/admin/farmers',
    {
      params
    }
  );

  return response.data;
};

export const getAdminFarmerById = async (id) => {
  const response = await axiosInstance.get(
    `/admin/farmers/${id}`
  );

  return response.data;
};

export const approveFarmer = async (id) => {
  const response = await axiosInstance.patch(
    `/admin/farmers/${id}/approve`
  );

  return response.data;
};

export const rejectFarmer = async (
  id,
  rejectionReason
) => {
  const response = await axiosInstance.patch(
    `/admin/farmers/${id}/reject`,
    {
      rejectionReason
    }
  );

  return response.data;
};

export const suspendFarmer = async (id, reason = '') => {
  const response = await axiosInstance.patch(
    `/admin/farmers/${id}/suspend`,
    {
      reason
    }
  );

  return response.data;
};

export const reactivateFarmer = async (id) => {
  const response = await axiosInstance.patch(
    `/admin/farmers/${id}/reactivate`
  );

  return response.data;
};

export const flagFarmerFraud = async (
  id,
  flagged,
  note = ''
) => {
  const response = await axiosInstance.patch(
    `/admin/farmers/${id}/flag-fraud`,
    {
      flagged,
      note
    }
  );

  return response.data;
};

export const getAdminProducts = async (params = {}) => {
  const response = await axiosInstance.get(
    '/admin/products',
    {
      params
    }
  );

  return response.data;
};

export const getAdminProductById = async (id) => {
  const response = await axiosInstance.get(
    `/admin/products/${id}`
  );

  return response.data;
};

export const approveProduct = async (id) => {
  const response = await axiosInstance.patch(
    `/admin/products/${id}/approve`
  );

  return response.data;
};

export const rejectProduct = async (
  id,
  rejectionReason
) => {
  const response = await axiosInstance.patch(
    `/admin/products/${id}/reject`,
    {
      rejectionReason
    }
  );

  return response.data;
};

export const expireProduct = async (id) => {
  const response = await axiosInstance.patch(
    `/admin/products/${id}/expire`
  );

  return response.data;
};

export const removeProduct = async (id) => {
  const response = await axiosInstance.delete(
    `/admin/products/${id}`
  );

  return response.data;
};

export const getAdminPayments = async (params = {}) => {
  const response = await axiosInstance.get(
    '/admin/payments',
    {
      params
    }
  );

  return response.data;
};

export const getAdminPaymentById = async (id) => {
  const response = await axiosInstance.get(
    `/admin/payments/${id}`
  );

  return response.data;
};

export const verifyAdminPayment = async (id) => {
  const response = await axiosInstance.patch(
    `/admin/payments/${id}/verify`
  );

  return response.data;
};

export const rejectAdminPayment = async (
  id,
  rejectionReason
) => {
  const response = await axiosInstance.patch(
    `/admin/payments/${id}/reject`,
    {
      rejectionReason
    }
  );

  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const response = await axiosInstance.get(
    '/admin/users',
    {
      params
    }
  );

  return response.data;
};

export const updateUserStatus = async (
  id,
  isActive
) => {
  const response = await axiosInstance.patch(
    `/admin/users/${id}/status`,
    {
      isActive
    }
  );

  return response.data;
};

export const resetUserPassword = async (
  id,
  newPassword
) => {
  const response = await axiosInstance.patch(
    `/admin/users/${id}/reset-password`,
    {
      newPassword
    }
  );

  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(
    `/admin/users/${id}`
  );

  return response.data;
};

export const getAdminReviews = async (params = {}) => {
  const response = await axiosInstance.get(
    '/admin/reviews',
    {
      params
    }
  );

  return response.data;
};

export const getAdminReviewStats = async () => {
  const response = await axiosInstance.get(
    '/admin/reviews/stats'
  );

  return response.data;
};

export const hideReview = async (id) => {
  const response = await axiosInstance.patch(
    `/admin/reviews/${id}/hide`
  );

  return response.data;
};

export const flagReview = async (id, reason = '') => {
  const response = await axiosInstance.patch(
    `/admin/reviews/${id}/flag`,
    {
      reason
    }
  );

  return response.data;
};

export const restoreReview = async (id) => {
  const response = await axiosInstance.patch(
    `/admin/reviews/${id}/restore`
  );

  return response.data;
};

export const deleteReview = async (id) => {
  const response = await axiosInstance.delete(
    `/admin/reviews/${id}`
  );

  return response.data;
};