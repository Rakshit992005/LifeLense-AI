import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'OPENWEATHER_API_KEY not configured' });
        }

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const aqiUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        const [weatherRes, aqiRes] = await Promise.all([
            fetch(weatherUrl),
            fetch(aqiUrl)
        ]);

        if (!weatherRes.ok || !aqiRes.ok) {
            return res.status(500).json({ error: 'Failed to fetch data from OpenWeatherMap' });
        }

        const weatherData = await weatherRes.json();
        const aqiData = await aqiRes.json();

        const temperature = weatherData.main?.temp;
        const humidity = weatherData.main?.humidity;
        const windSpeed = weatherData.wind?.speed;
        const weatherDescription = weatherData.weather?.[0]?.description;
        const cityName = weatherData.name;

        const aqi = aqiData.list?.[0]?.main?.aqi;
        const pm25 = aqiData.list?.[0]?.components?.pm2_5;

        let aqiCategory = 'Unknown';
        let aqiColor = 'gray';

        if (aqi === 1) { aqiCategory = 'Good'; aqiColor = 'green'; }
        else if (aqi === 2) { aqiCategory = 'Fair'; aqiColor = 'lime'; }
        else if (aqi === 3) { aqiCategory = 'Moderate'; aqiColor = 'yellow'; }
        else if (aqi === 4) { aqiCategory = 'Poor'; aqiColor = 'orange'; }
        else if (aqi === 5) { aqiCategory = 'Hazardous'; aqiColor = 'red'; }

        res.json({
            cityName,
            temperature,
            humidity,
            windSpeed,
            weatherDescription,
            aqi,
            aqiCategory,
            aqiColor,
            pm25
        });

    } catch (error) {
        console.error("Error fetching environment data:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
