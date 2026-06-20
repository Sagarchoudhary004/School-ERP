import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import Attendance from "./models/Attendance.js";
import FeeStructure from "./models/FeeStructure.js";
import studentRoutes from "./routes/studentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import academicYearRoutes from "./routes/academicYearRoutes.js";
import examTypeRoutes from "./routes/examTypeRoutes.js";
import classSectionRoutes from "./routes/classSectionRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import designationRoutes from "./routes/designationRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import academicCalendarRoutes from "./routes/academicCalendarRoutes.js";
import guardianRoutes from "./routes/guardianRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import timetableRoutes from "./routes/timetableRoutes.js";
import schoolProfileRoutes from "./routes/schoolProfileRoutes.js";
import markRoutes from "./routes/markRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import feeRoutes from "./routes/feeRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

const startServer = async () => {
  await connectDB();

  // Sync indexes to fix stale/conflicting indexes in MongoDB
  try {
    await Attendance.syncIndexes();
    console.log("Attendance indexes synced");
  } catch (err) {
    console.error("Failed to sync Attendance indexes:", err.message);
  }
  try {
    await FeeStructure.syncIndexes();
    console.log("FeeStructure indexes synced");
  } catch (err) {
    console.error("Failed to sync FeeStructure indexes:", err.message);
  }

  const app = express();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.use(
    cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials: true,
    })
  );

  app.use(express.json());
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  app.use("/api/school-profile", schoolProfileRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/academic-year", academicYearRoutes);
  app.use("/api/exam-types", examTypeRoutes);
  app.use("/api/class-sections", classSectionRoutes);
  app.use("/api/subjects", subjectRoutes);
  app.use("/api/departments", departmentRoutes);
  app.use("/api/designations", designationRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/academic-calendar", academicCalendarRoutes);
  app.use("/api/guardians", guardianRoutes);
  app.use("/api/students", studentRoutes);
  app.use("/api/teachers", teacherRoutes);
  app.use("/api/timetables", timetableRoutes);
  app.use("/api/marks", markRoutes);
  app.use("/api/attendance", attendanceRoutes);
  app.use("/api/fees", feeRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  app.get("/", (req, res) => {
    res.send("School CRM Backend Running");
  });

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Internal server error",
    });
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
