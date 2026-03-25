import React, { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .ie-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { to{background-position:200% center} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .ie-card { background:#0F0F0D; border-radius:18px; transition:all 0.3s; }
  .ie-card:hover { transform:translateY(-2px); }
`;

const EVENTS_2026 = [
  { name:"Ramadan 2026 Begins",    date:"2026-02-18", emoji:"🌙", color:"#C9A84C",  desc:"The blessed month of fasting begins. May Allah accept our worship.", hijri:"1 Ramadan 1447 AH", tag:"Major" },
  { name:"Laylatul Qadr",          date:"2026-03-15", emoji:"💫", color:"#E8C97A",  desc:"The Night of Power — worship on this night equals 1000 months of worship.", hijri:"27 Ramadan 1447 AH", tag:"Major" },
  { name:"Eid ul-Fitr 2026",       date:"2026-03-20", emoji:"🎉", color:"#2ecc71",  desc:"Eid Mubarak! Celebrate the end of Ramadan with family and community.", hijri:"1 Shawwal 1447 AH", tag:"Eid" },
  { name:"Hajj 2026 Begins",       date:"2026-05-27", emoji:"🕋", color:"#C9A84C",  desc:"Annual pilgrimage to the Holy City of Makkah begins.", hijri:"8 Dhul Hijjah 1447 AH", tag:"Major" },
  { name:"Day of Arafah 2026",     date:"2026-05-28", emoji:"🤲", color:"#E8C97A",  desc:"The greatest day of the year. Fasting is highly recommended for non-pilgrims.", hijri:"9 Dhul Hijjah 1447 AH", tag:"Important" },
  { name:"Eid ul-Adha 2026",       date:"2026-05-29", emoji:"🎊", color:"#2ecc71",  desc:"Festival of Sacrifice — commemorating Ibrahim's (AS) devotion to Allah.", hijri:"10 Dhul Hijjah 1447 AH", tag:"Eid" },
  { name:"Islamic New Year 1448",  date:"2026-06-17", emoji:"🌙", color:"#8E44AD",  desc:"The Hijri new year begins. Reflect on the past year and set new goals.", hijri:"1 Muharram 1448 AH", tag:"New Year" },
  { name:"Ashura 1448",            date:"2026-06-26", emoji:"🤲", color:"#1A5276",  desc:"Day of fasting. Commemorates the day Musa (AS) was saved from Pharaoh.", hijri:"10 Muharram 1448 AH", tag:"Important" },
  { name:"Mawlid al-Nabi ﷺ 1448", date:"2026-09-05", emoji:"⭐", color:"#D4AF37",  desc:"Celebration of the birth of Prophet Muhammad ﷺ.", hijri:"12 Rabi al-Awwal 1448 AH", tag:"Mawlid" },
  { name:"Isra Wal Miraj 1448",    date:"2026-11-14", emoji:"✨", color:"#8E44AD",  desc:"The miraculous Night Journey of Prophet Muhammad ﷺ to heavens.", hijri:"27 Rajab 1448 AH", tag:"Important" },
  { name:"Shab-e-Barat 1448",      date:"2026-12-22", emoji:"🌟", color:"#6B48C4",  desc:"Night of forgiveness — many Muslims spend this night in prayer and dhikr.", hijri:"15 Shaban 1448 AH", tag:"Important" },
];

const TAG_COLORS = { Major:'#C9A84C', Eid:'#2ecc71', Important:'#8E44AD', 'New Year':'#E8C97A', Mawlid:'#D4AF37' };

export default function IslamicEvents() {
  const [reminders, setReminders] = useState(() => { try { return JSON.parse(localStorage.getItem('ie_reminders')||'[]'); } catch { return []; }});
  const [filter, setFilter]       = useState('all');

  const today     = new Date(); today.setHours(0,0,0,0);
  const getDays   = (dateStr) => { const d=new Date(dateStr); d.setHours(0,0,0,0); return Math.round((d-today)/(86400000)); };
  const toggleReminder = (name) => {
    const next = reminders.includes(name) ? reminders.filter(r=>r!==name) : [...reminders, name];
    setReminders(next);
    try { localStorage.setItem('ie_reminders', JSON.stringify(next)); } catch {}
  };

  const tags    = ['all', ...new Set(EVENTS_2026.map(e=>e.tag))];
  const sorted  = [...EVENTS_2026].sort((a,b) => getDays(a.date) - getDays(b.date));
  const filtered= filter==='all' ? sorted : sorted.filter(e=>e.tag===filter);
  const upcoming= sorted.filter(e => getDays(e.date) >= 0).slice(0,1)[0];

  return (
    <div className="ie-root" style={{ padding:'24px 28px', maxWidth:900, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'22px 28px', marginBottom:22, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at top right, rgba(201,168,76,0.06) 0%, transparent 60%)', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:14, position:'relative' }}>
          <div style={{ width:50, height:50, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🌙</div>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:3, color:'rgba(201,168,76,0.6)', marginBottom:4 }}>HIJRI EVENTS</div>
            <h1 className="gold-shimmer" style={{ fontSize:22, fontWeight:800, fontFamily:'Cinzel,serif' }}>Islamic Events 2026</h1>
            <p style={{ fontSize:12, color:'rgba(242,237,228,0.4)', marginTop:2 }}>{EVENTS_2026.length} events · {reminders.length} reminders set</p>
          </div>
          {upcoming && (
            <div style={{ marginLeft:'auto', textAlign:'center', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:14, padding:'12px 18px' }}>
              <div style={{ fontSize:20 }}>{upcoming.emoji}</div>
              <div style={{ fontSize:12, fontWeight:700, color:'#C9A84C', marginTop:4 }}>{upcoming.name}</div>
              <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)' }}>
                {getDays(upcoming.date)===0?'Today!':getDays(upcoming.date)===1?'Tomorrow':`in ${getDays(upcoming.date)} days`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter tags */}
      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:2 }}>
        {tags.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{ padding:'7px 14px', background:filter===t?'rgba(201,168,76,0.15)':'rgba(201,168,76,0.04)', border:`1px solid ${filter===t?'rgba(201,168,76,0.4)':'rgba(201,168,76,0.1)'}`, borderRadius:20, color:filter===t?'#C9A84C':'rgba(242,237,228,0.5)', cursor:'pointer', fontSize:11, fontWeight:filter===t?700:400, fontFamily:'inherit', whiteSpace:'nowrap' }}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
          </button>
        ))}
      </div>

      {/* Events list */}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {filtered.map((e, i) => {
          const days        = getDays(e.date);
          const isPast      = days < 0;
          const isToday     = days === 0;
          const hasReminder = reminders.includes(e.name);
          return (
            <div key={e.name} className="ie-card"
              style={{ border:`1px solid ${isToday?e.color+'55':isPast?'rgba(255,255,255,0.05)':e.color+'22'}`, padding:'18px 20px', opacity:isPast?0.5:1, animation:`fadeUp 0.3s ${i*0.05}s ease both` }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                {/* Emoji */}
                <div style={{ width:46, height:46, flexShrink:0, borderRadius:12, background:`${e.color}15`, border:`1px solid ${e.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{e.emoji}</div>

                {/* Info */}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                    <span style={{ fontSize:15, fontWeight:700, color:isPast?'rgba(242,237,228,0.5)':'rgba(242,237,228,0.9)' }}>{e.name}</span>
                    <div style={{ background:`${TAG_COLORS[e.tag]||'#C9A84C'}20`, border:`1px solid ${TAG_COLORS[e.tag]||'#C9A84C'}35`, borderRadius:5, padding:'2px 7px', fontSize:9, color:TAG_COLORS[e.tag]||'#C9A84C', fontWeight:600, letterSpacing:0.5 }}>{e.tag.toUpperCase()}</div>
                  </div>
                  <div style={{ fontSize:12, color:'rgba(242,237,228,0.45)', lineHeight:1.6, marginBottom:8 }}>{e.desc}</div>
                  <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                    <div style={{ fontSize:11, color:'rgba(201,168,76,0.6)' }}>📅 {new Date(e.date).toLocaleDateString('en-US',{weekday:'short',month:'long',day:'numeric',year:'numeric'})}</div>
                    <div style={{ fontSize:11, color:'rgba(201,168,76,0.45)' }}>🌙 {e.hijri}</div>
                  </div>
                </div>

                {/* Days badge + reminder */}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, flexShrink:0 }}>
                  <div style={{ background: isToday?`${e.color}25`:isPast?'rgba(255,255,255,0.06)':e.color+'15', border:`1px solid ${isToday?e.color+'55':isPast?'rgba(255,255,255,0.08)':e.color+'30'}`, borderRadius:8, padding:'5px 10px', fontFamily:'Cinzel,serif', fontSize:12, fontWeight:700, color:isToday?e.color:isPast?'rgba(242,237,228,0.3)':e.color, textAlign:'center', minWidth:70 }}>
                    {isPast ? 'Past' : isToday ? '🎉 Today' : days===1?'Tomorrow':`${days} days`}
                  </div>
                  <button onClick={() => toggleReminder(e.name)}
                    style={{ padding:'6px 10px', background:hasReminder?'rgba(201,168,76,0.15)':'rgba(255,255,255,0.04)', border:`1px solid ${hasReminder?'rgba(201,168,76,0.4)':'rgba(255,255,255,0.08)'}`, borderRadius:8, cursor:'pointer', color:hasReminder?'#C9A84C':'rgba(242,237,228,0.3)', display:'flex', alignItems:'center', gap:5, fontSize:11 }}>
                    {hasReminder ? <><Bell size={11}/> Set</> : <><BellOff size={11}/> Remind</>}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop:20, background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:14, padding:'16px 20px', textAlign:'center' }}>
        <div className="arabic" style={{ fontSize:14, color:'rgba(201,168,76,0.7)', marginBottom:6 }}>شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ</div>
        <div style={{ fontSize:12, color:'rgba(242,237,228,0.3)', fontStyle:'italic' }}>"The month of Ramadan in which the Quran was revealed." — Quran 2:185</div>
      </div>
    </div>
  );
}