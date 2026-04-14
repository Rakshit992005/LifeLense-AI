import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// ============================================
// 1. Configure Multer Storage Strategy
// ============================================
const storage = multer.diskStorage({
  // Define where the files should be stored on the local file system
  destination: function (req, file, cb) {
    // We already ensured this 'uploads/' folder exists in server.js
    cb(null, 'uploads/');
  },
  
  // Define how the file should be named to avoid collisions when multiple files are uploaded
  filename: function (req, file, cb) {
    // Extract original extension (e.g., .pdf, .jpg)
    const ext = path.extname(file.originalname);
    
    // Create a unique identifier combining the current timestamp and a random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    
    // Final filename: <original_field_name>-<unique_identifier>.<extension>
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// ============================================
// 2. Configure File Filter
// ============================================
// Security measure to ensure only supported file types (PDFs and basic images) are uploaded
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    // Accept file if it matches one of the allowed mimetypes
    cb(null, true);
  } else {
    // Reject the file with a helpful error
    cb(new Error('Invalid file type! Only PDF, JPEG, PNG, and JPG are accepted.'), false);
  }
};

// ============================================
// 3. Initialize Multer Instance
// ============================================
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    // Optional: limit file size to 10MB to avoid oversized file uploads
    fileSize: 10 * 1024 * 1024 
  }
});

// ============================================
// 4. Define Upload Route
// ============================================
// We expect a POST request to '/api/upload' 
// `upload.single('report')` means we extract a single file from the field named 'report'
router.post('/', upload.single('report'), (req, res) => {
  try {
    // Check if multer intercepted the file and attached it to `req.file`
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded or invalid file format.' 
      });
    }

    // Success flow!
    // In future stages (Day 2+), you would pass `req.file.path` to your OCR and AI utility functions here.
    
    // Return a success JSON response detailing the saved file
    return res.status(200).json({
      success: true,
      message: 'File successfully uploaded to local storage.',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    });

  } catch (error) {
    console.error('Error during file upload:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during the upload process.',
      error: error.message 
    });
  }
});

export default router;
