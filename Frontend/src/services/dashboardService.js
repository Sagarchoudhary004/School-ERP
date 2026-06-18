import axios from "axios";

const API_URL = "http://localhost:5000/api/dashboard";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/stats`, getAuthConfig());
  return response.data;
};
