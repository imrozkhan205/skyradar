import React, { useState } from 'react';
import { getBearing } from '../utils/geoUtils';
// import MapView from './MapView';

function FlightTracker() {
  const [flights, setFlights] = useState([]);
  const [position, setPosition] = useState(null);
  const [heading, setHeading] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getDirectionText = (bearing) => {
    const directions = [
      'North', 'Northeast', 'East', 'Southeast',
      'South', 'Southwest', 'West', 'Northwest',
    ];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  };

  const handleOrientation = (event) => {
    const compassHeading =
      event.webkitCompassHeading ||
      event.alpha || // fallback
      null;
    if (compassHeading !== null) {
      setHeading(Math.round(compassHeading));
    }
  };

  const handleFind = () => {
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ latitude, longitude });

        // Add orientation listener
        window.addEventListener('deviceorientationabsolute', handleOrientation, true);

        try {
          const res = await fetch(
            `http://localhost:5000/api/flights?lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          setFlights(data);
        } catch (err) {
          setError('Failed to fetch flight data.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Failed to get location. Please enable location services.');
        setLoading(false);
      }
    );
  };

  return (
    
    <div className='flex items-center py-10 '>
      <div className='flex-col-1' >
        <button className='flex  bg-red-500 p-3 mb-4 text-white rounded-sm ' onClick={handleFind}>
          Find
        </button>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {position && (
          <>
            <p> </p>
            <h2 className='font-bold'>Nearby Flights:</h2>
            <ul>
              {flights.map((flight, index) => {
                const [icao24, callsign, origin_country, , , lon, lat, baro_altitude] = flight;

                if (lat && lon && position) {
                  const bearing = getBearing(position.latitude, position.longitude, lat, lon);
                  const direction = getDirectionText(bearing);

                  return (
                    
                    <li key={icao24 + index} >
                      <strong>✈️{callsign || 'Unknown Flight'}</strong>
                       
                      from <em>{origin_country}</em><br />
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
      </div>
  );
}

export default FlightTracker;
