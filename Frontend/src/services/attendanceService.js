import axios from "axios";

const API_URL = "http://localhost:5000/api/attendance";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const saveAttendance = async (data) => {
  const response = await axios.post(API_URL, data, getAuthConfig());
  return response.data;
};

export const getAttendance = async (date, userType, classSection = null) => {
  let url = `${API_URL}?date=${date}&userType=${userType}`;
  if (classSection) {
    url += `&classSection=${classSection}`;
  }
  const response = await axios.get(url, getAuthConfig());
  return response.data;
};
