import Designation from "../models/Designation.js";
import { createMasterCrudController } from "./masterCrudController.js";

const controller = createMasterCrudController({
  Model: Designation,
  moduleName: "Designation",
  searchFields: [
    "designationName",
    "designationCode",
    "department",
    "description",
  ],
  duplicateChecks: [
    { field: "designationName", label: "Designation Name" },
    { field: "designationCode", label: "Designation Code" },
  ],
  validate: ({
    designationName,
    designationCode,
    department,
  }) => {
    if (!designationName) return "Designation Name is required";
    if (!designationCode) return "Designation Code is required";
    if (!department) return "Department is required";
    return null;
  },
});

export const getDesignations = controller.getAll;
export const createDesignation = controller.create;
export const updateDesignation = controller.update;
export const deleteDesignation = controller.remove;
