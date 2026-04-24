import React, { useState, useEffect } from "react";

const EnvironmentCard = ({ analysisResult }) => {
  const [envData, setEnvData] = useState(null);
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Fetch Environment Data
          const envResponse = await fetch(
            `http://localhost:5000/api/environment?lat=${latitude}&lon=${longitude}`,
          );
          if (!envResponse.ok) {
            let errorMsg = "Failed to fetch environment data";
            try {
              const errJson = await envResponse.json();
              if (errJson.error) errorMsg = errJson.error;
            } catch (e) {}
            throw new Error(errorMsg);
          }
          const envJson = await envResponse.json();
          setEnvData(envJson);

          // Fetch Advisories
          const advResponse = await fetch(
            "http://localhost:5000/api/advisory",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                environmentData: envJson,
                analysisResult,
              }),
            },
          );
          if (!advResponse.ok) {
            let errorMsg = "Failed to fetch advisory";
            try {
              const errJson = await advResponse.json();
              if (errJson.error) errorMsg = errJson.error;
            } catch (e) {}
            throw new Error(errorMsg);
          }
          const advJson = await advResponse.json();
          setAdvisories(advJson.advisories || []);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      },
      (err) => {
        setLocationDenied(true);
        setLoading(false);
      },
    );
  }, [analysisResult]);

  if (locationDenied) {
    return (
      <div className="bg-gray-100 p-6 rounded-2xl border border-gray-200 shadow-sm text-center text-gray-500 mb-6">
        📍 Enable location access for personalized environmental health
        advisories.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse mb-6">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-2xl border border-red-200 shadow-sm text-center text-red-600 mb-6 font-medium">
        ⚠️ Could not load environmental data: {error}.
        {error.includes('configured') && " Please check your backend .env file."}
      </div>
    );
  }

  if (!envData) return null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
      <div className="flex flex-wrap items-center justify-between border-b pb-4 mb-4">
        <div className="flex space-x-4 text-sm font-medium text-gray-700">
          <span>📍 {envData.cityName}</span>
          <span>🌡️ {envData.temperature}°C</span>
          <span>💧 {envData.humidity}%</span>
          <span>💨 {envData.windSpeed} km/h</span>
          <span className="capitalize">☁️ {envData.weatherDescription}</span>
        </div>
        <div className="flex space-x-3 mt-2 sm:mt-0">
          <span
            className="px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm"
            style={{
              backgroundColor: envData.aqiColor,
              color:
                envData.aqiColor === "yellow" || envData.aqiColor === "lime"
                  ? "black"
                  : "white",
            }}
          >
            AQI: {envData.aqiCategory}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold shadow-sm">
            PM2.5: {envData.pm25} µg/m³
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {advisories.length === 0 ? (
          <div className="bg-green-100 text-green-800 p-4 rounded-xl text-sm font-medium border border-green-200">
            ✅ Air quality and weather in {envData.cityName} are safe for you
            today.
          </div>
        ) : (
          advisories.map((adv, idx) => {
            let bannerClasses = "";
            if (adv.level === "critical")
              bannerClasses =
                "bg-red-600 text-white font-bold animate-[pulse_2s_ease-in-out_infinite] border-2 border-red-800 shadow-md";
            else if (adv.level === "warning")
              bannerClasses =
                "bg-orange-100 text-orange-900 font-medium border border-orange-200";
            else if (adv.level === "info")
              bannerClasses =
                "bg-blue-100 text-blue-900 font-medium border border-blue-200";

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl text-sm ${bannerClasses}`}
              >
                {adv.message}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EnvironmentCard;
