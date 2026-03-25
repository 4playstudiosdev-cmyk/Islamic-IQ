import React, { createContext, useContext, useEffect, useState } from 'react';

const LocationContext = createContext({});
export const useLocation = () => useContext(LocationContext);

export function LocationProvider({ children }) {
  const [coords, setCoords]   = useState(null);  // { lat, lng }
  const [city, setCity]       = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [asked, setAsked]     = useState(false);

  useEffect(() => {
    // Try cached location first
    try {
      const cached = localStorage.getItem('islamiq_location');
      if (cached) {
        const d = JSON.parse(cached);
        const age = Date.now() - d.timestamp;
        // Use cache if less than 6 hours old
        if (age < 6 * 3600 * 1000) {
          setCoords({ lat: d.lat, lng: d.lng });
          setCity(d.city || '');
          setCountry(d.country || '');
          setAsked(true);
          return;
        }
      }
    } catch {}
    detectLocation();
  }, []);

  const detectLocation = async () => {
    setLoading(true);
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {
          timeout: 10000, enableHighAccuracy: true, maximumAge: 0
        })
      );
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setCoords({ lat, lng });

      // Get city name
      try {
        const geo = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const gd  = await geo.json();
        const c   = gd.address?.city || gd.address?.town || gd.address?.county || '';
        const cn  = gd.address?.country || '';
        setCity(c); setCountry(cn);
        saveCache(lat, lng, c, cn);
      } catch {
        saveCache(lat, lng, '', '');
      }
    } catch {
      // IP fallback
      try {
        const r = await fetch('https://ipapi.co/json/');
        const d = await r.json();
        if (d.latitude) {
          setCoords({ lat: d.latitude, lng: d.longitude });
          setCity(d.city || '');
          setCountry(d.country_name || '');
          saveCache(d.latitude, d.longitude, d.city || '', d.country_name || '');
        }
      } catch {}
    }
    setAsked(true);
    setLoading(false);
  };

  const saveCache = (lat, lng, city, country) => {
    try {
      localStorage.setItem('islamiq_location', JSON.stringify({
        lat, lng, city, country, timestamp: Date.now()
      }));
    } catch {}
  };

  const setManualCity = async (cityName) => {
    setCity(cityName);
    // Try to get coords for city
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`);
      const d   = await res.json();
      if (d[0]) {
        const lat = parseFloat(d[0].lat);
        const lng = parseFloat(d[0].lon);
        setCoords({ lat, lng });
        saveCache(lat, lng, cityName, country);
      }
    } catch {}
  };

  return (
    <LocationContext.Provider value={{
      coords, city, country, loading, asked,
      detectLocation, setManualCity,
      lat: coords?.lat, lng: coords?.lng,
    }}>
      {children}
    </LocationContext.Provider>
  );
}