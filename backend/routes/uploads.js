const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Upload = require('../models/Upload');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const uploadDirectory = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (_req, file, callback) => {
    const safeFileName = `${Date.now()}-${path.basename(file.originalname).replace(/[^a-zA-Z0-9_.-]/g, '-')}`;
    callback(null, safeFileName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.get('/', async (_req, res) => {
  try {
    const uploads = await Upload.find().populate('uploadedBy', 'username name').sort({ createdAt: -1 });
    res.json(uploads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', authMiddleware, (req, res) => {
  upload.single('file')(req, res, async (error) => {
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'A file is required.' });
    }

    try {
      const title = req.body.title && req.body.title.trim() ? req.body.title.trim() : req.file.originalname;
      const baseUrl = `${req.protocol}://${req.get('host')}`;

      const uploadRecord = new Upload({
        title,
        originalName: req.file.originalname,
        fileName: req.file.filename,
        fileUrl: `${baseUrl}/uploads/${req.file.filename}`,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedBy: req.user.userId,
      });

      await uploadRecord.save();
      await uploadRecord.populate('uploadedBy', 'username name');
      res.status(201).json(uploadRecord);
    } catch (saveError) {
      res.status(500).json({ message: saveError.message });
    }
  });
});

module.exports = router;