import axios from "axios";

const API_URL = "http://localhost:5000/api/school-profile";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getSchoolProfile = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data;
};

export const saveSchoolProfile = async (data) => {
  const response = await axios.post(API_URL, data, getAuthConfig());
  return response.data;
};
