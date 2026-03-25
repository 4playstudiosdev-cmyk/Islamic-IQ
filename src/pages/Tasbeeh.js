/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Plus, X } from 'lucide-react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .ts-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes shimmer  { to{background-position:200% center} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ripple   { 0%{transform:scale(0);opacity:0.6} 100%{transform:scale(4);opacity:0} }
  @keyframes pop      { 0%{transform:scale(1)} 40%{transform:scale(0.94)} 100%{transform:scale(1)} }
  @keyframes glow     { 0%,100%{box-shadow:0 0 20px rgba(201,168,76,0.2)} 50%{box-shadow:0 0 50px rgba(201,168,76,0.5)} }
  @keyframes celebrate{ 0%{transform:scale(1)} 30%{transform:scale(1.12)} 70%{transform:scale(0.96)} 100%{transform:scale(1)} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .tap-btn { cursor:pointer; user-select:none; -webkit-user-select:none; -webkit-tap-highlight-color:transparent; transition:all 0.15s; border:none; background:none; padding:0; }
  .tap-btn:active { transform:scale(0.96); }
  .ts-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:16px; }
`;

const PRESETS = [
  { id:'subhanallah',    arabic:'سُبْحَانَ اللَّهِ',    name:'Subhanallah',    target:33,  color:'#2E8B57' },
  { id:'alhamdulillah',  arabic:'الْحَمْدُ لِلَّهِ',    name:'Alhamdulillah',  target:33,  color:'#C9A84C' },
  { id:'allahuakbar',    arabic:'اللَّهُ أَكْبَرُ',     name:'Allahu Akbar',   target:34,  color:'#8E44AD' },
  { id:'lailaha',        arabic:'لَا إِلَهَ إِلَّا اللَّهُ', name:'La ilaha illallah', target:100, color:'#1A5276' },
  { id:'astaghfirullah', arabic:'أَسْتَغْفِرُ اللَّهَ', name:'Astaghfirullah', target:100, color:'#D35400' },
  { id:'salawat',        arabic:'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', name:'Salawat', target:100, color:'#B7950B' },
];

const TODAY = () => new Date().toISOString().split('T')[0];

function loadCounts() { try { return JSON.parse(localStorage.getItem('tasbeeh_counts')||'{}'); } catch { return {}; } }
function saveCounts(d) { try { localStorage.setItem('tasbeeh_counts', JSON.stringify(d)); } catch {} }

export default function Tasbeeh() {
  const [selected, setSelected]   = useState(PRESETS[0]);
  const [counts, setCounts]       = useState(loadCounts);
  const [vibrate, setVibrate]     = useState(true);
  const [ripples, setRipples]     = useState([]);
  const [celebrated, setCelebrated] = useState(false);
  const [custom, setCustom]       = useState(() => { try { return JSON.parse(localStorage.getItem('tasbeeh_custom')||'[]'); } catch { return []; }});
  const [addingCustom, setAddingCustom] = useState(false);
  const [newName, setNewName]     = useState('');
  const [newArabic, setNewArabic] = useState('');
  const [newTarget, setNewTarget] = useState(33);
  const rippleId = useRef(0);

  const today   = TODAY();
  const allItems= [...PRESETS, ...custom];
  const countKey= `${selected.id}_${today}`;
  const count   = counts[countKey] || 0;
  const target  = selected.target || 33;
  const pct     = Math.min((count / target) * 100, 100);
  const laps    = Math.floor(count / target);

  const tap = (e) => {
    const newCount = count + 1;
    const newCounts = { ...counts, [countKey]: newCount };
    setCounts(newCounts);
    saveCounts(newCounts);

    // Vibration
    if (vibrate && navigator.vibrate) {
      navigator.vibrate(newCount % target === 0 ? [50, 30, 50] : 18);
    }

    // Ripple
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleId.current++;
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(rr => rr.id !== id)), 700);

    // Celebrate at target
    if (newCount % target === 0) {
      setCelebrated(true);
      setTimeout(() => setCelebrated(false), 1000);
    }
  };

  const reset = () => {
    const newCounts = { ...counts, [countKey]: 0 };
    setCounts(newCounts);
    saveCounts(newCounts);
    setCelebrated(false);
  };

  const addCustom = () => {
    if (!newName.trim()) return;
    const item = { id: `custom_${Date.now()}`, name: newName.trim(), arabic: newArabic.trim(), target: newTarget, color: '#C9A84C' };
    const next = [...custom, item];
    setCustom(next);
    try { localStorage.setItem('tasbeeh_custom', JSON.stringify(next)); } catch {}
    setNewName(''); setNewArabic(''); setAddingCustom(false);
    setSelected(item);
  };

  const removeCustom = (id) => {
    const next = custom.filter(c => c.id !== id);
    setCustom(next);
    try { localStorage.setItem('tasbeeh_custom', JSON.stringify(next)); } catch {}
    if (selected.id === id) setSelected(PRESETS[0]);
  };

  const totalToday = allItems.reduce((s, item) => s + (counts[`${item.id}_${today}`] || 0), 0);

  return (
    <div className="ts-root" style={{ padding: '24px 28px', maxWidth: 600, margin: '0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#050505,#0F0F0D)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 20, padding: '22px 28px', marginBottom: 22, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: 'radial-gradient(ellipse,rgba(201,168,76,0.07),transparent)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <div style={{ width: 50, height: 50, background: 'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📿</div>
          <div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 3, color: 'rgba(201,168,76,0.6)', marginBottom: 4 }}>DIGITAL TASBEEH</div>
            <h1 className="gold-shimmer" style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Cinzel,serif' }}>Tasbeeh Counter</h1>
            <p style={{ fontSize: 12, color: 'rgba(242,237,228,0.4)', marginTop: 2 }}>Today's total: {totalToday.toLocaleString()} dhikr</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'rgba(242,237,228,0.4)' }}>Vibrate</span>
            <div onClick={() => setVibrate(v => !v)} style={{ width: 40, height: 22, borderRadius: 11, background: vibrate ? '#C9A84C' : 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative', transition: 'all 0.3s' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, left: vibrate ? 20 : 2, transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Dhikr selector */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 22, paddingBottom: 4 }}>
        {allItems.map(item => (
          <button key={item.id} onClick={() => setSelected(item)}
            style={{ flexShrink: 0, padding: '8px 14px', background: selected.id === item.id ? `${item.color}20` : 'rgba(201,168,76,0.04)', border: `1px solid ${selected.id === item.id ? item.color + '55' : 'rgba(201,168,76,0.1)'}`, borderRadius: 10, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, position: 'relative' }}>
            <div className="arabic" style={{ fontSize: 14, color: selected.id === item.id ? item.color : 'rgba(201,168,76,0.5)' }}>{item.arabic || item.name}</div>
            <div style={{ fontSize: 10, color: selected.id === item.id ? 'rgba(242,237,228,0.7)' : 'rgba(242,237,228,0.3)', whiteSpace: 'nowrap' }}>{item.name}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: selected.id === item.id ? item.color : 'rgba(242,237,228,0.25)' }}>{counts[`${item.id}_${today}`] || 0}</div>
            {item.id.startsWith('custom_') && (
              <div onClick={e => { e.stopPropagation(); removeCustom(item.id); }} style={{ position: 'absolute', top: -5, right: -5, width: 16, height: 16, borderRadius: '50%', background: '#e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 9 }}>✕</div>
            )}
          </button>
        ))}
        <button onClick={() => setAddingCustom(true)} style={{ flexShrink: 0, padding: '8px 14px', background: 'rgba(201,168,76,0.04)', border: '1px dashed rgba(201,168,76,0.2)', borderRadius: 10, cursor: 'pointer', color: 'rgba(201,168,76,0.5)', fontSize: 20 }}>+</button>
      </div>

      {/* Main tap area */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        {/* Arabic text */}
        <div className="arabic" style={{ fontSize: 32, color: selected.color, marginBottom: 8, lineHeight: 1.6 }}>{selected.arabic}</div>
        <div style={{ fontFamily: 'Cinzel,serif', fontSize: 16, color: 'rgba(242,237,228,0.6)', marginBottom: 24 }}>{selected.name}</div>

        {/* Circular progress + tap button */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
          {/* SVG ring */}
          <svg width={260} height={260} style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}>
            <circle cx={130} cy={130} r={118} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={10} />
            <circle cx={130} cy={130} r={118} fill="none" stroke={selected.color} strokeWidth={10}
              strokeDasharray={2 * Math.PI * 118}
              strokeDashoffset={2 * Math.PI * 118 * (1 - pct / 100)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.3s ease' }} />
          </svg>

          {/* Tap button */}
          <button className="tap-btn" onClick={tap}
            style={{ width: 260, height: 260, borderRadius: '50%', background: `radial-gradient(circle at 40% 35%, ${selected.color}22, ${selected.color}08)`, border: `2px solid ${selected.color}33`, position: 'relative', overflow: 'hidden', animation: celebrated ? 'celebrate 0.6s ease' : `glow 3s ease-in-out infinite` }}>

            {/* Ripples */}
            {ripples.map(r => (
              <div key={r.id} style={{ position: 'absolute', left: r.x - 20, top: r.y - 20, width: 40, height: 40, borderRadius: '50%', background: selected.color, opacity: 0.3, animation: 'ripple 0.7s ease-out forwards', pointerEvents: 'none' }} />
            ))}

            {/* Count */}
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 72, fontWeight: 900, color: celebrated ? '#2ecc71' : selected.color, lineHeight: 1, transition: 'color 0.3s', animation: 'pop 0.15s ease' }}>
              {count % target || (count > 0 && count % target === 0 ? target : 0)}
            </div>
            {laps > 0 && <div style={{ fontSize: 13, color: 'rgba(242,237,228,0.5)', marginTop: 6 }}>× {laps} laps</div>}
            <div style={{ fontSize: 12, color: 'rgba(242,237,228,0.35)', marginTop: 4 }}>of {target}</div>

            {/* Celebrate text */}
            {celebrated && (
              <div style={{ position: 'absolute', bottom: 40, left: 0, right: 0, fontSize: 13, color: '#2ecc71', fontWeight: 700, fontFamily: 'Cinzel,serif' }}>
                SubhanAllah! 🌟
              </div>
            )}
          </button>
        </div>

        {/* Total count */}
        <div style={{ fontFamily: 'Cinzel,serif', fontSize: 28, fontWeight: 700, color: selected.color, marginBottom: 4 }}>
          {count.toLocaleString()}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(242,237,228,0.35)', letterSpacing: 2 }}>TOTAL COUNT</div>

        {/* Reset */}
        <button onClick={reset} style={{ marginTop: 16, padding: '10px 24px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: 'rgba(242,237,228,0.35)', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      {/* Today's summary */}
      <div className="ts-card" style={{ padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.5)', letterSpacing: 2, fontFamily: 'Cinzel,serif', marginBottom: 14 }}>TODAY'S SUMMARY</div>
        {allItems.map(item => {
          const c = counts[`${item.id}_${today}`] || 0;
          if (!c) return null;
          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div className="arabic" style={{ width: 100, fontSize: 13, color: item.color, flexShrink: 0 }}>{item.name}</div>
              <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min((c / item.target) * 100, 100)}%`, background: item.color, borderRadius: 3, transition: 'width 0.5s' }} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: item.color, minWidth: 50, textAlign: 'right' }}>{c.toLocaleString()}</div>
            </div>
          );
        })}
        {allItems.every(item => !(counts[`${item.id}_${today}`] || 0)) && (
          <div style={{ textAlign: 'center', color: 'rgba(242,237,228,0.3)', fontSize: 13 }}>Start tapping above to count your dhikr 📿</div>
        )}
      </div>

      {/* Add custom */}
      {addingCustom && (
        <div className="ts-card" style={{ padding: '20px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.5)', letterSpacing: 2, fontFamily: 'Cinzel,serif', marginBottom: 14 }}>ADD CUSTOM DHIKR</div>
          {[
            { label: 'Name', val: newName, set: setNewName, ph: 'e.g. Durood Ibrahim' },
            { label: 'Arabic Text (optional)', val: newArabic, set: setNewArabic, ph: 'اللَّهُمَّ صَلِّ عَلَى...' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'rgba(242,237,228,0.4)', marginBottom: 5 }}>{f.label}</div>
              <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                style={{ width: '100%', padding: '10px 14px', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 10, color: '#F2EDE4', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: 'rgba(242,237,228,0.4)', marginBottom: 8 }}>TARGET</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[33, 99, 100, 500, 1000].map(t => (
                <button key={t} onClick={() => setNewTarget(t)}
                  style={{ flex: 1, padding: '8px 4px', background: newTarget === t ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${newTarget === t ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 8, color: newTarget === t ? '#C9A84C' : 'rgba(242,237,228,0.4)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addCustom} style={{ flex: 1, padding: '11px', background: 'linear-gradient(135deg,#C9A84C,#E8C97A)', border: 'none', borderRadius: 10, color: '#050505', fontFamily: 'Cinzel,serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Add</button>
            <button onClick={() => setAddingCustom(false)} style={{ padding: '11px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, color: 'rgba(242,237,228,0.5)', cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 8, background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 14, padding: '14px 20px', textAlign: 'center' }}>
        <div className="arabic" style={{ fontSize: 14, color: 'rgba(201,168,76,0.7)', marginBottom: 6 }}>أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ</div>
        <div style={{ fontSize: 12, color: 'rgba(242,237,228,0.3)', fontStyle: 'italic' }}>"Verily in the remembrance of Allah do hearts find rest." — 13:28</div>
      </div>
    </div>
  );
}