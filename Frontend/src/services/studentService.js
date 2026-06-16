import axios from "axios";

const API_URL = "http://localhost:5000/api/students";

export const createStudent = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getStudents = async () => {
  const response = await axios.get(`${API_URL}?limit=20`);
  return response.data;
};
