import AcademicCalendar from "../models/AcademicCalendar.js";
import { createMasterCrudController } from "./masterCrudController.js";

const controller = createMasterCrudController({
  Model: AcademicCalendar,
  moduleName: "Academic Calendar Event",
  searchFields: [
    "eventTitle",
    "eventType",
    "description",
  ],
  validate: ({
    eventTitle,
    eventType,
    startDate,
    endDate,
  }) => {
    if (!eventTitle) return "Event Title is required";
    if (!eventType) return "Event Type is required";
    if (!startDate) return "Start Date is required";
    if (!endDate) return "End Date is required";
    if (new Date(startDate) >= new Date(endDate)) {
      return "Start Date must be before End Date";
    }
    return null;
  },
});

export const getAcademicCalendarEvents = controller.getAll;
export const createAcademicCalendarEvent = controller.create;
export const updateAcademicCalendarEvent = controller.update;
export const deleteAcademicCalendarEvent = controller.remove;
