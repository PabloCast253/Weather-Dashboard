import { Router } from 'express';
const router = Router();


import htmlRoutes from './htmlRoutes.js';
import weatherRoutes from './api/weatherRoutes.js' // ✅ Correct path! // ⬅️ Import the weather routes


router.use('/', htmlRoutes);
router.use('/weather', weatherRoutes); // ⬅️ Now /api/weather maps correctly

export default router;
