const express = require('express');
const multer = require('multer');
const authenticateToken = require('../middleware/auth');
const { uploadFile, uploadMultipleFiles } = require('../utils/fileStorage');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only images (any image type)
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP, etc.)'), false);
    }
  },
});

// POST /api/upload - Upload single file (protected)
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Firebase Storage
    const uploadResult = await uploadFile(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    res.json({
      url: uploadResult.url,
      type: uploadResult.type,
      fileName: uploadResult.fileName,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error during file upload: ' + error.message });
  }
});

// POST /api/upload/multiple - Upload multiple files (protected)
router.post('/multiple', authenticateToken, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Upload to Firebase Storage
    const results = await uploadMultipleFiles(req.files);

    res.json(results.map((result) => ({
      url: result.url,
      type: result.type,
      fileName: result.fileName,
    })));
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: 'Server error during file upload: ' + error.message });
  }
});

module.exports = router;

