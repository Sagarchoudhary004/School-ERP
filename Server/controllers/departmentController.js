import Department from "../models/Department.js";
import { createMasterCrudController } from "./masterCrudController.js";

const controller = createMasterCrudController({
  Model: Department,
  moduleName: "Department",
  searchFields: [
    "departmentName",
    "departmentCode",
    "hodName",
    "description",
  ],
  duplicateChecks: [
    { field: "departmentName", label: "Department Name" },
    { field: "departmentCode", label: "Department Code" },
  ],
  validate: ({ departmentName, departmentCode }) => {
    if (!departmentName) return "Department Name is required";
    if (!departmentCode) return "Department Code is required";
    return null;
  },
});

export const getDepartments = controller.getAll;
export const createDepartment = controller.create;
export const updateDepartment = controller.update;
export const deleteDepartment = controller.remove;
