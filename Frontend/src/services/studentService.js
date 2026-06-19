import axios from "axios";

const API_URL = "http://localhost:5000/api/students";

const getAuthToken = () => localStorage.getItem("token");

const getAuthConfig = () => ({
  headers: { Authorization: `Bearer ${getAuthToken()}` },
});

export const createStudent = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  // Unwrap standardized response
  return response.data?.data || response.data;
};

export const getStudents = async () => {
  const response = await axios.get(`${API_URL}?limit=20`, getAuthConfig());
  // Unwrap standardized response: {success, data} → return data array
  return response.data?.data || response.data;
};

export const getStudentById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
  return response.data?.data || response.data;
};

export const updateStudent = async (id, studentData) => {
  const response = await axios.put(`${API_URL}/${id}`, studentData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });
  return response.data?.data || response.data;
};

export const deleteStudent = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
  return response.data;
};
