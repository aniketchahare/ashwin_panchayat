const express = require('express');
const multer = require('multer');
const Content = require('../models/Content');
const authenticateToken = require('../middleware/auth');
const { uploadMultipleFiles, deleteFile } = require('../utils/fileStorage');

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

// GET /api/content - Get all content (public, can filter by type)
// For public: only shows active content and valid events (not expired)
// For admin (with token): shows all content including inactive
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const isAdmin = req.headers['authorization']; // Check if admin is logged in
    
    // Build base filter
    const filter = {};
    if (type) {
      filter.type = type;
    }
    
    // For public access: filter by isActive and event dates
    if (!isAdmin) {
      filter.isActive = true;
      
      // For events: only show if current date is within startDate and endDate
      if (type === 'EVENT') {
        const now = new Date();
        filter.startDate = { $lte: now };
        filter.endDate = { $gte: now };
      } else if (!type) {
        // If no type filter, we need to handle events separately
        // Use $or to include non-events or valid events
        // Note: isActive=true is already in filter, so it applies to all
        const now = new Date();
        filter.$or = [
          { type: { $ne: 'EVENT' } }, // Non-event items (already filtered by isActive)
          {
            type: 'EVENT',
            startDate: { $lte: now },
            endDate: { $gte: now },
            // isActive is already in the main filter
          },
        ];
      }
    }
    
    const contents = await Content.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v');

    // Set cache-control headers to prevent browser caching
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });

    res.json(contents);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Server error while fetching content' });
  }
});

// GET /api/content/:id - Get single content item (public)
router.get('/:id', async (req, res) => {
  try {
    const content = await Content.findById(req.params.id).select('-__v');
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Server error while fetching content' });
  }
});

// POST /api/content - Create new content (protected)
// Handles multipart/form-data with files
router.post('/', authenticateToken, upload.array('files', 10), async (req, res) => {
  try {
    const { type, title, description, startDate, endDate, isActive, existingMedia } = req.body;
    let media = [];

    // Validate input
    if (!type || !title || !description) {
      return res.status(400).json({ error: 'Type, title, and description are required' });
    }

    if (!['EVENT', 'ACHIEVEMENT', 'WORK'].includes(type)) {
      return res.status(400).json({ error: 'Invalid content type' });
    }

    // Validate event dates
    if (type === 'EVENT') {
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required for events' });
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        return res.status(400).json({ error: 'End date must be after or equal to start date' });
      }
    }

    // Handle existing media (from edit form)
    if (existingMedia) {
      try {
        const parsed = JSON.parse(existingMedia);
        if (Array.isArray(parsed)) {
          media = parsed;
        }
      } catch (e) {
        // If parsing fails, ignore existing media
      }
    }

    // Upload new files if any
    if (req.files && req.files.length > 0) {
      try {
        const uploadResults = await uploadMultipleFiles(req.files);
        const newMedia = uploadResults.map((item) => ({
          url: item.url,
          type: item.type,
        }));
        media = [...media, ...newMedia];
      } catch (uploadError) {
        return res.status(500).json({ error: 'Failed to upload files: ' + uploadError.message });
      }
    }

    const content = new Content({
      type,
      title,
      description,
      media,
      startDate: type === 'EVENT' ? new Date(startDate) : undefined,
      endDate: type === 'EVENT' ? new Date(endDate) : undefined,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
    });

    await content.save();
    res.status(201).json(content);
  } catch (error) {
    console.error('Create content error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error while creating content' });
  }
});

// PUT /api/content/:id - Update content (protected)
// Handles multipart/form-data with files
router.put('/:id', authenticateToken, upload.array('files', 10), async (req, res) => {
  try {
    const { title, description, startDate, endDate, isActive, existingMedia } = req.body;

    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    if (title) content.title = title;
    if (description) content.description = description;
    if (isActive !== undefined) content.isActive = isActive === 'true' || isActive === true;

    // Handle existing media
    let media = [];
    const originalMedia = content.media || [];
    
    if (existingMedia) {
      try {
        const parsed = JSON.parse(existingMedia);
        if (Array.isArray(parsed)) {
          media = parsed;
        }
      } catch (e) {
        // If parsing fails, keep existing media
        media = originalMedia;
      }
    } else {
      // If no existingMedia provided, keep current media
      media = originalMedia;
    }

    // Delete files that were removed (compare original with new)
    const removedMedia = originalMedia.filter(
      (original) => !media.some((newItem) => newItem.url === original.url)
    );
    
    for (const removedItem of removedMedia) {
      try {
        await deleteFile(removedItem.url);
      } catch (error) {
        console.error('Error deleting removed file:', removedItem.url, error);
        // Continue even if file deletion fails
      }
    }

    // Upload new files if any
    if (req.files && req.files.length > 0) {
      try {
        const uploadResults = await uploadMultipleFiles(req.files);
        const newMedia = uploadResults.map((item) => ({
          url: item.url,
          type: item.type,
        }));
        media = [...media, ...newMedia];
      } catch (uploadError) {
        return res.status(500).json({ error: 'Failed to upload files: ' + uploadError.message });
      }
    }

    content.media = media;

    // Update event dates if provided
    if (content.type === 'EVENT') {
      if (startDate) {
        content.startDate = new Date(startDate);
      }
      if (endDate) {
        content.endDate = new Date(endDate);
      }
      // Validate date range
      if (content.startDate && content.endDate && content.endDate < content.startDate) {
        return res.status(400).json({ error: 'End date must be after or equal to start date' });
      }
    }

    await content.save();
    res.json(content);
  } catch (error) {
    console.error('Update content error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error while updating content' });
  }
});

// DELETE /api/content/:id - Delete content (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    
    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Delete associated image files
    if (content.media && content.media.length > 0) {
      for (const mediaItem of content.media) {
        try {
          await deleteFile(mediaItem.url);
        } catch (error) {
          console.error('Error deleting file:', mediaItem.url, error);
          // Continue even if file deletion fails
        }
      }
    }

    // Delete content from database
    await Content.findByIdAndDelete(req.params.id);

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ error: 'Server error while deleting content' });
  }
});

module.exports = router;

