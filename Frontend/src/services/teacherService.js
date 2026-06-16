import axios from "axios";

const API_URL = "http://localhost:5000/api/teachers"; // Adjust this URL to match your backend port

export const getTeachers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
};

export const createTeacher = async (teacherData) => {
  try {
    const response = await axios.post(API_URL, teacherData);
    return response.data;
  } catch (error) {
    console.error("Error creating teacher:", error);
    throw error;
  }
};