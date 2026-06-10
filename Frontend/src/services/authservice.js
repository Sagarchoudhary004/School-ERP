import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const loginUser = async (loginData) => {
  const response = await axios.post(
    `${API_URL}/login`,
    loginData
  );

  return response.data;
};

export const registerUser = async (registerData) => {
  const response = await axios.post(
    `${API_URL}/register`,
    registerData
  );

  return response.data;
};