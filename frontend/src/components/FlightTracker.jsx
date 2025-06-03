import React, { useState } from "react";
import {
  Plane,
  MapPin,
  Compass,
  Navigation,
  AlertCircle,
  Loader2,
  Radar,
  LogOut,
} from "lucide-react";
import { getBearing } from "../utils/geoUtils.js";

function FlightTracker() {
  const [flights, setFlights] = useState([]);
  const [position, setPosition] = useState(null);
  const [heading, setHeading] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getDirectionText = (bearing) => {
    const directions = [
      "North",
      "Northeast",
      "East",
      "Southeast",
      "South",
      "Southwest",
      "West",
      "Northwest",
    ];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  };

  const getDirectionEmoji = (direction) => {
    const emojis = {
      North: "⬆️",
      Northeast: "↗️",
      East: "➡️",
      Southeast: "↘️",
      South: "⬇️",
      Southwest: "↙️",
      West: "⬅️",
      Northwest: "↖️",
    };
    return emojis[direction] || "🧭";
  };

  const handleOrientation = (event) => {
    const compassHeading = event.webkitCompassHeading || event.alpha || null;
    if (compassHeading !== null) {
      setHeading(Math.round(compassHeading));
    }
  };

  const handleFind = () => {
    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ latitude, longitude });

        window.addEventListener(
          "deviceorientationabsolute",
          handleOrientation,
          true
        );

        try {
          const res = await fetch(
            `http://localhost:5000/api/flights?lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setFlights(data);
        } catch (err) {
          setError("Failed to fetch flight data.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Failed to get location. Please enable location services.");
        setLoading(false);
      }
    );
  };

  const handleLogout = () => {
    // Example: Clear local storage/session and redirect
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login"; 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Radar className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              SkyRadar
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Main Action Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
              <Navigation className="w-8 h-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              Discover Flights Above You
            </h2>
            <p className="text-white/70">
              Find aircraft in your area and track their movements in real-time
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleFind}
              disabled={loading}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="flex items-center gap-3">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MapPin className="w-5 h-5 group-hover:animate-pulse" />
                )}
                {loading ? "Scanning Sky..." : "Start Tracking"}
              </div>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {position && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Compass className="w-5 h-5 text-green-400" />
              <span className="font-medium text-green-300">
                Location Acquired
              </span>
            </div>
            <p className="text-white/70 text-sm">
              Lat: {position.latitude.toFixed(4)}, Lon:{" "}
              {position.longitude.toFixed(4)}
              {heading && ` • Heading: ${heading}°`}
            </p>
          </div>
        )}

        {position && flights.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="bg-white/10 px-6 py-4 border-b border-white/10">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-400" />
                Nearby Flights ({flights.length})
              </h3>
            </div>

            <div className="divide-y divide-white/10">
              {flights.map((flight, index) => {
                const [
                  icao24,
                  callsign,
                  origin_country,
                  ,
                  ,
                  lon,
                  lat,
                  baro_altitude,
                ] = flight;

                if (lat && lon && position) {
                  const bearing = getBearing(
                    position.latitude,
                    position.longitude,
                    lat,
                    lon
                  );
                  const direction = getDirectionText(bearing);
                  const directionEmoji = getDirectionEmoji(direction);

                  return (
                    <div
                      key={icao24 + index}
                      className="p-6 hover:bg-white/5 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-2xl">✈️</div>
                            <div>
                              <h4 className="font-semibold text-lg text-white">
                                {callsign || "Unknown Flight"}
                              </h4>
                              <p className="text-white/60 text-sm">
                                Origin: {origin_country}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">
                                  {directionEmoji}
                                </span>
                                <span className="text-white/70 text-sm">
                                  Direction
                                </span>
                              </div>
                              <div className="font-medium">{direction}</div>
                              <div className="text-white/60 text-xs">
                                {Math.round(bearing)}°
                              </div>
                            </div>

                            <div className="bg-white/5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl">📏</span>
                                <span className="text-white/70 text-sm">
                                  Altitude
                                </span>
                              </div>
                              <div className="font-medium">
                                {baro_altitude
                                  ? `${Math.round(
                                      baro_altitude
                                    ).toLocaleString()} m`
                                  : "N/A"}
                              </div>
                              <div className="text-white/60 text-xs">
                                {baro_altitude
                                  ? `${Math.round(
                                      baro_altitude * 3.28084
                                    ).toLocaleString()} ft`
                                  : ""}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {position && flights.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              <Plane className="w-8 h-8 text-white/50" />
            </div>
            <h3 className="text-xl font-medium mb-2 text-white/80">
              No Flights Detected
            </h3>
            <p className="text-white/60">
              There are currently no aircraft visible in your area. Try again
              in a few moments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FlightTracker;
