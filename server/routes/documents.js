const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect, adminOnly } = require("../middleware/auth");

// Create uploads directory if not exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowed = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".xlsx", ".xls"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("File type not allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// In-memory document store (in production use MongoDB)
let documents = [];

// @route POST /api/documents/upload
// @desc Upload document
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const doc = {
      id: Date.now().toString(),
      originalName: req.file.originalname,
      fileName: req.file.filename,
      fileSize: req.file.size,
      fileType: path.extname(req.file.originalname).toLowerCase(),
      documentType: req.body.documentType || "Other",
      leadId: req.body.leadId || null,
      uploadedBy: req.user._id,
      uploaderName: req.user.name,
      uploaderEmail: req.user.email,
      uploadedAt: new Date(),
      accessLog: [],
    };

    documents.push(doc);

    res.status(201).json({ message: "Document uploaded successfully", document: doc });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// @route GET /api/documents
// @desc Get all documents
router.get("/", protect, async (req, res) => {
  try {
    let docs = documents;
    // Employee only sees their own uploads
    if (req.user.role === "employee") {
      docs = documents.filter((d) => String(d.uploadedBy) === String(req.user._id));
    }
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route GET /api/documents/:id/view
// @desc View/download document (logged)
router.get("/:id/view", protect, async (req, res) => {
  try {
    const doc = documents.find((d) => d.id === req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Log access
    doc.accessLog.push({
      user: req.user._id,
      userName: req.user.name,
      action: "View",
      at: new Date(),
    });

    const filePath = path.join(uploadDir, doc.fileName);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found on server" });

    res.download(filePath, doc.originalName);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route DELETE /api/documents/:id
// @desc Delete document (admin only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const index = documents.findIndex((d) => d.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: "Document not found" });

    const doc = documents[index];
    const filePath = path.join(uploadDir, doc.fileName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    documents.splice(index, 1);
    res.json({ message: "Document deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;