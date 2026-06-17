import axios from "axios";

const API = "http://localhost:5000/api";

const authConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getTimetables = () =>
  axios.get(`${API}/timetables`, authConfig());

export const getTimetable = (id) =>
  axios.get(`${API}/timetables/${id}`, authConfig());

export const createTimetable = (data) =>
  axios.post(`${API}/timetables`, data, authConfig());

export const updateTimetable = (id, data) =>
  axios.put(`${API}/timetables/${id}`, data, authConfig());

export const deleteTimetable = (id) =>
  axios.delete(`${API}/timetables/${id}`, authConfig());

export const getClasses = () =>
  axios.get(`${API}/class-sections`, authConfig());

export const getSections = () =>
  axios.get(`${API}/class-sections`, authConfig());

export const getSubjects = () =>
  axios.get(`${API}/subjects`, authConfig());

export const getTeachers = () =>
  axios.get(`${API}/teachers`, authConfig());
