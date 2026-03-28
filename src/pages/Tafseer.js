/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Search, Loader, ChevronRight, X, BookOpen } from 'lucide-react';

const GROQ_KEY = process.env.REACT_APP_GROQ_KEY || '';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .tf-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { to{background-position:200% center} }
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .tf-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:16px; transition:all 0.3s; cursor:pointer; }
  .tf-card:hover { border-color:rgba(201,168,76,0.3); transform:translateY(-2px); }
  .tf-input { background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.15); border-radius:10px; color:#F2EDE4; outline:none; padding:11px 14px; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; width:100%; }
  .tf-input:focus { border-color:rgba(201,168,76,0.4); }
  .tf-input::placeholder { color:rgba(242,237,228,0.25); }
`;

const SURAHS = [
  {n:1,name:'Al-Fatiha',ar:'الفاتحة',ayats:7},   {n:2,name:'Al-Baqarah',ar:'البقرة',ayats:286},
  {n:3,name:'Aal-Imran',ar:'آل عمران',ayats:200}, {n:4,name:'An-Nisa',ar:'النساء',ayats:176},
  {n:5,name:'Al-Maidah',ar:'المائدة',ayats:120},  {n:6,name:'Al-Anam',ar:'الأنعام',ayats:165},
  {n:7,name:'Al-Araf',ar:'الأعراف',ayats:206},    {n:18,name:'Al-Kahf',ar:'الكهف',ayats:110},
  {n:36,name:'Ya-Sin',ar:'يس',ayats:83},           {n:55,name:'Ar-Rahman',ar:'الرحمن',ayats:78},
  {n:67,name:'Al-Mulk',ar:'الملك',ayats:30},       {n:112,name:'Al-Ikhlas',ar:'الإخلاص',ayats:4},
  {n:113,name:'Al-Falaq',ar:'الفلق',ayats:5},      {n:114,name:'An-Nas',ar:'الناس',ayats:6},
];

const FAMOUS_AYATS = [
  {surah:2, ayat:255, name:'Ayatul Kursi', desc:'The greatest verse in the Quran'},
  {surah:2, ayat:286, name:'Last Ayat of Al-Baqarah', desc:'Dua for believers'},
  {surah:1, ayat:1,   name:'Al-Fatiha — Bismillah', desc:'Opening of the Quran'},
  {surah:3, ayat:26,  name:'Du\'a of Power', desc:'Qul Allahumma Malik-ul-Mulk'},
  {surah:3, ayat:173, name:'Hasbunallah', desc:'Allah is sufficient for us'},
  {surah:18,ayat:10,  name:'Du\'a of the Cave', desc:'Dua of the People of the Cave'},
  {surah:21,ayat:87,  name:'Du\'a of Yunus', desc:'Lailaha illa anta subhanaak'},
  {surah:39,ayat:53,  name:'Verse of Hope', desc:'Do not despair of Allah\'s mercy'},
];

export default function Tafseer() {
  const [surah, setSurah]         = useState(null);
  const [ayatNum, setAyatNum]     = useState(1);
  const [ayatData, setAyatData]   = useState(null);
  const [tafseer, setTafseer]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [loadingAyat, setLoadingAyat] = useState(false);
  const [search, setSearch]       = useState('');
  const [error, setError]         = useState('');
  const [view, setView]           = useState('home'); // home | surah | tafseer
  const [cache, setCache]         = useState({});

  const fetchAyat = async (sNum, aNum) => {
    setLoadingAyat(true); setError(''); setAyatData(null); setTafseer('');
    try {
      const res  = await fetch(`https://api.alquran.cloud/v1/ayah/${sNum}:${aNum}/editions/quran-simple,en.asad,ur.jalandhry`);
      const data = await res.json();
      if (data.code === 200) {
        const [ar, en, ur] = data.data;
        setAyatData({ arabic: ar.text, english: en.text, urdu: ur.text, ref:`${sNum}:${aNum}` });
        setView('tafseer');
      }
    } catch { setError('Failed to load ayat.'); }
    setLoadingAyat(false);
  };

  const fetchTafseer = async () => {
    if (!ayatData) return;
    const cKey = ayatData.ref;
    if (cache[cKey]) { setTafseer(cache[cKey]); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method:'POST',
        headers:{ 'Authorization':`Bearer ${GROQ_KEY}`, 'Content-Type':'application/json' },
        body: JSON.stringify({
          model:'llama-3.3-70b-versatile',
          messages:[{ role:'user', content:`Provide detailed Tafseer for Quran ${ayatData.ref}:

Arabic: ${ayatData.arabic}
English: ${ayatData.english}

Write a comprehensive but clear tafseer with these sections:

📖 MEANING
Explain the complete meaning of this ayat in simple language (3-4 sentences).

📜 REVELATION CONTEXT (Asbab al-Nuzul)
When and why was this ayat revealed? Any historical event? (2-3 sentences)

🔤 WORD ANALYSIS
Explain 2-3 key Arabic words/terms and their deeper meanings.

💡 LESSONS & GUIDANCE
What are the key lessons for Muslims today? (3-4 points)

🤲 DUA OR ACTION
Any recommended action or dua related to this ayat?

Reference authentic scholars like Ibn Kathir, Ibn Abbas, or classical tafseer. Keep language clear and accessible.` }],
          max_tokens:800, temperature:0.4,
        }),
      });
      const d    = await res.json();
      const text = d.choices?.[0]?.message?.content?.trim() || 'Tafseer not available.';
      setTafseer(text);
      setCache(prev => ({...prev, [cKey]: text}));
    } catch { setError('Failed to generate tafseer. Check your internet.'); }
    setLoading(false);
  };

  useEffect(() => { if (ayatData) fetchTafseer(); }, [ayatData]);

  const filteredSurahs = SURAHS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.ar.includes(search)
  );

  return (
    <div className="tf-root" style={{ padding:'24px 28px', maxWidth:900, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'22px 28px', marginBottom:22, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at top right,rgba(201,168,76,0.06),transparent 60%)', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:14, position:'relative' }}>
          <div style={{ width:50, height:50, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>📚</div>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:3, color:'rgba(201,168,76,0.6)', marginBottom:4 }}>QURAN EXPLANATION</div>
            <h1 className="gold-shimmer" style={{ fontSize:22, fontWeight:800, fontFamily:'Cinzel,serif' }}>Tafseer</h1>
            <p style={{ fontSize:12, color:'rgba(242,237,228,0.4)', marginTop:2 }}>AI-powered · Based on Ibn Kathir & classical scholars</p>
          </div>
          {view !== 'home' && (
            <button onClick={() => { setView('home'); setSurah(null); setAyatData(null); setTafseer(''); }}
              style={{ marginLeft:'auto', padding:'8px 16px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:10, color:'#C9A84C', cursor:'pointer', fontSize:12, fontFamily:'inherit' }}>
              ← Home
            </button>
          )}
        </div>
      </div>

      {/* ══ HOME ══ */}
      {view === 'home' && (
        <div>
          {/* Famous ayats */}
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:14 }}>✨ FAMOUS AYATS</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:10 }}>
              {FAMOUS_AYATS.map((a, i) => (
                <div key={i} className="tf-card" onClick={() => { fetchAyat(a.surah, a.ayat); }}
                  style={{ padding:'16px', animation:`fadeUp 0.3s ${i*0.06}s ease both` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <div style={{ width:28, height:28, borderRadius:7, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontFamily:'Cinzel,serif', fontWeight:700, color:'#C9A84C' }}>{a.surah}:{a.ayat}</div>
                    <BookOpen size={13} color="rgba(201,168,76,0.5)"/>
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:'rgba(242,237,228,0.85)', marginBottom:4 }}>{a.name}</div>
                  <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)' }}>{a.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search surah */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:12 }}>📖 BROWSE BY SURAH</div>
            <div style={{ position:'relative', marginBottom:14 }}>
              <Search size={13} color="rgba(201,168,76,0.4)" style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)' }}/>
              <input className="tf-input" value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search surah..." style={{ paddingLeft:36 }}/>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:10 }}>
              {filteredSurahs.map((s, i) => (
                <div key={s.n} className="tf-card" onClick={() => { setSurah(s); setAyatNum(1); setView('surah'); }}
                  style={{ padding:'14px 16px', animation:`fadeUp 0.3s ${i*0.04}s ease both` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                    <div style={{ width:24, height:24, borderRadius:6, background:'rgba(201,168,76,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontFamily:'Cinzel,serif', fontWeight:700, color:'#C9A84C' }}>{s.n}</div>
                    <div className="arabic" style={{ fontSize:15, color:'rgba(201,168,76,0.6)' }}>{s.ar}</div>
                  </div>
                  <div style={{ fontSize:12, fontWeight:600, color:'rgba(242,237,228,0.8)' }}>{s.name}</div>
                  <div style={{ fontSize:10, color:'rgba(242,237,228,0.35)', marginTop:3 }}>{s.ayats} Ayats <ChevronRight size={10} style={{ display:'inline' }}/></div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom input */}
          <div style={{ background:'#0F0F0D', border:'1px solid rgba(201,168,76,0.1)', borderRadius:16, padding:'20px' }}>
            <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:14 }}>🔍 ENTER ANY AYAT</div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <div style={{ flex:1, minWidth:120 }}>
                <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)', marginBottom:6 }}>Surah Number (1-114)</div>
                <input type="number" min={1} max={114} placeholder="e.g. 2"
                  id="tf-surah-input"
                  style={{ width:'100%', padding:'10px 12px', background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:8, color:'#F2EDE4', fontSize:14, fontFamily:'inherit', outline:'none' }}/>
              </div>
              <div style={{ flex:1, minWidth:120 }}>
                <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)', marginBottom:6 }}>Ayat Number</div>
                <input type="number" min={1} placeholder="e.g. 255"
                  id="tf-ayat-input"
                  style={{ width:'100%', padding:'10px 12px', background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:8, color:'#F2EDE4', fontSize:14, fontFamily:'inherit', outline:'none' }}/>
              </div>
              <div style={{ display:'flex', alignItems:'flex-end' }}>
                <button onClick={() => {
                  const sn = parseInt(document.getElementById('tf-surah-input').value)||1;
                  const an = parseInt(document.getElementById('tf-ayat-input').value)||1;
                  fetchAyat(sn, an);
                }} style={{ padding:'10px 20px', background:'linear-gradient(135deg,#C9A84C,#E8C97A)', border:'none', borderRadius:8, color:'#050505', fontFamily:'Cinzel,serif', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                  Get Tafseer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ SURAH VIEW ══ */}
      {view === 'surah' && surah && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:16, fontWeight:700, color:'#E8C97A' }}>{surah.name}</div>
              <div className="arabic" style={{ fontSize:18, color:'rgba(201,168,76,0.6)' }}>{surah.ar}</div>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <input type="number" value={ayatNum} min={1} max={surah.ayats}
                onChange={e => setAyatNum(Math.max(1, Math.min(surah.ayats, parseInt(e.target.value)||1)))}
                style={{ width:60, padding:'8px', background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:8, color:'#C9A84C', textAlign:'center', fontSize:13, fontFamily:'Cinzel,serif', outline:'none' }}/>
              <span style={{ fontSize:12, color:'rgba(242,237,228,0.4)' }}>/ {surah.ayats}</span>
              <button onClick={() => fetchAyat(surah.n, ayatNum)}
                style={{ padding:'9px 16px', background:'linear-gradient(135deg,#C9A84C,#E8C97A)', border:'none', borderRadius:8, color:'#050505', fontFamily:'Cinzel,serif', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                Read Tafseer
              </button>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(60px,1fr))', gap:6 }}>
            {Array.from({length:surah.ayats},(_,i)=>i+1).map(n => (
              <button key={n} onClick={() => fetchAyat(surah.n, n)}
                style={{ padding:'10px 6px', background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:8, color:'#C9A84C', cursor:'pointer', fontFamily:'Cinzel,serif', fontSize:12, fontWeight:600, transition:'all 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(201,168,76,0.15)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(201,168,76,0.06)'}>
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══ TAFSEER VIEW ══ */}
      {view === 'tafseer' && (
        <div>
          {loadingAyat && <div style={{ textAlign:'center', padding:40 }}><Loader size={24} color="#C9A84C" style={{ animation:'spin 1s linear infinite' }}/></div>}

          {ayatData && !loadingAyat && (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              {/* Ayat box */}
              <div style={{ background:'linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.04))', border:'1px solid rgba(201,168,76,0.25)', borderRadius:18, padding:'24px', marginBottom:18 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                  <div style={{ fontFamily:'Cinzel,serif', fontSize:14, color:'rgba(201,168,76,0.7)', letterSpacing:1 }}>AYAT {ayatData.ref}</div>
                  {surah && (
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={() => { const n=parseInt(ayatData.ref.split(':')[1]); if(n>1) fetchAyat(surah.n, n-1); }}
                        style={{ padding:'6px 10px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:7, color:'#C9A84C', cursor:'pointer', fontSize:11 }}>← Prev</button>
                      <button onClick={() => { const n=parseInt(ayatData.ref.split(':')[1]); if(n<surah.ayats) fetchAyat(surah.n, n+1); }}
                        style={{ padding:'6px 10px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:7, color:'#C9A84C', cursor:'pointer', fontSize:11 }}>Next →</button>
                    </div>
                  )}
                </div>
                {/* Arabic */}
                <div className="arabic" style={{ fontSize:24, color:'#E8C97A', lineHeight:2.4, marginBottom:14, direction:'rtl', borderBottom:'1px solid rgba(201,168,76,0.1)', paddingBottom:14 }}>
                  {ayatData.arabic}
                </div>
                {/* English */}
                <div style={{ fontSize:14, color:'rgba(242,237,228,0.65)', lineHeight:1.8, fontStyle:'italic', marginBottom:10 }}>{ayatData.english}</div>
                {/* Urdu */}
                <div className="arabic" style={{ fontSize:14, color:'rgba(201,168,76,0.6)', lineHeight:2, direction:'rtl' }}>{ayatData.urdu}</div>
              </div>

              {/* Tafseer */}
              <div style={{ background:'#0F0F0D', border:'1px solid rgba(201,168,76,0.15)', borderRadius:18, padding:'22px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                  <span style={{ fontSize:18 }}>📚</span>
                  <span style={{ fontFamily:'Cinzel,serif', fontSize:13, color:'#C9A84C', letterSpacing:1 }}>TAFSEER</span>
                  <div style={{ marginLeft:'auto', fontSize:9, color:'rgba(201,168,76,0.4)', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.12)', borderRadius:5, padding:'2px 8px' }}>AI · CLASSICAL SOURCES</div>
                </div>

                {loading ? (
                  <div style={{ display:'flex', alignItems:'center', gap:10, padding:'20px 0', color:'rgba(201,168,76,0.6)' }}>
                    <Loader size={18} style={{ animation:'spin 1s linear infinite' }}/>
                    <span style={{ fontSize:13 }}>Generating Tafseer from classical sources...</span>
                  </div>
                ) : error ? (
                  <div style={{ color:'#e74c3c', fontSize:13 }}>⚠️ {error}</div>
                ) : tafseer ? (
                  <div style={{ fontSize:13, color:'rgba(242,237,228,0.75)', lineHeight:1.9, whiteSpace:'pre-line' }}>
                    {tafseer}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop:20, background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:14, padding:'14px 18px', textAlign:'center' }}>
        <div className="arabic" style={{ fontSize:14, color:'rgba(201,168,76,0.7)', marginBottom:5 }}>أَفَلَا يَتَدَبَّرُونَ الْقُرْآنَ</div>
        <div style={{ fontSize:11, color:'rgba(242,237,228,0.3)', fontStyle:'italic' }}>"Do they not ponder the Quran?" — Quran 4:82</div>
      </div>
    </div>
  );
}