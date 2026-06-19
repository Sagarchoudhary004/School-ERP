import axios from "axios";

const API_URL = "http://localhost:5000/api/teachers"; // Adjust this URL to match your backend port

const getAuthToken = () => localStorage.getItem("token");

const getAuthConfig = () => ({
  headers: { Authorization: `Bearer ${getAuthToken()}` },
});

export const getTeachers = async () => {
  try {
    const response = await axios.get(API_URL, getAuthConfig());
    // Unwrap standardized response: {success, data} → return data array
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const getTeacherById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthConfig());
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Error fetching teacher:", error);
    throw error;
  }
};

export const createTeacher = async (teacherData) => {
  try {
    const response = await axios.post(API_URL, teacherData, getAuthConfig());
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Error creating teacher:", error);
    throw error;
  }
};

export const updateTeacher = async (id, teacherData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, teacherData, getAuthConfig());
    return response.data?.data || response.data;
  } catch (error) {
    console.error("Error updating teacher:", error);
    throw error;
  }
};

export const deleteTeacher = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthConfig());
    return response.data;
  } catch (error) {
    console.error("Error deleting teacher:", error);
    throw error;
  }
};