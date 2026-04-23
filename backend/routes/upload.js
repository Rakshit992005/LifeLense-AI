import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { extractTextFromImage } from '../utils/ocr.js';
import { analyzeWithAgent } from '../utils/agent.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! Only PDF, JPEG, PNG, and JPG are accepted.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 
  }
});

router.post('/', upload.single('report'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded or invalid file format.' 
      });
    }

    let extractedText = null;
    let aiAnalysis = null;
    
    // 1. Text Extraction
    if (req.file.mimetype.startsWith('image/')) {
      console.log('Running OCR on uploaded image...');
      try {
        extractedText = await extractTextFromImage(req.file.path);
        console.log('OCR Extraction successful. Length:', extractedText.length);
      } catch (ocrError) {
        console.error('OCR Processing failed:', ocrError);
        return res.status(500).json({ success: false, message: 'Failed to extract text from image.' });
      }
    } else if (req.file.mimetype === 'application/pdf') {
      console.log('Parsing uploaded PDF...');
      try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(dataBuffer);
        extractedText = data.text;
        console.log('PDF Parsing successful. Length:', extractedText.length);
      } catch (pdfError) {
        console.error('PDF Processing failed:', pdfError);
        return res.status(500).json({ success: false, message: 'Failed to extract text from PDF.' });
      }
    }

    // 2. Custom Agent Analysis
    if (extractedText && extractedText.trim().length > 0) {
      console.log('Running Custom Agent Analysis on extracted text...');
      try {
         aiAnalysis = await analyzeWithAgent(extractedText);
         console.log('Custom Agent Analysis successful.');
      } catch (agentError) {
         console.error('Agent Analysis failed:', agentError);
         // We might not fail the entire request if Agent fails, just return text
         aiAnalysis = 'Error: Agent failed to process the report text.';
      }
    }

    // 3. Return Final Response
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
      extractedText: extractedText,
      analysis: aiAnalysis
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

