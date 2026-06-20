import axios from "axios";

const API_URL = "http://localhost:5000/api/fees";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getFeeSummary = async (academicYear) => {
  const response = await axios.get(`${API_URL}/summary`, { ...getAuthConfig(), params: { academicYear } });
  // Unwrap standardized response
  return response.data?.data || response.data;
};

export const getFeeStructures = async (params = {}) => {
  const response = await axios.get(`${API_URL}/structures`, { ...getAuthConfig(), params });
  return response.data?.data || response.data;
};

export const createFeeStructure = async (data) => {
  const response = await axios.post(`${API_URL}/structures`, data, getAuthConfig());
  return response.data?.data || response.data;
};

export const updateFeeStructure = async (id, data) => {
  const response = await axios.put(`${API_URL}/structures/${id}`, data, getAuthConfig());
  return response.data?.data || response.data;
};

export const deleteFeeStructure = async (id) => {
  const response = await axios.delete(`${API_URL}/structures/${id}`, getAuthConfig());
  return response.data;
};

export const getFeePayments = async (params = {}) => {
  const response = await axios.get(`${API_URL}/payments`, { ...getAuthConfig(), params });
  return response.data?.data || response.data;
};

export const recordFeePayment = async (data) => {
  const response = await axios.post(`${API_URL}/payments`, data, getAuthConfig());
  return response.data?.data || response.data;
};

export const getStudentFeeStatus = async (studentId, academicYear) => {
  const response = await axios.get(`${API_URL}/student-status/${studentId}`, { ...getAuthConfig(), params: { academicYear } });
  return response.data?.data || response.data;
};

export const getFeeReceipt = async (paymentId) => {
  const response = await axios.get(`${API_URL}/receipts/${paymentId}`, getAuthConfig());
  return response.data?.data || response.data;
};
