/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .ic-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { to{background-position:200% center} }
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes countdown { 0%,100%{opacity:0.7} 50%{opacity:1} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .ic-day { background:#0F0F0D; border:1px solid rgba(201,168,76,0.06); border-radius:10px; transition:all 0.2s; cursor:pointer; aspect-ratio:1; }
  .ic-day:hover { border-color:rgba(201,168,76,0.25); }
  .ic-day.today { border-color:#C9A84C; background:rgba(201,168,76,0.1); }
  .ic-day.event { border-color:rgba(46,204,113,0.3); background:rgba(46,204,113,0.06); }
  .ic-day.selected { border-color:rgba(201,168,76,0.6); background:rgba(201,168,76,0.15); }
`;

// Islamic events by Hijri month+day
const ISLAMIC_EVENTS = [
  { month:1,  day:1,  name:"Islamic New Year",      emoji:"🌙", color:"#C9A84C", desc:"First day of Muharram — the Islamic new year begins." },
  { month:1,  day:10, name:"Ashura",                emoji:"🤲", color:"#8E44AD", desc:"Day of fasting. Commemorates the day Musa (AS) was saved." },
  { month:3,  day:12, name:"Mawlid al-Nabi ﷺ",      emoji:"⭐", color:"#D4AF37", desc:"Birth of Prophet Muhammad ﷺ — celebrated with love and prayers." },
  { month:7,  day:27, name:"Isra Wal Miraj",        emoji:"✨", color:"#1A5276", desc:"The Night Journey of Prophet Muhammad ﷺ to Jerusalem and the heavens." },
  { month:8,  day:15, name:"Shab-e-Barat",          emoji:"🌟", color:"#8E44AD", desc:"Night of forgiveness — many Muslims pray and seek forgiveness." },
  { month:9,  day:1,  name:"Ramadan Begins",        emoji:"🌙", color:"#C9A84C", desc:"The holy month of fasting begins. May Allah accept our fasts." },
  { month:9,  day:27, name:"Laylatul Qadr",         emoji:"💫", color:"#D4AF37", desc:"The Night of Power — better than a thousand months. Quran 97:3" },
  { month:10, day:1,  name:"Eid ul-Fitr",           emoji:"🎉", color:"#2ecc71", desc:"Celebration marking the end of Ramadan. Eid Mubarak! 🌙" },
  { month:12, day:8,  name:"Hajj Begins",           emoji:"🕋", color:"#C9A84C", desc:"Annual pilgrimage to Makkah begins for millions of Muslims." },
  { month:12, day:9,  name:"Day of Arafah",         emoji:"🤲", color:"#E8C97A", desc:"The most important day of Hajj. Fasting is highly recommended." },
  { month:12, day:10, name:"Eid ul-Adha",           emoji:"🎊", color:"#2ecc71", desc:"Festival of Sacrifice. Commemorates Ibrahim's (AS) willingness to sacrifice." },
];

const HIJRI_MONTHS = ['Muharram','Safar','Rabi al-Awwal','Rabi al-Thani','Jumada al-Awwal','Jumada al-Thani','Rajab','Shaban','Ramadan','Shawwal','Dhul Qadah','Dhul Hijjah'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function IslamicCalendar() {
  const [gregorian, setGregorian] = useState(new Date());
  const [hijriData, setHijriData] = useState(null);
  const [monthCalendar, setMonthCalendar] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [todayHijri, setTodayHijri] = useState(null);
  const [ramadanDays, setRamadanDays] = useState(null);

  useEffect(() => { fetchHijriMonth(gregorian); fetchTodayHijri(); }, [gregorian]);

  const fetchTodayHijri = async () => {
    try {
      const t   = new Date();
      const adj = parseInt(localStorage.getItem('hijri_adj')||'-1');
      const adj_date = new Date(t.getTime() + adj*86400000);
      const dd  = String(adj_date.getDate()).padStart(2,'0');
      const mm  = String(adj_date.getMonth()+1).padStart(2,'0');
      const yyyy= adj_date.getFullYear();
      const res = await fetch(`https://api.aladhan.com/v1/gToH/${dd}-${mm}-${yyyy}`);
      const d   = await res.json();
      if (d.data) {
        setTodayHijri(d.data.hijri);
        calculateUpcoming(d.data.hijri);
        // Ramadan countdown
        const hm = parseInt(d.data.hijri.month.number);
        const hd = parseInt(d.data.hijri.day);
        if (hm === 9) setRamadanDays({ type:'in', days: 30 - hd });
        else {
          const monthsUntil = hm < 9 ? 9-hm : 12-hm+9;
          setRamadanDays({ type:'until', days: monthsUntil*29 - hd });
        }
      }
    } catch {}
  };

  const fetchHijriMonth = async (date) => {
    setLoading(true);
    try {
      const mm   = String(date.getMonth()+1).padStart(2,'0');
      const yyyy = date.getFullYear();
      const res  = await fetch(`https://api.aladhan.com/v1/gToHCalendar/${mm}/${yyyy}`);
      const d    = await res.json();
      if (d.data) {
        setHijriData(d.data);
        buildCalendar(date, d.data);
      }
    } catch {}
    setLoading(false);
  };

  const buildCalendar = (date, data) => {
    const year  = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1).getDay();
    const days  = new Date(year, month+1, 0).getDate();
    const cal   = [];
    for (let i=0; i<first; i++) cal.push(null);
    for (let d=1; d<=days; d++) {
      const hijri = data.find(item => parseInt(item.gregorian.day)===d);
      cal.push({ greg:d, hijri: hijri?.hijri, hasEvent: hijri ? ISLAMIC_EVENTS.some(e => e.month===parseInt(hijri.hijri.month.number) && e.day===parseInt(hijri.hijri.day)) : false });
    }
    setMonthCalendar(cal);
  };

  const calculateUpcoming = (hijri) => {
    const curMonth = parseInt(hijri.month.number);
    const curDay   = parseInt(hijri.day);
    const events   = [];
    for (let i=0; i<12; i++) {
      ISLAMIC_EVENTS.forEach(e => {
        const eMonth = e.month;
        const eDay   = e.day;
        let diff = (eMonth - curMonth)*29 + (eDay - curDay);
        if (diff < 0) diff += 354;
        if (diff >= 0 && diff <= 90) events.push({ ...e, daysAway:diff });
      });
    }
    events.sort((a,b) => a.daysAway - b.daysAway);
    setUpcomingEvents([...new Map(events.map(e=>[e.name,e])).values()].slice(0,6));
  };

  const prevMonth = () => setGregorian(d => new Date(d.getFullYear(), d.getMonth()-1, 1));
  const nextMonth = () => setGregorian(d => new Date(d.getFullYear(), d.getMonth()+1, 1));

  const today    = new Date();
  const isToday  = (day) => day && today.getDate()===day.greg && today.getMonth()===gregorian.getMonth() && today.getFullYear()===gregorian.getFullYear();
  const selDay   = selectedDay || monthCalendar.find(d => d && isToday(d));
  const selEvents= selDay?.hijri ? ISLAMIC_EVENTS.filter(e => e.month===parseInt(selDay.hijri.month.number) && e.day===parseInt(selDay.hijri.day)) : [];

  return (
    <div className="ic-root" style={{ padding:'24px 28px', maxWidth:1000, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'22px 28px', marginBottom:22, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, background:'radial-gradient(ellipse,rgba(201,168,76,0.07),transparent)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:14, position:'relative' }}>
          <div style={{ width:50, height:50, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>📅</div>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:3, color:'rgba(201,168,76,0.6)', marginBottom:4 }}>HIJRI CALENDAR</div>
            <h1 className="gold-shimmer" style={{ fontSize:22, fontWeight:800, fontFamily:'Cinzel,serif' }}>Islamic Calendar</h1>
            {todayHijri && <div style={{ fontSize:12, color:'rgba(242,237,228,0.5)', marginTop:2 }}>Today: {todayHijri.day} {todayHijri.month.en} {todayHijri.year} AH</div>}
          </div>
          {/* Ramadan countdown */}
          {ramadanDays && (
            <div style={{ marginLeft:'auto', textAlign:'center', background: ramadanDays.type==='in'?'rgba(46,204,113,0.1)':'rgba(201,168,76,0.08)', border:`1px solid ${ramadanDays.type==='in'?'rgba(46,204,113,0.3)':'rgba(201,168,76,0.2)'}`, borderRadius:14, padding:'12px 18px' }}>
              <div style={{ fontSize:20 }}>🌙</div>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:16, fontWeight:700, color:ramadanDays.type==='in'?'#2ecc71':'#C9A84C' }}>
                {ramadanDays.type==='in' ? `${ramadanDays.days} days left` : `${ramadanDays.days} days to Ramadan`}
              </div>
              <div style={{ fontSize:10, color:'rgba(242,237,228,0.35)', letterSpacing:1 }}>RAMADAN</div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display:'flex', gap:18, flexWrap:'wrap' }}>
        {/* Calendar */}
        <div style={{ flex:'1 1 320px' }}>
          {/* Month nav */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <button onClick={prevMonth} style={{ padding:'8px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:8, color:'#C9A84C', cursor:'pointer' }}><ChevronLeft size={16}/></button>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:16, fontWeight:700, color:'#E8C97A' }}>
                {gregorian.toLocaleDateString('en-US',{month:'long',year:'numeric'})}
              </div>
              {hijriData?.[14] && <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', marginTop:2 }}>{hijriData[14].hijri.month.en} {hijriData[14].hijri.year} AH</div>}
            </div>
            <button onClick={nextMonth} style={{ padding:'8px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:8, color:'#C9A84C', cursor:'pointer' }}><ChevronRight size={16}/></button>
          </div>

          {/* Day headers */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4, marginBottom:6 }}>
            {DAYS.map(d => <div key={d} style={{ textAlign:'center', fontSize:10, color: d==='Fri'?'#C9A84C':'rgba(242,237,228,0.35)', fontFamily:'Cinzel,serif', fontWeight:600, padding:'4px 0' }}>{d}</div>)}
          </div>

          {/* Calendar grid */}
          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:40 }}><Loader size={22} color="#C9A84C" style={{ animation:'spin 1s linear infinite' }}/></div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
              {monthCalendar.map((day, i) => (
                <div key={i} className={`ic-day ${day&&isToday(day)?'today':''} ${day?.hasEvent?'event':''} ${selectedDay===day?'selected':''}`}
                  onClick={() => day && setSelectedDay(day)}
                  style={{ padding:'6px 4px', textAlign:'center', opacity:day?1:0, minHeight:48, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                  {day && <>
                    <div style={{ fontSize:13, fontWeight:isToday(day)?700:400, color:isToday(day)?'#C9A84C':day.hasEvent?'#2ecc71':'rgba(242,237,228,0.8)' }}>{day.greg}</div>
                    {day.hijri && <div style={{ fontSize:8, color:'rgba(201,168,76,0.5)', marginTop:1 }}>{day.hijri.day}</div>}
                    {day.hasEvent && <div style={{ width:4, height:4, borderRadius:'50%', background:'#2ecc71', marginTop:2 }}/>}
                  </>}
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          <div style={{ display:'flex', gap:14, marginTop:14, fontSize:11, color:'rgba(242,237,228,0.4)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}><div style={{ width:10, height:10, borderRadius:3, background:'rgba(201,168,76,0.15)', border:'1px solid #C9A84C' }}/> Today</div>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}><div style={{ width:10, height:10, borderRadius:3, background:'rgba(46,204,113,0.1)', border:'1px solid rgba(46,204,113,0.3)' }}/> Islamic Event</div>
          </div>

          {/* Selected day detail */}
          {selDay && (
            <div style={{ marginTop:16, background:'#0F0F0D', border:'1px solid rgba(201,168,76,0.15)', borderRadius:14, padding:'16px' }}>
              <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:10 }}>SELECTED DATE</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:15, fontWeight:700, color:'rgba(242,237,228,0.85)' }}>
                    {new Date(gregorian.getFullYear(), gregorian.getMonth(), selDay.greg).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}
                  </div>
                  {selDay.hijri && <div style={{ fontSize:12, color:'rgba(201,168,76,0.6)', marginTop:3 }}>{selDay.hijri.day} {selDay.hijri.month.en} {selDay.hijri.year} AH</div>}
                </div>
              </div>
              {selEvents.length > 0 && selEvents.map(e => (
                <div key={e.name} style={{ marginTop:12, padding:'10px 14px', background:`${e.color}10`, border:`1px solid ${e.color}30`, borderRadius:10 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:18 }}>{e.emoji}</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:e.color }}>{e.name}</div>
                      <div style={{ fontSize:11, color:'rgba(242,237,228,0.5)', marginTop:2 }}>{e.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right panel — upcoming events */}
        <div style={{ flex:'0 1 280px' }}>
          <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:14 }}>UPCOMING EVENTS</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {upcomingEvents.map((e, i) => (
              <div key={e.name} style={{ background:'#0F0F0D', border:`1px solid ${e.color}22`, borderRadius:14, padding:'14px 16px', animation:`fadeUp 0.3s ${i*0.07}s ease both`, transition:'all 0.3s' }}
                onMouseEnter={el => el.currentTarget.style.borderColor=`${e.color}44`}
                onMouseLeave={el => el.currentTarget.style.borderColor=`${e.color}22`}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                  <span style={{ fontSize:22, flexShrink:0 }}>{e.emoji}</span>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:e.color, marginBottom:3 }}>{e.name}</div>
                    <div style={{ fontSize:11, color:'rgba(242,237,228,0.45)', lineHeight:1.5, marginBottom:6 }}>{e.desc}</div>
                    <div style={{ display:'inline-flex', background:`${e.color}15`, border:`1px solid ${e.color}25`, borderRadius:6, padding:'2px 8px', fontSize:10, color:e.color, fontWeight:600 }}>
                      {e.daysAway === 0 ? '🎉 Today!' : e.daysAway === 1 ? 'Tomorrow' : `In ${e.daysAway} days`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* All Islamic months */}
          <div style={{ marginTop:20 }}>
            <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:12 }}>HIJRI MONTHS</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {HIJRI_MONTHS.map((m, i) => {
                const hasEvent = ISLAMIC_EVENTS.some(e => e.month === i+1);
                const isCurrent= todayHijri && parseInt(todayHijri.month.number) === i+1;
                return (
                  <div key={m} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', background:isCurrent?'rgba(201,168,76,0.1)':'transparent', border:`1px solid ${isCurrent?'rgba(201,168,76,0.3)':'transparent'}`, borderRadius:8, transition:'all 0.2s' }}>
                    <div style={{ width:22, height:22, borderRadius:6, background:'rgba(201,168,76,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cinzel,serif', fontSize:10, color:'rgba(201,168,76,0.6)', fontWeight:700, flexShrink:0 }}>{i+1}</div>
                    <div style={{ flex:1, fontSize:12, color:isCurrent?'#C9A84C':'rgba(242,237,228,0.6)', fontWeight:isCurrent?600:400 }}>{m}</div>
                    {hasEvent && <div style={{ fontSize:14 }}>⭐</div>}
                    {isCurrent && <div style={{ fontSize:9, color:'#C9A84C', border:'1px solid rgba(201,168,76,0.3)', borderRadius:4, padding:'1px 5px', letterSpacing:1 }}>NOW</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}