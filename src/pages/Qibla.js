/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { useLocation as useAppLocation } from '../context/LocationContext';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .qb-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes shimmer  { to{background-position:200% center} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes pulse    { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.08)} }
  @keyframes glow     { 0%,100%{filter:drop-shadow(0 0 8px rgba(201,168,76,0.4))} 50%{filter:drop-shadow(0 0 24px rgba(201,168,76,0.9))} }
  @keyframes needleGlow { 0%,100%{filter:drop-shadow(0 0 4px rgba(231,76,60,0.6))} 50%{filter:drop-shadow(0 0 16px rgba(231,76,60,1))} }
  @keyframes qiblaGlow  { 0%,100%{filter:drop-shadow(0 0 6px rgba(46,204,113,0.6))} 50%{filter:drop-shadow(0 0 20px rgba(46,204,113,1))} }
  @keyframes rotate360  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .compass-wrap { transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); }
`;

// ── Haversine formula — bearing to Makkah ─────────────────────
function getBearing(lat1, lng1, lat2, lng2) {
  const toRad = d => d * Math.PI / 180;
  const toDeg = r => r * 180 / Math.PI;
  const dLng  = toRad(lng2 - lng1);
  const rLat1 = toRad(lat1);
  const rLat2 = toRad(lat2);
  const y = Math.sin(dLng) * Math.cos(rLat2);
  const x = Math.cos(rLat1)*Math.sin(rLat2) - Math.sin(rLat1)*Math.cos(rLat2)*Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

function getDistance(lat1, lng1, lat2, lng2) {
  const R   = 6371;
  const dLat = (lat2-lat1) * Math.PI/180;
  const dLng = (lng2-lng1) * Math.PI/180;
  const a   = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
}

// Makkah coordinates
const MAKKAH = { lat: 21.4225, lng: 39.8262 };

export default function Qibla() {
  const { coords, city }  = useAppLocation();
  const [heading, setHeading]   = useState(0);   // device compass heading
  const [qiblaDir, setQiblaDir] = useState(null); // bearing to Makkah
  const [distance, setDistance] = useState(null);
  const [permission, setPermission] = useState('prompt'); // 'prompt'|'granted'|'denied'
  const [hasCompass, setHasCompass] = useState(false);
  const [manualHeading, setManualHeading] = useState(0);
  const [useManual, setUseManual] = useState(false);
  const headingRef = useRef(0);

  // Calculate Qibla direction when coords available
  useEffect(() => {
    if (coords?.lat && coords?.lng) {
      const bearing = getBearing(coords.lat, coords.lng, MAKKAH.lat, MAKKAH.lng);
      const dist    = getDistance(coords.lat, coords.lng, MAKKAH.lat, MAKKAH.lng);
      setQiblaDir(Math.round(bearing));
      setDistance(dist);
    }
  }, [coords]);

  // Request compass permission + start listening
  useEffect(() => {
    requestCompass();
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const handleOrientation = (e) => {
    let h = null;
    if (e.absolute && e.alpha !== null) {
      h = 360 - e.alpha;
    } else if (e.webkitCompassHeading !== undefined) {
      h = e.webkitCompassHeading; // iOS
    } else if (e.alpha !== null) {
      h = 360 - e.alpha;
    }
    if (h !== null) {
      headingRef.current = h;
      setHeading(Math.round(h));
      setHasCompass(true);
    }
  };

  const requestCompass = async () => {
    // iOS 13+ requires permission
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        setPermission(result);
        if (result === 'granted') startListening();
      } catch { setPermission('denied'); }
    } else {
      // Android / Desktop
      setPermission('granted');
      startListening();
    }
  };

  const startListening = () => {
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);
  };

  // Compass needle rotation — how much to rotate compass rose
  // When device faces North, heading=0, compass shows N at top
  // Compass rose rotates by -heading so N stays relative to device
  const compassRotation = -heading;

  // Qibla needle angle relative to compass
  // If qibla is at 270° and device faces 0° (North), needle points at 270°
  const qiblaNeedleAngle = qiblaDir !== null ? qiblaDir - heading : 0;

  // How close are we to Qibla direction?
  const diff = qiblaDir !== null ? Math.abs(((qiblaDir - heading + 540) % 360) - 180) : 999;
  const aligned = diff < 5;

  const cardinalDir = (deg) => {
    const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return dirs[Math.round(deg/22.5) % 16];
  };

  return (
    <div className="qb-root" style={{ padding:'24px 28px', maxWidth:700, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'22px 28px', marginBottom:22, position:'relative', overflow:'hidden', animation:'fadeUp 0.5s ease' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, background:'radial-gradient(ellipse,rgba(201,168,76,0.07),transparent)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:14, position:'relative' }}>
          <div style={{ width:50, height:50, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>🧭</div>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:3, color:'rgba(201,168,76,0.6)', marginBottom:4 }}>DIRECTION OF PRAYER</div>
            <h1 className="gold-shimmer" style={{ fontSize:22, fontWeight:800, fontFamily:'Cinzel,serif' }}>Qibla Compass</h1>
            {city && <div style={{ fontSize:12, color:'rgba(242,237,228,0.4)', marginTop:2 }}>📍 {city}</div>}
          </div>
          {qiblaDir && (
            <div style={{ marginLeft:'auto', textAlign:'center', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:12, padding:'10px 16px' }}>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:20, fontWeight:700, color:'#C9A84C' }}>{qiblaDir}°</div>
              <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:1 }}>QIBLA</div>
            </div>
          )}
        </div>
      </div>

      {/* Permission request */}
      {permission === 'prompt' && (
        <div style={{ background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:16, padding:'20px', marginBottom:20, textAlign:'center' }}>
          <div style={{ fontSize:32, marginBottom:10 }}>🧭</div>
          <div style={{ fontSize:14, fontWeight:600, color:'#E8C97A', marginBottom:6 }}>Compass Permission Needed</div>
          <p style={{ fontSize:12, color:'rgba(242,237,228,0.45)', marginBottom:16 }}>Allow device orientation to use the live compass</p>
          <button onClick={requestCompass}
            style={{ padding:'11px 28px', background:'linear-gradient(135deg,#C9A84C,#E8C97A)', border:'none', borderRadius:10, color:'#050505', fontFamily:'Cinzel,serif', fontSize:13, fontWeight:700, cursor:'pointer', letterSpacing:1 }}>
            Enable Compass
          </button>
        </div>
      )}

      {/* Aligned alert */}
      {aligned && qiblaDir !== null && (
        <div style={{ background:'rgba(46,204,113,0.1)', border:'1px solid rgba(46,204,113,0.3)', borderRadius:14, padding:'14px 20px', marginBottom:20, textAlign:'center', animation:'pulse 1.5s ease-in-out infinite' }}>
          <div style={{ fontSize:20, marginBottom:4 }}>✅</div>
          <div style={{ fontSize:14, fontWeight:700, color:'#2ecc71' }}>Facing Qibla!</div>
          <div style={{ fontSize:12, color:'rgba(46,204,113,0.7)' }}>You are facing the direction of the Kaaba</div>
        </div>
      )}

      {/* ── COMPASS ─────────────────────────────────────── */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:24 }}>
        <div style={{ position:'relative', width:320, height:320 }}>

          {/* Outer ring */}
          <svg viewBox="0 0 320 320" style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
            {/* Outer circle */}
            <circle cx="160" cy="160" r="155" fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="1"/>
            <circle cx="160" cy="160" r="148" fill="none" stroke="rgba(201,168,76,0.06)" strokeWidth="8"/>
            {/* Degree marks */}
            {Array.from({length:72}).map((_,i) => {
              const angle  = (i*5 - 90) * Math.PI/180;
              const isMajor= i%6===0;
              const r1 = isMajor ? 138 : 142;
              const r2 = 148;
              return (
                <line key={i}
                  x1={160+r1*Math.cos(angle)} y1={160+r1*Math.sin(angle)}
                  x2={160+r2*Math.cos(angle)} y2={160+r2*Math.sin(angle)}
                  stroke={isMajor?'rgba(201,168,76,0.5)':'rgba(201,168,76,0.2)'}
                  strokeWidth={isMajor?1.5:0.8}/>
              );
            })}
          </svg>

          {/* Rotating compass rose */}
          <div className="compass-wrap" style={{ position:'absolute', inset:0, transform:`rotate(${compassRotation}deg)` }}>
            <svg viewBox="0 0 320 320" style={{ width:'100%', height:'100%' }}>
              {/* Compass background */}
              <circle cx="160" cy="160" r="130" fill="rgba(10,10,8,0.95)" stroke="rgba(201,168,76,0.15)" strokeWidth="1"/>

              {/* Cardinal directions */}
              {[
                { label:'N', angle:0,   color:'#e74c3c', size:18 },
                { label:'S', angle:180, color:'rgba(242,237,228,0.6)', size:14 },
                { label:'E', angle:90,  color:'rgba(201,168,76,0.7)', size:14 },
                { label:'W', angle:270, color:'rgba(201,168,76,0.7)', size:14 },
              ].map(d => {
                const rad = (d.angle - 90) * Math.PI/180;
                const r   = 105;
                return (
                  <text key={d.label}
                    x={160+r*Math.cos(rad)}
                    y={160+r*Math.sin(rad)+5}
                    textAnchor="middle"
                    fontSize={d.size} fontWeight="700"
                    fill={d.color}
                    fontFamily="Cinzel,serif"
                    style={{ userSelect:'none' }}>
                    {d.label}
                  </text>
                );
              })}

              {/* Intercardinal */}
              {[
                {label:'NE',angle:45},{label:'SE',angle:135},
                {label:'SW',angle:225},{label:'NW',angle:315}
              ].map(d => {
                const rad = (d.angle-90)*Math.PI/180;
                const r   = 90;
                return (
                  <text key={d.label} x={160+r*Math.cos(rad)} y={160+r*Math.sin(rad)+4}
                    textAnchor="middle" fontSize="10" fill="rgba(242,237,228,0.3)"
                    fontFamily="Cinzel,serif" style={{ userSelect:'none' }}>
                    {d.label}
                  </text>
                );
              })}

              {/* Degree marks on rose */}
              {Array.from({length:36}).map((_,i) => {
                const angle = (i*10-90)*Math.PI/180;
                const r1=118; const r2=125;
                return (
                  <line key={i}
                    x1={160+r1*Math.cos(angle)} y1={160+r1*Math.sin(angle)}
                    x2={160+r2*Math.cos(angle)} y2={160+r2*Math.sin(angle)}
                    stroke="rgba(201,168,76,0.25)" strokeWidth="1"/>
                );
              })}

              {/* North triangle on rose */}
              <polygon points="160,32 154,58 166,58" fill="#e74c3c" opacity="0.9"
                style={{ filter:'drop-shadow(0 0 6px rgba(231,76,60,0.8))' }}/>
              <polygon points="160,128 154,58 166,58" fill="rgba(231,76,60,0.3)"/>
            </svg>
          </div>

          {/* Qibla needle — fixed, rotates to point at Qibla */}
          {qiblaDir !== null && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
              <svg viewBox="0 0 320 320" style={{ width:'100%', height:'100%', position:'absolute' }}>
                <g transform={`rotate(${qiblaNeedleAngle}, 160, 160)`}
                   style={{ filter:'drop-shadow(0 0 8px rgba(46,204,113,0.8))' }}>
                  {/* Qibla needle — green */}
                  <polygon points="160,50 154,160 166,160" fill="#2ecc71" opacity="0.95"/>
                  <polygon points="160,270 154,160 166,160" fill="rgba(46,204,113,0.3)"/>
                  {/* Kaaba icon at tip */}
                  <rect x="153" y="36" width="14" height="14" rx="2" fill="#2ecc71" opacity="0.9"/>
                  <text x="160" y="47" textAnchor="middle" fontSize="9" fill="white">🕋</text>
                </g>
              </svg>
            </div>
          )}

          {/* Center dot */}
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
            <div style={{ width:20, height:20, borderRadius:'50%', background:'linear-gradient(135deg,#C9A84C,#E8C97A)', boxShadow:'0 0 16px rgba(201,168,76,0.6)', zIndex:10 }}/>
          </div>

          {/* Current heading display */}
          <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:'rgba(5,5,5,0.9)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:8, padding:'3px 10px', fontFamily:'Cinzel,serif', fontSize:12, color:'#C9A84C', whiteSpace:'nowrap' }}>
            {Math.round(heading)}° {cardinalDir(heading)}
          </div>
        </div>

        {/* No compass fallback */}
        {!hasCompass && permission === 'granted' && (
          <div style={{ marginTop:16, fontSize:12, color:'rgba(242,237,228,0.35)', textAlign:'center' }}>
            <div style={{ marginBottom:8 }}>📱 No compass detected. Use manual rotation:</div>
            <div style={{ display:'flex', alignItems:'center', gap:10, justifyContent:'center' }}>
              <button onClick={() => setHeading(h => (h-5+360)%360)}
                style={{ padding:'8px 16px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:8, color:'#C9A84C', cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>◀ 5°</button>
              <span style={{ fontFamily:'Cinzel,serif', fontSize:16, color:'#C9A84C', minWidth:60, textAlign:'center' }}>{heading}°</span>
              <button onClick={() => setHeading(h => (h+5)%360)}
                style={{ padding:'8px 16px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:8, color:'#C9A84C', cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>5° ▶</button>
            </div>
          </div>
        )}
      </div>

      {/* ── Info cards ───────────────────────────────────── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:12, marginBottom:20 }}>
        {[
          { label:'YOUR HEADING',  val:`${Math.round(heading)}°`,    sub:cardinalDir(heading), icon:'🧭' },
          { label:'QIBLA BEARING', val: qiblaDir?`${qiblaDir}°`:'--', sub:'from North',          icon:'🕋' },
          { label:'DISTANCE',      val: distance?`${distance.toLocaleString()}`:'--', sub:'kilometers', icon:'📏' },
          { label:'ACCURACY',      val: aligned?'On Point':diff<15?'Close':'Rotate', sub: `${Math.round(diff)}° off`, icon: aligned?'✅':diff<15?'⚠️':'🔄' },
        ].map((c,i) => (
          <div key={i} style={{ background:'#0F0F0D', border:`1px solid ${i===3&&aligned?'rgba(46,204,113,0.3)':'rgba(201,168,76,0.1)'}`, borderRadius:14, padding:'14px 16px', animation:`fadeUp 0.4s ${i*0.08}s ease both` }}>
            <div style={{ fontSize:20, marginBottom:6 }}>{c.icon}</div>
            <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:1.5, fontFamily:'Cinzel,serif', marginBottom:4 }}>{c.label}</div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:18, fontWeight:700, color: i===3&&aligned?'#2ecc71':'#C9A84C' }}>{c.val}</div>
            <div style={{ fontSize:10, color:'rgba(242,237,228,0.3)', marginTop:2 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Quran verse */}
      <div style={{ background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:14, padding:'16px 20px', textAlign:'center' }}>
        <div className="arabic" style={{ fontSize:15, color:'rgba(201,168,76,0.7)', marginBottom:6, direction:'rtl', lineHeight:2 }}>
          فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ
        </div>
        <div style={{ fontSize:12, color:'rgba(242,237,228,0.3)', fontStyle:'italic' }}>
          "Turn your face toward the Sacred Mosque." — Quran 2:144
        </div>
      </div>
    </div>
  );
}