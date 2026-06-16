import express from "express";

import upload from "../middlewares/upload.js";

import {
 uploadDocuments,
}
from "../controllers/studentDocumentController.js";

const router = express.Router();

router.post(
 "/",
 upload.fields([
   { name: "studentPhoto" },
   { name: "aadhaarCard" },
   { name: "birthCertificate" },
   { name: "transferCertificate" },
   { name: "reportCard" },
   { name: "otherDocuments" },
 ]),
 uploadDocuments
);

export default router;