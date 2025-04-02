import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// import routes from './routes/index.js';
import weatherRoutes from './routes/api/weatherRoutes.js';


dotenv.config();

console.log("Loaded API Base URL:", process.env.API_BASE_URL);
console.log("Loaded Weather API Key:", process.env.WEATHER_API_KEY ? "Present" : "Missing!!!!!!");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Corrected path to dist folder
const distPath = path.resolve(__dirname, '../../client/dist');
console.log('DIST PATH:', distPath);

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Serve frontend static files
app.use(express.static(distPath));

// ✅ Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Request logger
app.use((req, _res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// ✅ API routes
app.use('/api', weatherRoutes);
app.get('/api/debug', (_req, res) => {
  res.json({ message: 'Backend is working' });
});

// ✅ Wildcard route fallback to frontend
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// ✅ Start server
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
