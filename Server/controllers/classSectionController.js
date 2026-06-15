import ClassSection from "../models/ClassSection.js";
import { createMasterCrudController } from "./masterCrudController.js";

const controller = createMasterCrudController({
  Model: ClassSection,
  moduleName: "Class & Section",
  searchFields: [
    "className",
    "classCode",
    "sectionName",
    "classTeacher",
    "description",
  ],
  duplicateChecks: [
    { field: "classCode", label: "Class Code" },
  ],
  buildDuplicateQuery: ({ className, sectionName }) => ({
    className,
    sectionName,
    isActive: true,
  }),
  validate: ({
    className,
    classCode,
    sectionName,
    sectionCapacity,
  }) => {
    if (!className) return "Class Name is required";
    if (!classCode) return "Class Code is required";
    if (!sectionName) return "Section Name is required";
    if (!sectionCapacity) return "Section Capacity is required";
    if (Number.isNaN(Number(sectionCapacity))) {
      return "Section Capacity must be numeric only";
    }
    if (Number(sectionCapacity) <= 0) {
      return "Section Capacity must be greater than 0";
    }
    return null;
  },
});

export const getClassSections = controller.getAll;
export const createClassSection = controller.create;
export const updateClassSection = controller.update;
export const deleteClassSection = controller.remove;
