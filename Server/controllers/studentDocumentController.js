import StudentDocuments from "../models/StudentDocuments.js";

export const uploadDocuments = async (req, res) => {
  try {
    const document = await StudentDocuments.create({
      studentPhoto: req.files.studentPhoto?.[0]?.path || "",
      aadhaarCard: req.files.aadhaarCard?.[0]?.path || "",
      birthCertificate: req.files.birthCertificate?.[0]?.path || "",
      transferCertificate: req.files.transferCertificate?.[0]?.path || "",
      reportCard: req.files.reportCard?.[0]?.path || "",
      otherDocuments: req.files.otherDocuments?.map((file) => file.path) || [],
      declaration: req.body.declaration === "true" || req.body.declaration === true,
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
