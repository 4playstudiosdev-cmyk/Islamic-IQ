/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Phone, Clock, Search, Loader, ExternalLink } from 'lucide-react';
import { useLocation as useAppLocation } from '../context/LocationContext';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .mf-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { to{background-position:200% center} }
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes pulse   { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.1);opacity:1} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .mf-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:16px; transition:all 0.3s; cursor:pointer; }
  .mf-card:hover { border-color:rgba(201,168,76,0.3); transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.4); }
  .mf-card.active { border-color:rgba(201,168,76,0.5); background:rgba(201,168,76,0.06); }
  .mf-input { background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.15); border-radius:10px; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; outline:none; }
  .mf-input:focus { border-color:rgba(201,168,76,0.4); }
  .mf-input::placeholder { color:rgba(242,237,228,0.25); }
  #masjid-map { width:100%; height:400px; border-radius:16px; border:1px solid rgba(201,168,76,0.15); }
`;

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2-lat1)*Math.PI/180;
  const dLng = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  const d = R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  return d < 1000 ? `${Math.round(d)}m` : `${(d/1000).toFixed(1)}km`;
}

function getBearing(lat1,lng1,lat2,lng2) {
  const dLng = (lng2-lng1)*Math.PI/180;
  const y = Math.sin(dLng)*Math.cos(lat2*Math.PI/180);
  const x = Math.cos(lat1*Math.PI/180)*Math.sin(lat2*Math.PI/180)-Math.sin(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.cos(dLng);
  const b = (Math.atan2(y,x)*180/Math.PI+360)%360;
  const dirs = ['N','NE','E','SE','S','SW','W','NW'];
  return dirs[Math.round(b/45)%8];
}

export default function MasjidFinder() {
  const { coords, city } = useAppLocation();
  const [mosques, setMosques]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [selected, setSelected]   = useState(null);
  const [error, setError]         = useState('');
  const [radius, setRadius]       = useState(3000);
  const [search, setSearch]       = useState('');
  const mapRef    = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (coords?.lat) fetchMosques(coords.lat, coords.lng, radius);
  }, [coords, radius]);

  useEffect(() => {
    initMap();
  }, []);

  useEffect(() => {
    if (mosques.length > 0 && leafletRef.current) updateMarkers();
  }, [mosques, selected]);

  const initMap = () => {
    if (typeof window === 'undefined' || leafletRef.current) return;
    // Load Leaflet dynamically
    if (!window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setupMap();
      document.head.appendChild(script);
    } else {
      setupMap();
    }
  };

  const setupMap = () => {
    if (!document.getElementById('masjid-map') || leafletRef.current) return;
    const L   = window.L;
    const lat = coords?.lat || 24.8607;
    const lng = coords?.lng || 67.0011;
    const map = L.map('masjid-map', { zoomControl:true }).setView([lat, lng], 14);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '©OpenStreetMap ©CartoDB', subdomains:'abcd', maxZoom:19
    }).addTo(map);
    // User location marker
    L.circle([lat,lng], { color:'#C9A84C', fillColor:'#C9A84C', fillOpacity:0.3, radius:30 }).addTo(map);
    L.marker([lat,lng], { icon: L.divIcon({ className:'', html:`<div style="width:14px;height:14px;background:#C9A84C;border-radius:50%;border:2px solid white;box-shadow:0 0 8px rgba(201,168,76,0.8)"></div>`, iconSize:[14,14], iconAnchor:[7,7] }) }).addTo(map).bindPopup('📍 You are here');
    leafletRef.current = map;
  };

  const updateMarkers = () => {
    const L = window.L;
    if (!L || !leafletRef.current) return;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    mosques.forEach((m, i) => {
      const isSelected = selected?.id === m.id;
      const marker = L.marker([m.lat, m.lng], {
        icon: L.divIcon({
          className: '',
          html: `<div style="width:${isSelected?36:28}px;height:${isSelected?36:28}px;background:${isSelected?'#C9A84C':'rgba(201,168,76,0.7)'};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center"><span style="transform:rotate(45deg);font-size:${isSelected?16:12}px">🕌</span></div>`,
          iconSize: [isSelected?36:28, isSelected?36:28],
          iconAnchor: [isSelected?18:14, isSelected?36:28],
        })
      });
      marker.addTo(leafletRef.current);
      marker.bindPopup(`<b style="color:#C9A84C">${m.name}</b><br/>${m.distance}`);
      marker.on('click', () => setSelected(m));
      markersRef.current.push(marker);
    });
    if (selected) leafletRef.current.setView([selected.lat, selected.lng], 16);
  };

  const fetchMosques = async (lat, lng, rad) => {
    setLoading(true); setError('');
    try {
      const query = `[out:json][timeout:25];(node["amenity"="place_of_worship"]["religion"="muslim"](around:${rad},${lat},${lng});way["amenity"="place_of_worship"]["religion"="muslim"](around:${rad},${lat},${lng}););out center;`;
      const res   = await fetch(OVERPASS_API, { method:'POST', body:`data=${encodeURIComponent(query)}` });
      const data  = await res.json();
      const list  = data.elements.map(e => ({
        id:       e.id,
        name:     e.tags?.name || e.tags?.['name:en'] || e.tags?.['name:ur'] || 'Masjid',
        lat:      e.lat || e.center?.lat,
        lng:      e.lon || e.center?.lon,
        distance: getDistance(lat, lng, e.lat||e.center?.lat, e.lon||e.center?.lon),
        direction:getBearing(lat, lng, e.lat||e.center?.lat, e.lon||e.center?.lon),
        phone:    e.tags?.phone || e.tags?.contact?.phone || '',
        website:  e.tags?.website || '',
        opening:  e.tags?.opening_hours || '',
        distNum:  parseFloat(getDistance(lat, lng, e.lat||e.center?.lat, e.lon||e.center?.lon)),
      })).filter(m => m.lat && m.lng)
        .sort((a,b) => a.distNum - b.distNum)
        .slice(0, 30);
      setMosques(list);
      if (list.length === 0) setError('No mosques found nearby. Try increasing the radius.');
    } catch { setError('Failed to load mosques. Check your connection.'); }
    setLoading(false);
  };

  const openDirections = (m) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lng}`, '_blank');
  };

  const filtered = mosques.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="mf-root" style={{ padding:'24px 28px', maxWidth:1100, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'22px 28px', marginBottom:22, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, background:'radial-gradient(ellipse,rgba(201,168,76,0.07),transparent)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:14, position:'relative' }}>
          <div style={{ width:50, height:50, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🕌</div>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:3, color:'rgba(201,168,76,0.6)', marginBottom:4 }}>NEARBY MOSQUES</div>
            <h1 className="gold-shimmer" style={{ fontSize:22, fontWeight:800, fontFamily:'Cinzel,serif' }}>Masjid Finder</h1>
            {city && <div style={{ fontSize:12, color:'rgba(242,237,228,0.4)', marginTop:2 }}>📍 {city} · {mosques.length} mosques found</div>}
          </div>
          {/* Radius selector */}
          <div style={{ marginLeft:'auto', display:'flex', gap:6 }}>
            {[1000,3000,5000,10000].map(r => (
              <button key={r} onClick={() => setRadius(r)}
                style={{ padding:'7px 12px', background:radius===r?'rgba(201,168,76,0.2)':'rgba(201,168,76,0.06)', border:`1px solid ${radius===r?'rgba(201,168,76,0.5)':'rgba(201,168,76,0.12)'}`, borderRadius:8, color:radius===r?'#C9A84C':'rgba(242,237,228,0.4)', cursor:'pointer', fontSize:11, fontFamily:'inherit', fontWeight:radius===r?700:400 }}>
                {r>=1000?`${r/1000}km`:`${r}m`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ position:'relative', marginBottom:18 }}>
        <Search size={13} color="rgba(201,168,76,0.4)" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }}/>
        <input className="mf-input" value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search mosque name..."
          style={{ width:'100%', padding:'11px 14px 11px 38px', fontSize:13 }}/>
      </div>

      {/* Map */}
      <div style={{ marginBottom:22, borderRadius:16, overflow:'hidden', position:'relative' }}>
        <div id="masjid-map" ref={mapRef}/>
        {loading && (
          <div style={{ position:'absolute', inset:0, background:'rgba(3,3,3,0.7)', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:16 }}>
            <div style={{ textAlign:'center' }}>
              <Loader size={28} color="#C9A84C" style={{ animation:'spin 1s linear infinite', marginBottom:10 }}/>
              <div style={{ color:'rgba(242,237,228,0.6)', fontSize:13 }}>Finding nearby mosques...</div>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{ background:'rgba(231,76,60,0.08)', border:'1px solid rgba(231,76,60,0.2)', borderRadius:12, padding:'14px 18px', marginBottom:18, color:'#e74c3c', fontSize:13 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Selected mosque detail */}
      {selected && (
        <div style={{ background:'linear-gradient(135deg,rgba(201,168,76,0.1),rgba(201,168,76,0.05))', border:'1px solid rgba(201,168,76,0.3)', borderRadius:16, padding:'20px', marginBottom:18, animation:'fadeUp 0.3s ease' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
            <div>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:2, color:'rgba(201,168,76,0.5)', marginBottom:4 }}>SELECTED MOSQUE</div>
              <div style={{ fontSize:16, fontWeight:700, color:'#E8C97A' }}>{selected.name}</div>
              <div style={{ fontSize:12, color:'rgba(242,237,228,0.5)', marginTop:3, display:'flex', alignItems:'center', gap:6 }}>
                <MapPin size={11}/>{selected.distance} away · {selected.direction}
              </div>
            </div>
            <button onClick={() => openDirections(selected)}
              style={{ padding:'10px 18px', background:'linear-gradient(135deg,#C9A84C,#E8C97A)', border:'none', borderRadius:10, color:'#050505', fontFamily:'Cinzel,serif', fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
              <Navigation size={13}/> Directions
            </button>
          </div>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {selected.phone && (
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(242,237,228,0.5)' }}>
                <Phone size={11} color="#C9A84C"/>{selected.phone}
              </div>
            )}
            {selected.opening && (
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, color:'rgba(242,237,228,0.5)' }}>
                <Clock size={11} color="#C9A84C"/>{selected.opening}
              </div>
            )}
            {selected.website && (
              <a href={selected.website} target="_blank" rel="noreferrer" style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'#C9A84C', textDecoration:'none' }}>
                <ExternalLink size={11}/>Website
              </a>
            )}
          </div>
        </div>
      )}

      {/* Mosque list */}
      <div>
        <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:14 }}>
          MOSQUES NEARBY ({filtered.length})
        </div>
        {loading && mosques.length === 0 ? (
          <div style={{ textAlign:'center', padding:40 }}>
            <Loader size={24} color="#C9A84C" style={{ animation:'spin 1s linear infinite' }}/>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {filtered.map((m, i) => (
              <div key={m.id} className={`mf-card ${selected?.id===m.id?'active':''}`}
                onClick={() => { setSelected(m); if(leafletRef.current) leafletRef.current.setView([m.lat,m.lng],16); }}
                style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:14, animation:`fadeUp 0.3s ${Math.min(i*0.04,0.4)}s ease both` }}>
                {/* Index */}
                <div style={{ width:36, height:36, flexShrink:0, borderRadius:10, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cinzel,serif', fontSize:13, fontWeight:700, color:'#C9A84C' }}>
                  {i+1}
                </div>
                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:'rgba(242,237,228,0.9)', marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.name}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:11, color:'rgba(242,237,228,0.4)' }}>
                    <span style={{ color:'#C9A84C', fontWeight:600 }}>{m.distance}</span>
                    <span>·</span>
                    <span>{m.direction}</span>
                    {m.opening && <><span>·</span><span>{m.opening.split(';')[0]}</span></>}
                  </div>
                </div>
                {/* Directions btn */}
                <button onClick={e => { e.stopPropagation(); openDirections(m); }}
                  style={{ padding:'8px 12px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:8, color:'#C9A84C', cursor:'pointer', fontSize:11, display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
                  <Navigation size={11}/> Go
                </button>
              </div>
            ))}
            {filtered.length === 0 && !loading && (
              <div style={{ textAlign:'center', padding:40, color:'rgba(242,237,228,0.3)' }}>
                <div style={{ fontSize:32, marginBottom:12 }}>🕌</div>
                No mosques found. Try increasing the radius.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}