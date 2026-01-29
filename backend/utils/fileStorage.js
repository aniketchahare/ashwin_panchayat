const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Define upload directory
const UPLOAD_DIR = path.join(__dirname, '../public/uploads');
const PUBLIC_URL_PATH = '/uploads';

// Ensure upload directory exists
const ensureUploadDir = async () => {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
    throw new Error('Failed to create upload directory');
  }
};

// Initialize upload directory on module load
ensureUploadDir();

/**
 * Upload a single file to local storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} mimetype - File MIME type
 * @param {String} originalName - Original file name
 * @returns {Promise<Object>} - Upload result with url and type
 */
const uploadFile = async (fileBuffer, mimetype, originalName) => {
  try {
    // Ensure directory exists
    await ensureUploadDir();

    // Generate unique filename
    const fileExtension = originalName.split('.').pop() || 'jpg';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Write file to disk
    await fs.writeFile(filePath, fileBuffer);

    // Generate public URL (relative to backend server)
    const url = `${PUBLIC_URL_PATH}/${fileName}`;

    return {
      url: url,
      type: 'image',
      fileName: fileName,
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file: ' + error.message);
  }
};

/**
 * Upload multiple files to local storage
 * @param {Array} files - Array of file objects with buffer, mimetype, and originalname
 * @returns {Promise<Array>} - Array of upload results
 */
const uploadMultipleFiles = async (files) => {
  try {
    const uploadPromises = files.map((file) =>
      uploadFile(file.buffer, file.mimetype, file.originalname || 'file')
    );
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple file upload error:', error);
    throw new Error('Failed to upload files: ' + error.message);
  }
};

/**
 * Delete a file from local storage
 * @param {String} fileName - File name (just the filename, not full path)
 * @returns {Promise<void>}
 */
const deleteFile = async (fileName) => {
  try {
    // Extract just the filename from URL if full URL is provided
    const justFileName = fileName.includes('/') ? path.basename(fileName) : fileName;
    const filePath = path.join(UPLOAD_DIR, justFileName);
    
    await fs.unlink(filePath);
  } catch (error) {
    console.error('File delete error:', error);
    // Don't throw error if file doesn't exist
    if (error.code !== 'ENOENT') {
      throw new Error('Failed to delete file: ' + error.message);
    }
  }
};

module.exports = {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
};

