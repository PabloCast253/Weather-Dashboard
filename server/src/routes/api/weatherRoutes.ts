import { Router } from 'express';
const router = Router();

 import HistoryService from '../../service/historyService.js';
 import WeatherService from '../../service/weatherService.js';
 console.log("✅ weatherRoutes.ts loaded");
// ✅ POST Request with city name to retrieve weather data
router.post("/", async (req, res) => {
  try {
    const { city, cityName } = req.body;
    const cityToUse = city || cityName;
    console.log("Received city!!!!!:", cityToUse); // ✅ Log incoming city name
    console.log('✅ Received POST /api/weather');
    // res.json({ message: 'It works!' });
  console.log('Request body:', req.body);
    if (!cityToUse) {
      return res.status(400).json({ error: "City name is required" });
    }

    try {
      const weatherData = await WeatherService.getWeatherForCity(cityToUse);

      if (!weatherData || !weatherData.current) {
        return res.status(404).json({ error: "Weather data not found for this city" });
      }

      await HistoryService.addCity(cityToUse);
      return res.json([weatherData.current, ...weatherData.forecast]);

    } catch (error) {
      console.error("Weather API error:", error);
      return res.status(404).json({ error: "Weather data not found" }); // ✅ Return a safe error
    }

  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/history", async (_req, res) => {
  try {
    console.log("✅ GET /api/weather/history route hit");


    const history = await HistoryService.getCities();

    console.log("Search history retrieved successfully:", history); // ✅ Log retrieved history

    return res.json(history);
  } catch (error) {
    console.error("❌ Error retrieving search history:", error); // ✅ Log exact error
    return res.status(500).json({ error: `Failed to retrieve search history: ${(error as Error).message}` });
  }
});


router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'City ID is required' });
    }

    const deleted = await HistoryService.removeCity(id);
    if (!deleted) {
      return res.status(404).json({ error: 'City not found in search history' });
    }

    return res.json({ message: 'City removed from search history' }); // ✅ Always returning a response
  } catch (error) {
    return res.status(500).json({ error: `Failed to delete city: ${error}` }); // ✅ Always returning a response
  }
});

export default router;
