/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, RefreshCw, Loader, Bell, BellOff, Settings, Clock, Navigation } from 'lucide-react';
import { getPrayerTimesByCoords, getPrayerTimesByCity, METHODS, PRAYERS } from '../services/prayerApi';

function timeToMinutes(t) {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function formatTime12(t) {
  if (!t) return '--:--';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 || 12;
  return `${h12}:${String(m).padStart(2,'0')} ${ampm}`;
}

function timeUntil(t) {
  if (!t) return '';
  const now  = new Date();
  const cur  = now.getHours()*60 + now.getMinutes();
  const tgt  = timeToMinutes(t);
  let diff   = tgt - cur;
  if (diff < 0) diff += 24*60;
  const h    = Math.floor(diff/60);
  const m    = diff % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export default function PrayerTimes() {
  const [times, setTimes]           = useState(null);
  const [date, setDate]             = useState(null);
  const [hijri, setHijri]           = useState(null);
  const [location, setLocation]     = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [now, setNow]               = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState(null);
  const [method, setMethod]         = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [cityInput, setCityInput]   = useState('');
  const [manualCity, setManualCity] = useState(null);
  const [notifications, setNotifications] = useState({});
  const tickRef = useRef(null);

  // Tick every second for live clock + countdown
  useEffect(() => {
    tickRef.current = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tickRef.current);
  }, []);

  // Auto get location on mount
  useEffect(() => { detectLocation(); }, []);

  // Recalculate next prayer when times or now changes
  useEffect(() => {
    if (!times) return;
    const cur = now.getHours()*60 + now.getMinutes();
    const upcoming = PRAYERS
      .filter(p => p.notif !== false && times[p.key])
      .map(p => ({ ...p, time: times[p.key], mins: timeToMinutes(times[p.key]) }))
      .sort((a, b) => a.mins - b.mins);
    const next = upcoming.find(p => p.mins > cur) || upcoming[0];
    setNextPrayer(next);
  }, [times, now]);

  const detectLocation = () => {
    setLoading(true); setError(null);
    if (!navigator.geolocation) {
      loadByCity('Karachi', 'PK');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLocation({ lat, lng, type: 'gps' });
        loadByCoords(lat, lng);
        // Reverse geocode to get city name
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(r => r.json())
          .then(d => setLocation(prev => ({ ...prev, city: d.address?.city || d.address?.town || d.address?.state, country: d.address?.country })))
          .catch(() => {});
      },
      () => { loadByCity('Karachi', 'PK'); }
    );
  };

  const loadByCoords = async (lat, lng) => {
    setLoading(true); setError(null);
    try {
      const data = await getPrayerTimesByCoords(lat, lng, method);
      setTimes(data.timings);
      setDate(data.date?.readable);
      setHijri(data.date?.hijri);
    } catch { setError('Failed to load prayer times. Check internet.'); }
    finally { setLoading(false); }
  };

  const loadByCity = async (city, country) => {
    setLoading(true); setError(null);
    try {
      const data = await getPrayerTimesByCity(city, country, method);
      setTimes(data.timings);
      setDate(data.date?.readable);
      setHijri(data.date?.hijri);
      setLocation({ city, country, type: 'city' });
    } catch { setError('City not found. Try another city name.'); }
    finally { setLoading(false); }
  };

  const handleCitySearch = (e) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    const [city, country] = cityInput.includes(',')
      ? cityInput.split(',').map(s => s.trim())
      : [cityInput.trim(), 'PK'];
    setManualCity({ city, country });
    loadByCity(city, country);
    setShowSettings(false);
  };

  const toggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const curMins = now.getHours()*60 + now.getMinutes();

  // Find current prayer (last one that passed)
  const currentPrayer = times ? PRAYERS
    .filter(p => p.notif !== false && times[p.key])
    .map(p => ({ ...p, mins: timeToMinutes(times[p.key]) }))
    .filter(p => p.mins <= curMins)
    .sort((a, b) => b.mins - a.mins)[0] : null;

  return (
    <div style={{ padding: '24px 28px', maxWidth: 820, margin: '0 auto' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            🕌 Prayer Times
          </h1>
          <p style={{ fontSize: 12, color: '#4a6355', marginTop: 3 }}>
            {location?.city ? `📍 ${location.city}${location.country ? ', ' + location.country : ''}` : '📍 Detecting location...'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={detectLocation} style={{ background: 'var(--dark-card)', border: '1px solid rgba(46,139,87,0.2)', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', color: '#3aad6e', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <Navigation size={14}/> My Location
          </button>
          <button onClick={() => setShowSettings(!showSettings)} style={{ background: showSettings ? 'rgba(46,139,87,0.2)' : 'var(--dark-card)', border: '1px solid rgba(46,139,87,0.2)', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', color: '#7a9585', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <Settings size={14}/> Settings
          </button>
        </div>
      </div>

      {/* ── Settings Panel ── */}
      {showSettings && (
        <div style={{ background: 'var(--dark-card)', border: '1px solid rgba(46,139,87,0.2)', borderRadius: 16, padding: '20px 22px', marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>⚙️ Settings</h3>
          {/* City search */}
          <form onSubmit={handleCitySearch} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <MapPin size={13} color="#4a6355" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                value={cityInput}
                onChange={e => setCityInput(e.target.value)}
                placeholder="Enter city, country (e.g. Karachi, PK)"
                style={{ width: '100%', padding: '9px 10px 9px 30px', background: 'rgba(46,139,87,0.08)', border: '1px solid rgba(46,139,87,0.2)', borderRadius: 9, color: 'white', fontSize: 12, outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            <button type="submit" style={{ background: 'linear-gradient(135deg, #1B6B3A, #2E8B57)', color: 'white', border: 'none', borderRadius: 9, padding: '9px 18px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Search</button>
          </form>
          {/* Method */}
          <div>
            <p style={{ fontSize: 12, color: '#7a9585', marginBottom: 8 }}>Calculation Method:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {METHODS.map(m => (
                <button key={m.id} onClick={() => { setMethod(m.id); if (location?.lat) loadByCoords(location.lat, location.lng); else if (location?.city) loadByCity(location.city, location.country); }} style={{ background: method === m.id ? 'rgba(46,139,87,0.2)' : 'transparent', border: `1px solid ${method === m.id ? 'rgba(46,139,87,0.4)' : 'rgba(255,255,255,0.06)'}`, borderRadius: 8, padding: '7px 12px', cursor: 'pointer', textAlign: 'left', color: method === m.id ? '#3aad6e' : '#7a9585', fontSize: 11 }}>
                  {method === m.id ? '✓ ' : ''}{m.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 12 }}>
          <Loader size={26} color="#2E8B57" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#4a6355' }}>Loading prayer times...</p>
        </div>
      ) : error ? (
        <div style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)', borderRadius: 12, padding: 20, color: '#e74c3c', fontSize: 13 }}>
          ⚠️ {error}
        </div>
      ) : times ? (
        <>
          {/* ── Live Clock + Date ── */}
          <div style={{ background: 'linear-gradient(135deg, #0f3d22, #1B6B3A)', borderRadius: 20, padding: '24px 28px', marginBottom: 20, border: '1px solid rgba(212,175,55,0.2)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', border: '1px solid rgba(212,175,55,0.1)' }} />
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', border: '1px solid rgba(212,175,55,0.08)' }} />
            {/* Live clock */}
            <div style={{ fontSize: 48, fontWeight: 800, color: 'white', fontVariantNumeric: 'tabular-nums', letterSpacing: 2, marginBottom: 4 }}>
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 14 }}>{date}</div>
            {/* Hijri date */}
            {hijri && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 10, padding: '6px 16px' }}>
                <span className="arabic" style={{ fontSize: 15, color: '#f5d060', fontWeight: 600 }}>
                  {hijri.day} {hijri.month?.ar} {hijri.year}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>|</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>
                  {hijri.day} {hijri.month?.en} {hijri.year} AH
                </span>
              </div>
            )}
            {/* Next prayer */}
            {nextPrayer && (
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <div style={{ background: 'rgba(212,175,55,0.2)', borderRadius: 8, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={13} color="#D4AF37" />
                  <span style={{ fontSize: 12, color: '#D4AF37', fontWeight: 600 }}>
                    Next: {nextPrayer.name} in {timeUntil(nextPrayer.time)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Prayer Times Cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, marginBottom: 20 }}>
            {PRAYERS.map(p => {
              const t        = times[p.key];
              const isNext   = nextPrayer?.key === p.key;
              const isCurrent= currentPrayer?.key === p.key;
              const passed   = timeToMinutes(t) < curMins && !isNext;
              return (
                <div key={p.key} style={{
                  background: isNext
                    ? `linear-gradient(135deg, ${p.color}cc, ${p.color}88)`
                    : isCurrent
                    ? `${p.color}22`
                    : 'var(--dark-card)',
                  border: `1px solid ${isNext ? 'rgba(212,175,55,0.5)' : isCurrent ? p.color+'44' : 'rgba(46,139,87,0.1)'}`,
                  borderRadius: 16,
                  padding: '18px 20px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: isNext ? `0 8px 24px ${p.color}44` : 'none',
                  transition: 'all 0.3s',
                }}>
                  {isNext && (
                    <div style={{ position: 'absolute', top: 8, right: 10, background: 'rgba(212,175,55,0.25)', border: '1px solid rgba(212,175,55,0.4)', borderRadius: 6, padding: '2px 8px', fontSize: 9, color: '#f5d060', fontWeight: 700 }}>NEXT</div>
                  )}
                  {isCurrent && !isNext && (
                    <div style={{ position: 'absolute', top: 8, right: 10, background: `${p.color}33`, border: `1px solid ${p.color}55`, borderRadius: 6, padding: '2px 8px', fontSize: 9, color: p.color, fontWeight: 700 }}>NOW</div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ fontSize: 24 }}>{p.icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: isNext ? 'white' : '#c0d4c8' }}>{p.name}</div>
                      <div className="arabic" style={{ fontSize: 13, color: isNext ? 'rgba(255,255,255,0.7)' : '#D4AF37' }}>{p.arabic}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: isNext ? '#f5d060' : passed ? '#4a6355' : 'white', fontVariantNumeric: 'tabular-nums' }}>
                    {formatTime12(t)}
                  </div>
                  {isNext && (
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                      in {timeUntil(t)}
                    </div>
                  )}
                  {/* Notification toggle */}
                  {p.notif !== false && (
                    <button
                      onClick={() => toggleNotif(p.key)}
                      style={{ position: 'absolute', bottom: 12, right: 12, background: notifications[p.key] ? `${p.color}33` : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 7, padding: '4px 6px', cursor: 'pointer', color: notifications[p.key] ? p.color : '#4a6355' }}
                    >
                      {notifications[p.key] ? <Bell size={13}/> : <BellOff size={13}/>}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Extra times ── */}
          <div style={{ background: 'var(--dark-card)', border: '1px solid rgba(46,139,87,0.1)', borderRadius: 16, padding: '16px 20px', marginBottom: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#7a9585', marginBottom: 12 }}>Additional Times</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))', gap: 10 }}>
              {['Imsak','Midnight','Firstthird','Lastthird'].map(k => times[k] ? (
                <div key={k} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ fontSize: 10, color: '#4a6355', marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#7a9585' }}>{formatTime12(times[k])}</div>
                </div>
              ) : null)}
            </div>
          </div>

          {/* ── Qibla direction hint ── */}
          {location?.lat && (
            <div style={{ background: 'linear-gradient(135deg, rgba(27,107,58,0.15), rgba(13,61,34,0.3))', border: '1px solid rgba(46,139,87,0.2)', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 32 }}>🕋</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 3 }}>Qibla Direction</div>
                <div style={{ fontSize: 11, color: '#4a6355' }}>
                  The Kaaba is in Makkah, Saudi Arabia.<br/>
                  Face North-West from Karachi (approx 292°)
                </div>
              </div>
            </div>
          )}

          {/* Refresh */}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button onClick={() => location?.lat ? loadByCoords(location.lat, location.lng) : loadByCity(location?.city, location?.country)} style={{ background: 'none', border: '1px solid rgba(46,139,87,0.2)', borderRadius: 10, padding: '8px 20px', cursor: 'pointer', color: '#4a6355', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <RefreshCw size={13}/> Refresh Times
            </button>
          </div>
        </>
      ) : null}

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}