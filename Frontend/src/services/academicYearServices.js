import axios from "axios";

const API =
 "http://localhost:5000/api/academic-year";

export const getAcademicYears = () =>
 axios.get(API);

export const createAcademicYear = (data) =>
 axios.post(`${API}/create`, data);

export const updateAcademicYear = (
 id,
 data
) =>
 axios.put(`${API}/${id}`, data);

export const deleteAcademicYear = (id) =>
 axios.delete(`${API}/${id}`);