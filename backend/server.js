import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import uploadRoute from './routes/upload.js';
import environmentRoute from './routes/environment.js';
import advisoryRoute from './routes/advisory.js';

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Set up basic middleware
// cors() allows our React frontend to communicate with this backend without Cross-Origin Resource Sharing blocking
app.use(cors());
// express.json() allows us to parse incoming JSON payloads
app.use(express.json());
// express.urlencoded() handles Form Data
app.use(express.urlencoded({ extended: true }));

// Ensure 'uploads' directory exists before processing any requests
// We will store uploaded medical reports here
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('Created local "uploads" directory for storing files.');
}

// Register our routes
// Any request coming to '/api/upload' will be handled by uploadRoute
app.use('/api/upload', uploadRoute);
app.use('/api/environment', environmentRoute);
app.use('/api/advisory', advisoryRoute);

// Basic health check route to verify server is running
app.get('/', (req, res) => {
  res.send('LifeLense AI Backend is running!');
});

// Ollama health check route
app.get('/api/health/ollama', async (req, res) => {
  try {
    const response = await fetch('http://localhost:11434/');
    if (response.ok) {
      return res.status(200).json({ status: 'running', message: 'Ollama is running locally.' });
    }
    return res.status(503).json({ status: 'error', message: `Ollama responded with status ${response.status}` });
  } catch (error) {
    return res.status(503).json({ status: 'offline', message: 'Ollama is offline or unreachable.' });
  }
});

// Configure the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started successfully. Listening on port ${PORT}`);
});
