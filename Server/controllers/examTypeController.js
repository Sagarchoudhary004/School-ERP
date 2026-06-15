import ExamType from "../models/ExamType.js";
import { createMasterCrudController } from "./masterCrudController.js";

const controller = createMasterCrudController({
  Model: ExamType,
  moduleName: "Exam Type",
  searchFields: ["examName", "examCode", "description"],
  duplicateChecks: [
    { field: "examName", label: "Exam Name" },
    { field: "examCode", label: "Exam Code" },
  ],
  validate: ({ examName, examCode, weightage }) => {
    if (!examName) return "Exam Name is required";
    if (!examCode) return "Exam Code is required";
    if (weightage === "" || weightage === undefined || weightage === null) {
      return "Weightage is required";
    }
    if (Number.isNaN(Number(weightage))) {
      return "Weightage must be numeric only";
    }
    if (Number(weightage) < 0 || Number(weightage) > 100) {
      return "Weightage must be between 0 and 100";
    }
    return null;
  },
});

export const getExamTypes = controller.getAll;
export const createExamType = controller.create;
export const updateExamType = controller.update;
export const deleteExamType = controller.remove;
