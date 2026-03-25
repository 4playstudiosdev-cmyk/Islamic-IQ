import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .jm-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes shimmer { to{background-position:200% center} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse   { 0%,100%{opacity:0.5} 50%{opacity:1} }
  @keyframes glow    { 0%,100%{box-shadow:0 0 20px rgba(201,168,76,0.1)} 50%{box-shadow:0 0 40px rgba(201,168,76,0.3)} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .jm-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:18px; }
  .tab-btn { background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.1); border-radius:10px; color:rgba(242,237,228,0.5); cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; transition:all 0.25s; padding:9px 16px; }
  .tab-btn.active { background:rgba(201,168,76,0.15); border-color:rgba(201,168,76,0.4); color:#C9A84C; font-weight:700; }
`;

const DUROOD = [
  { name:'Durood Ibrahim', arabic:'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ', urdu:'اے اللہ! محمد ﷺ پر رحمت نازل فرما جیسا تو نے ابراہیم پر نازل فرمائی', english:'O Allah, send blessings upon Muhammad and the family of Muhammad, as You sent blessings upon Ibrahim.' },
  { name:'Short Durood', arabic:'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', urdu:'اللہ کی رحمت اور سلامتی ہو ان پر', english:'May Allah\'s peace and blessings be upon him.' },
  { name:'Durood Tunajjina', arabic:'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ صَلَاةً تُنَجِّينَا بِهَا مِنْ جَمِيعِ الْأَهْوَالِ وَالْآفَاتِ', urdu:'اے اللہ! ہمارے سردار محمد ﷺ پر درود بھیج جو ہمیں تمام مصائب سے نجات دے', english:'O Allah, send blessings upon our Master Muhammad, through which You save us from all fears and calamities.' },
];

const KAHF_AYAS = [
  { num:1, arabic:'الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا', english:'All praise is for Allah Who has revealed the Book to His servant and allowed no crookedness in it.' },
  { num:2, arabic:'قَيِّمًا لِّيُنذِرَ بَأْسًا شَدِيدًا مِّن لَّدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ', english:'Upright, to warn of severe punishment from Him, and to give good news to the believers who do righteous deeds.' },
  { num:3, arabic:'أَنَّ لَهُمْ أَجْرًا حَسَنًا', english:'That for them is a great reward.' },
  { num:4, arabic:'مَّاكِثِينَ فِيهِ أَبَدًا', english:'In which they will remain forever.' },
  { num:5, arabic:'وَيُنذِرَ الَّذِينَ قَالُوا اتَّخَذَ اللَّهُ وَلَدًا', english:'And to warn those who say that Allah has taken a son.' },
];

const JUMMAH_DUAS = [
  { name:'Dua for Forgiveness on Jummah', arabic:'اللَّهُمَّ اغْفِرْ لِلْمُسْلِمِينَ وَالْمُسْلِمَاتِ', english:'O Allah, forgive the Muslim men and women.' },
  { name:'Dua before Khutbah',            arabic:'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', english:'O Allah, open the doors of Your mercy for me.' },
  { name:'Best Hour Dua (Last hour)',     arabic:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً', english:'Our Lord, give us good in this world and good in the Hereafter.' },
];

export default function Jummah() {
  const [tab, setTab]           = useState('countdown');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0, isToday: false });
  const [kahfProgress, setKahfProgress] = useState(() => { try { return parseInt(localStorage.getItem('kahf_progress') || '0'); } catch { return 0; } });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0=Sun, 5=Fri
      const daysUntilFri = (5 - dayOfWeek + 7) % 7;
      const isToday = dayOfWeek === 5;
      const fri = new Date(now);
      fri.setDate(now.getDate() + daysUntilFri);
      fri.setHours(12, 0, 0, 0);
      if (isToday && now.getHours() >= 12) fri.setDate(fri.getDate() + 7);
      const diff = fri - now;
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCountdown({ days, hours, mins, secs, isToday });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const speak = (text, lang = 'en') => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    if (lang === 'ar') {
      const ar = voices.find(v => v.lang === 'ar-SA') || voices.find(v => v.lang.startsWith('ar'));
      if (ar) { u.voice = ar; u.lang = 'ar-SA'; }
      u.rate = 0.6;
    }
    window.speechSynthesis.speak(u);
  };

  const updateKahf = (val) => {
    setKahfProgress(val);
    try { localStorage.setItem('kahf_progress', String(val)); } catch {}
  };

  return (
    <div className="jm-root" style={{ padding: '24px 28px', maxWidth: 800, margin: '0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#050505,#0F0F0D)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 20, padding: '22px 28px', marginBottom: 22, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top right,rgba(201,168,76,0.07),transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <div style={{ width: 50, height: 50, background: 'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🕌</div>
          <div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 3, color: 'rgba(201,168,76,0.6)', marginBottom: 4 }}>BLESSED DAY</div>
            <h1 className="gold-shimmer" style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Cinzel,serif' }}>Jummah Mubarak</h1>
            <p style={{ fontSize: 12, color: 'rgba(242,237,228,0.4)', marginTop: 2 }}>Friday — The best day upon which the sun rises</p>
          </div>
          {countdown.isToday && (
            <div style={{ marginLeft: 'auto', background: 'rgba(46,204,113,0.1)', border: '1px solid rgba(46,204,113,0.3)', borderRadius: 14, padding: '10px 16px', textAlign: 'center', animation: 'glow 2s ease-in-out infinite' }}>
              <div style={{ fontSize: 22 }}>🎉</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#2ecc71', fontFamily: 'Cinzel,serif' }}>Today!</div>
            </div>
          )}
        </div>
      </div>

      {/* Countdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 22 }}>
        {[['Days', countdown.days], ['Hours', countdown.hours], ['Minutes', countdown.mins], ['Seconds', countdown.secs]].map(([label, val]) => (
          <div key={label} style={{ background: '#0F0F0D', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 16, padding: '18px', textAlign: 'center', animation: 'glow 3s ease-in-out infinite' }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 36, fontWeight: 900, color: '#C9A84C' }}>{String(val).padStart(2, '0')}</div>
            <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.5)', letterSpacing: 2 }}>{label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }}>
        {[['countdown', '⏰ Countdown'], ['surah', '📖 Surah Kahf'], ['durood', '⭐ Durood'], ['duas', '🤲 Duas']].map(([id, label]) => (
          <button key={id} className={`tab-btn ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)} style={{ flexShrink: 0 }}>{label}</button>
        ))}
      </div>

      {/* Countdown tab — Jummah Amal */}
      {tab === 'countdown' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="jm-card" style={{ padding: '20px' }}>
            <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.5)', letterSpacing: 2, fontFamily: 'Cinzel,serif', marginBottom: 16 }}>JUMMAH CHECKLIST</div>
            {[
              { emoji: '🛁', text: 'Take Ghusl (Friday bath)', hadith: 'Bukhari' },
              { emoji: '👘', text: 'Wear clean/best clothes', hadith: 'Abu Dawud' },
              { emoji: '🌹', text: 'Apply ittar (perfume)', hadith: 'Bukhari' },
              { emoji: '📖', text: 'Read Surah Al-Kahf', hadith: 'Hakim' },
              { emoji: '⭐', text: 'Send 100+ Durood on Prophet ﷺ', hadith: 'Muslim' },
              { emoji: '🕌', text: 'Go to Masjid early', hadith: 'Bukhari' },
              { emoji: '🤲', text: 'Make lots of dua (especially last hour)', hadith: 'Bukhari' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(201,168,76,0.06)' }}>
                <span style={{ fontSize: 20 }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'rgba(242,237,228,0.85)' }}>{item.text}</div>
                  <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.5)', marginTop: 2 }}>📚 {item.hadith}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 14, padding: '14px 18px', textAlign: 'center' }}>
            <div className="arabic" style={{ fontSize: 14, color: 'rgba(201,168,76,0.7)', marginBottom: 6 }}>يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ</div>
            <div style={{ fontSize: 12, color: 'rgba(242,237,228,0.3)', fontStyle: 'italic' }}>"O believers! When the call to prayer is made on Friday, then proceed to the remembrance of Allah." — 62:9</div>
          </div>
        </div>
      )}

      {/* Surah Kahf tab */}
      {tab === 'surah' && (
        <div>
          <div className="jm-card" style={{ padding: '20px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.5)', letterSpacing: 2, fontFamily: 'Cinzel,serif' }}>FIRST 5 AYATS — SURAH AL-KAHF</div>
              <div style={{ fontSize: 11, color: '#2ecc71', background: 'rgba(46,204,113,0.1)', border: '1px solid rgba(46,204,113,0.2)', borderRadius: 6, padding: '3px 8px' }}>Light for 2 Fridays</div>
            </div>
            {KAHF_AYAS.map((a, i) => (
              <div key={a.num} onClick={() => updateKahf(i + 1)}
                style={{ padding: '14px', background: kahfProgress >= i + 1 ? 'rgba(46,204,113,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${kahfProgress >= i + 1 ? 'rgba(46,204,113,0.2)' : 'rgba(201,168,76,0.06)'}`, borderRadius: 12, marginBottom: 10, cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: kahfProgress >= i + 1 ? 'rgba(46,204,113,0.2)' : 'rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: kahfProgress >= i + 1 ? '#2ecc71' : '#C9A84C', fontFamily: 'Cinzel,serif' }}>
                    {kahfProgress >= i + 1 ? '✓' : a.num}
                  </div>
                  <button onClick={e => { e.stopPropagation(); speak(a.arabic, 'ar'); }}
                    style={{ padding: '4px 10px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 7, color: '#C9A84C', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Volume2 size={10} /> Play
                  </button>
                </div>
                <div className="arabic" style={{ fontSize: 18, color: '#E8C97A', lineHeight: 2.2, marginBottom: 8, direction: 'rtl' }}>{a.arabic}</div>
                <div style={{ fontSize: 12, color: 'rgba(242,237,228,0.5)', fontStyle: 'italic', lineHeight: 1.6 }}>{a.english}</div>
              </div>
            ))}
            <button onClick={() => updateKahf(0)} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, color: 'rgba(242,237,228,0.3)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              Reset Progress
            </button>
          </div>
        </div>
      )}

      {/* Durood tab */}
      {tab === 'durood' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DUROOD.map((d, i) => (
            <div key={i} className="jm-card" style={{ padding: '20px', animation: `fadeUp 0.3s ${i * 0.1}s ease both` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#E8C97A' }}>{d.name}</div>
                <button onClick={() => speak(d.arabic, 'ar')} style={{ padding: '5px 12px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 7, color: '#C9A84C', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Volume2 size={11} /> Play
                </button>
              </div>
              <div className="arabic" style={{ fontSize: 18, color: '#C9A84C', lineHeight: 2.2, marginBottom: 10, direction: 'rtl' }}>{d.arabic}</div>
              <div className="arabic" style={{ fontSize: 13, color: 'rgba(242,237,228,0.55)', lineHeight: 1.8, marginBottom: 8 }}>{d.urdu}</div>
              <div style={{ fontSize: 12, color: 'rgba(242,237,228,0.45)', fontStyle: 'italic', lineHeight: 1.7 }}>{d.english}</div>
            </div>
          ))}
          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 14, padding: '14px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#C9A84C', marginBottom: 4 }}>⭐ Send 80 Durood on Jummah</div>
            <div style={{ fontSize: 11, color: 'rgba(242,237,228,0.4)', fontStyle: 'italic' }}>"Whoever sends 80 Durood on Friday, 80 years of sins are forgiven." — Reported in Hadith</div>
          </div>
        </div>
      )}

      {/* Duas tab */}
      {tab === 'duas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {JUMMAH_DUAS.map((d, i) => (
            <div key={i} className="jm-card" style={{ padding: '20px', animation: `fadeUp 0.3s ${i * 0.1}s ease both` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#E8C97A', marginBottom: 12 }}>{d.name}</div>
              <div className="arabic" style={{ fontSize: 18, color: '#C9A84C', lineHeight: 2.2, marginBottom: 10, direction: 'rtl' }}>{d.arabic}</div>
              <div style={{ fontSize: 12, color: 'rgba(242,237,228,0.55)', fontStyle: 'italic' }}>{d.english}</div>
            </div>
          ))}
          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 14, padding: '14px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#C9A84C', marginBottom: 6 }}>🕐 Best Hour for Dua</div>
            <div style={{ fontSize: 12, color: 'rgba(242,237,228,0.5)' }}>The last hour before Maghrib on Friday — make lots of dua!</div>
          </div>
        </div>
      )}
    </div>
  );
}