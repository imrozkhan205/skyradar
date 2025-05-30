// src/components/FlightTracker.jsx
import React, { useEffect, useState } from 'react';
import { getBearing } from '../utils/geoUtils';

function FlightTracker() {
  const [flights, setFlights] = useState([]);
  const [position, setPosition] = useState(null);
  const [heading, setHeading] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user's location
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ latitude, longitude });
        fetchFlights(latitude, longitude);
      },
      (err) => {
        setError('Failed to get location. Please enable location services.');
      }
    );

    // Get user's compass heading
    const handleOrientation = (event) => {
      const compassHeading =
        event.webkitCompassHeading ||
        event.alpha || // fallback
        null;
      if (compassHeading !== null) {
        setHeading(Math.round(compassHeading));
      }
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
    };
  }, []);

  const fetchFlights = async (lat, lon) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/flights?lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      setFlights(data);
      console.log(data)
    } catch (err) {
      setError('Failed to fetch flight data.');
    }
  };

  const getDirectionText = (bearing) => {
    const directions = [
      'North', 'Northeast', 'East', 'Southeast',
      'South', 'Southwest', 'West', 'Northwest',
    ];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  };

  return (
    <div style={{ marginTop: '20px' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {position && (
        <>
          <p><strong>Your Heading:</strong> {heading ?? 'Calculating...'}°</p>
          <h2>Nearby Flights</h2>
          <ul>
            {flights.map((flight, index) => {
              const [icao24, callsign, origin_country, time_position, last_contact,
                     longitude, latitude, baro_altitude] = flight;

              if (latitude && longitude && position) {
                const bearing = getBearing(
                  position.latitude,
                  position.longitude,
                  latitude,
                  longitude
                );
                const direction = getDirectionText(bearing);

                return (
                  <li key={icao24 + index} style={{ marginBottom: '10px' }}>
                    <strong>{callsign || 'Unknown Flight'}</strong> from <em>{origin_country}</em> <br />
                    Heading {direction} ({Math.round(bearing)}°), Altitude: {baro_altitude ? `${Math.round(baro_altitude)} m` : 'N/A'}
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default FlightTracker;
