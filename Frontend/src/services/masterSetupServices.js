import axios from "axios";

const API_BASE = "http://localhost:5000/api";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const createMasterService = (endpoint) => ({
  getAll: (params = {}) =>
    axios.get(`${API_BASE}/${endpoint}`, {
      ...getAuthConfig(),
      params,
    }),
  create: (data) =>
    axios.post(
      `${API_BASE}/${endpoint}/create`,
      data,
      getAuthConfig()
    ),
  update: (id, data) =>
    axios.put(
      `${API_BASE}/${endpoint}/${id}`,
      data,
      getAuthConfig()
    ),
  remove: (id) =>
    axios.delete(
      `${API_BASE}/${endpoint}/${id}`,
      getAuthConfig()
    ),
});

export const examTypeService = createMasterService("exam-types");
export const classSectionService = createMasterService("class-sections");
export const subjectService = createMasterService("subjects");
export const departmentService = createMasterService("departments");
export const designationService = createMasterService("designations");
export const categoryService = createMasterService("categories");
export const academicCalendarService = createMasterService("academic-calendar");
