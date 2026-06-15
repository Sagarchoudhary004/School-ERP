import Category from "../models/Category.js";
import { createMasterCrudController } from "./masterCrudController.js";

const controller = createMasterCrudController({
  Model: Category,
  moduleName: "Category",
  searchFields: [
    "categoryName",
    "categoryCode",
    "description",
  ],
  duplicateChecks: [
    { field: "categoryName", label: "Category Name" },
    { field: "categoryCode", label: "Category Code" },
  ],
  validate: ({ categoryName, categoryCode }) => {
    if (!categoryName) return "Category Name is required";
    if (!categoryCode) return "Category Code is required";
    return null;
  },
});

export const getCategories = controller.getAll;
export const createCategory = controller.create;
export const updateCategory = controller.update;
export const deleteCategory = controller.remove;
