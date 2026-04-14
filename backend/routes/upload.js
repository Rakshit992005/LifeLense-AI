import express from 'express';
import multer from 'multer';
import path from 'path';
import { extractTextFromImage } from '../utils/ocr.js';

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
    fileSize: 100 * 1024 * 1024 
  }
});

// ============================================
// 4. Define Upload Route
// ============================================
// We expect a POST request to '/api/upload' 
// `upload.single('report')` means we extract a single file from the field named 'report'
router.post('/', upload.single('report'), async (req, res) => {
  try {
    // Check if multer intercepted the file and attached it to `req.file`
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded or invalid file format.' 
      });
    }

    // Run OCR if the file is an image
    let extractedText = null;
    
    if (req.file.mimetype.startsWith('image/')) {
      console.log('Running OCR on uploaded image...');
      try {
        extractedText = await extractTextFromImage(req.file.path);
        console.log('OCR Extraction successful. Length:', extractedText.length);
      } catch (ocrError) {
        console.error('OCR Processing failed:', ocrError);
      }
    } else if (req.file.mimetype === 'application/pdf') {
       // Tesseract cannot parse PDFs directly without conversion
       extractedText = "[PDF detected. Text parsing not yet processed natively. Please upload images for OCR.]";
    }

    // Return a success JSON response detailing the saved file and extracted text
    return res.status(200).json({
      success: true,
      message: 'File successfully uploaded and processed.',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      },
      extractedText: extractedText
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
