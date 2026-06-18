import axios from "axios";

const API_URL = "http://localhost:5000/api/teachers"; // Adjust this URL to match your backend port

const getAuthToken = () => localStorage.getItem("token");

export const getTeachers = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const createTeacher = async (teacherData) => {
  try {
    const response = await axios.post(API_URL, teacherData, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating teacher:", error);
    throw error;
  }
};