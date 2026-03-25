import React, { useState, useEffect } from 'react';
import { RefreshCw, Volume2, Loader, Heart } from 'lucide-react';

const GROQ_KEY = process.env.REACT_APP_GROQ_KEY || '';
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .aw-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { to{background-position:200% center} }
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pulse   { 0%,100%{opacity:0.6} 50%{opacity:1} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .aw-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:18px; transition:all 0.3s; }
`;

const STATIC_WORDS = [
  { ar:'سَلَام',   tr:'Salaam',   en:'Peace',      ur:'سلامتی',    ex:'As-Salamu Alaykum — Peace be upon you', root:'س-ل-م', usage:'Greeting among Muslims worldwide' },
  { ar:'رَحْمَة',  tr:'Rahmah',   en:'Mercy',      ur:'رحمت',     ex:'Allah\'s Rahmah encompasses all things', root:'ر-ح-م', usage:'Used to describe Allah\'s mercy' },
  { ar:'صَبْر',   tr:'Sabr',     en:'Patience',   ur:'صبر',      ex:'Allah loves those who have Sabr', root:'ص-ب-ر', usage:'Fundamental Islamic virtue' },
  { ar:'شُكْر',   tr:'Shukr',    en:'Gratitude',  ur:'شکر',      ex:'Shukr to Allah for His blessings', root:'ش-ك-ر', usage:'Thanking Allah for blessings' },
  { ar:'تَوْبَة',  tr:'Tawbah',   en:'Repentance', ur:'توبہ',     ex:'Allah accepts sincere Tawbah', root:'ت-و-ب', usage:'Returning to Allah after sin' },
  { ar:'إِخْلَاص', tr:'Ikhlas',   en:'Sincerity',  ur:'اخلاص',    ex:'Acts must be done with Ikhlas for Allah', root:'خ-ل-ص', usage:'Purity of intention in worship' },
  { ar:'تَوَكُّل', tr:'Tawakkul', en:'Trust in Allah',ur:'توکل',  ex:'Put your Tawakkul in Allah', root:'و-ك-ل', usage:'Complete reliance on Allah' },
  { ar:'يَقِين',  tr:'Yaqeen',   en:'Certainty',  ur:'یقین',     ex:'Have Yaqeen in Allah\'s promise', root:'ي-ق-ن', usage:'Firm belief and conviction' },
  { ar:'عِلْم',   tr:'Ilm',      en:'Knowledge',  ur:'علم',      ex:'Seeking Ilm is obligatory on every Muslim', root:'ع-ل-م', usage:'Islamic scholarship and learning' },
  { ar:'حِكْمَة', tr:'Hikmah',   en:'Wisdom',     ur:'حکمت',     ex:'Allah gives Hikmah to whom He wills', root:'ح-ك-م', usage:'Deep understanding and wisdom' },
  { ar:'جِهَاد',  tr:'Jihad',    en:'Striving',   ur:'جہاد',     ex:'The greatest Jihad is against one\'s own ego', root:'ج-ه-د', usage:'Striving in the path of Allah' },
  { ar:'زُهْد',   tr:'Zuhd',     en:'Detachment', ur:'زہد',      ex:'Zuhd means not being attached to dunya', root:'ز-ه-د', usage:'Spiritual detachment from worldly things' },
  { ar:'إِيمَان', tr:'Iman',     en:'Faith',      ur:'ایمان',    ex:'Iman increases with good deeds', root:'أ-م-ن', usage:'Core of Islamic belief' },
  { ar:'تَقْوَى', tr:'Taqwa',    en:'God-Fearing',ur:'تقوی',     ex:'The best of you is who has the most Taqwa', root:'و-ق-ي', usage:'Consciousness and fear of Allah' },
];

const TODAY_KEY = () => `aw_${new Date().toISOString().split('T')[0]}`;

export default function ArabicWord() {
  const [word, setWord]         = useState(null);
  const [loading, setLoading]   = useState(false);
  const [favs, setFavs]         = useState(() => { try { return JSON.parse(localStorage.getItem('aw_favs')||'[]'); } catch { return []; }});
  const [tab, setTab]           = useState('today');
  const [quizWord, setQuizWord] = useState(null);
  const [quizOpts, setQuizOpts] = useState([]);
  const [quizAns, setQuizAns]   = useState(null);
  const [streak, setStreak]     = useState(() => { try { return parseInt(localStorage.getItem('aw_streak')||'0'); } catch { return 0; }});

  useEffect(() => { loadTodayWord(); }, []);

  const loadTodayWord = async () => {
    // Try cache
    try {
      const cached = localStorage.getItem(TODAY_KEY());
      if (cached) { setWord(JSON.parse(cached)); return; }
    } catch {}

    // Try AI
    setLoading(true);
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method:'POST',
        headers:{'Authorization':`Bearer ${GROQ_KEY}`,'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'llama-3.3-70b-versatile',
          messages:[{role:'user',content:`Give me one beautiful Arabic word commonly used in Islamic context. Return ONLY JSON:
{"ar":"Arabic word with diacritics","tr":"transliteration","en":"English meaning","ur":"Urdu meaning","ex":"Example sentence in English using this word","root":"3-letter Arabic root","usage":"How this word is used in Islam","quranRef":"optional Quran verse reference"}`}],
          max_tokens:300, temperature:0.9,
        }),
      });
      const d   = await res.json();
      const txt = d.choices?.[0]?.message?.content||'{}';
      const m   = txt.match(/\{[\s\S]*\}/);
      if (m) {
        const w = JSON.parse(m[0]);
        setWord(w);
        try { localStorage.setItem(TODAY_KEY(), JSON.stringify(w)); } catch {}
        // Update streak
        const newStreak = streak + 1;
        setStreak(newStreak);
        try { localStorage.setItem('aw_streak', String(newStreak)); } catch {}
      } else throw new Error('no json');
    } catch {
      // Fallback to static
      const idx = new Date().getDate() % STATIC_WORDS.length;
      setWord(STATIC_WORDS[idx]);
    }
    setLoading(false);
  };

  const speak = (text, lang='en') => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    if (lang === 'ar') {
      const ar = voices.find(v=>v.lang==='ar-SA')||voices.find(v=>v.lang.startsWith('ar'));
      if (ar) { u.voice=ar; u.lang='ar-SA'; }
      u.rate = 0.6;
    }
    u.volume = 1;
    window.speechSynthesis.speak(u);
  };

  const toggleFav = (w) => {
    const key = w.ar;
    const next = favs.find(f=>f.ar===key) ? favs.filter(f=>f.ar!==key) : [...favs, w];
    setFavs(next);
    try { localStorage.setItem('aw_favs', JSON.stringify(next)); } catch {}
  };

  const startQuiz = () => {
    const correct = STATIC_WORDS[Math.floor(Math.random()*STATIC_WORDS.length)];
    const opts    = [correct];
    while(opts.length < 4) { const r=STATIC_WORDS[Math.floor(Math.random()*STATIC_WORDS.length)]; if(!opts.find(o=>o.ar===r.ar)) opts.push(r); }
    setQuizWord(correct); setQuizOpts(opts.sort(()=>Math.random()-0.5)); setQuizAns(null);
  };

  const isFav = word && favs.find(f=>f.ar===word.ar);

  const WordCard = ({ w, big=false }) => w ? (
    <div className="aw-card" style={{ padding:big?'28px':'18px', textAlign:'center', position:'relative' }}>
      {/* Fav button */}
      <button onClick={() => toggleFav(w)}
        style={{ position:'absolute', top:14, right:14, background:'none', border:'none', cursor:'pointer', fontSize:18 }}>
        {favs.find(f=>f.ar===w.ar) ? '❤️' : '🤍'}
      </button>

      {/* Arabic word */}
      <div className="arabic" style={{ fontSize:big?72:48, color:'#C9A84C', fontWeight:700, marginBottom:10, lineHeight:1.4, animation:'float 3s ease-in-out infinite' }}>{w.ar}</div>

      {/* Transliteration */}
      <div style={{ fontFamily:'Cinzel,serif', fontSize:big?22:16, fontWeight:700, color:'#E8C97A', marginBottom:6 }}>{w.tr}</div>
      <div style={{ fontSize:big?16:13, color:'rgba(242,237,228,0.6)', marginBottom:4 }}>{w.en}</div>
      <div className="arabic" style={{ fontSize:big?16:13, color:'rgba(201,168,76,0.6)', marginBottom:16 }}>{w.ur}</div>

      {/* Audio buttons */}
      <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:16 }}>
        <button onClick={() => speak(w.ar,'ar')} style={{ padding:'7px 14px', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:8, color:'#C9A84C', cursor:'pointer', fontSize:11, display:'flex', alignItems:'center', gap:5 }}>
          <Volume2 size={11}/> Arabic
        </button>
        <button onClick={() => speak(w.tr,'en')} style={{ padding:'7px 14px', background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:8, color:'#E8C97A', cursor:'pointer', fontSize:11, display:'flex', alignItems:'center', gap:5 }}>
          <Volume2 size={11}/> English
        </button>
      </div>

      {/* Root */}
      {w.root && <div style={{ display:'inline-flex', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:8, padding:'5px 12px', marginBottom:14, gap:6 }}>
        <span style={{ fontSize:11, color:'rgba(242,237,228,0.4)' }}>Root:</span>
        <span className="arabic" style={{ fontSize:14, color:'#C9A84C', fontWeight:700 }}>{w.root}</span>
      </div>}

      {/* Example */}
      {w.ex && <div style={{ background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:10, padding:'12px 14px', marginBottom:10, textAlign:'left' }}>
        <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:1, marginBottom:5 }}>EXAMPLE</div>
        <div style={{ fontSize:12, color:'rgba(242,237,228,0.65)', fontStyle:'italic', lineHeight:1.7 }}>"{w.ex}"</div>
      </div>}

      {/* Usage */}
      {w.usage && <div style={{ fontSize:12, color:'rgba(242,237,228,0.4)', lineHeight:1.6 }}>{w.usage}</div>}
    </div>
  ) : null;

  return (
    <div className="aw-root" style={{ padding:'24px 28px', maxWidth:800, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'22px 28px', marginBottom:22, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at top right,rgba(201,168,76,0.06),transparent 60%)', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:14, position:'relative' }}>
          <div style={{ width:50, height:50, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>📊</div>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:3, color:'rgba(201,168,76,0.6)', marginBottom:4 }}>DAILY LEARNING</div>
            <h1 className="gold-shimmer" style={{ fontSize:22, fontWeight:800, fontFamily:'Cinzel,serif' }}>Arabic Word of the Day</h1>
            <p style={{ fontSize:12, color:'rgba(242,237,228,0.4)', marginTop:2 }}>Learn one new Islamic Arabic word every day</p>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:10 }}>
            <div style={{ textAlign:'center', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:12, padding:'10px 14px' }}>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:18, fontWeight:700, color:'#C9A84C' }}>{favs.length}</div>
              <div style={{ fontSize:9, color:'rgba(201,168,76,0.5)', letterSpacing:1 }}>SAVED</div>
            </div>
            <div style={{ textAlign:'center', background:'rgba(255,107,0,0.08)', border:'1px solid rgba(255,107,0,0.2)', borderRadius:12, padding:'10px 14px' }}>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:18, fontWeight:700, color:'#FF6B00' }}>🔥{streak}</div>
              <div style={{ fontSize:9, color:'rgba(255,107,0,0.5)', letterSpacing:1 }}>STREAK</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {[['today','📖 Today\'s Word'],['library','📚 Word Library'],['quiz','🧠 Quiz'],['favs',`❤️ Saved (${favs.length})`]].map(([id,label]) => (
          <button key={id} onClick={() => { setTab(id); if(id==='quiz') startQuiz(); }}
            style={{ padding:'9px 16px', background:tab===id?'rgba(201,168,76,0.15)':'rgba(201,168,76,0.04)', border:`1px solid ${tab===id?'rgba(201,168,76,0.4)':'rgba(201,168,76,0.1)'}`, borderRadius:10, color:tab===id?'#C9A84C':'rgba(242,237,228,0.5)', cursor:'pointer', fontSize:12, fontWeight:tab===id?700:400, fontFamily:'inherit', whiteSpace:'nowrap' }}>
            {label}
          </button>
        ))}
      </div>

      {/* TODAY */}
      {tab === 'today' && (
        loading ? (
          <div style={{ textAlign:'center', padding:60 }}><Loader size={28} color="#C9A84C" style={{ animation:'spin 1s linear infinite' }}/></div>
        ) : (
          <div>
            <WordCard w={word} big={true}/>
            <button onClick={loadTodayWord}
              style={{ width:'100%', marginTop:14, padding:'12px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:12, color:'#C9A84C', cursor:'pointer', fontSize:13, fontFamily:'Cinzel,serif', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <RefreshCw size={14}/> New Word (AI Generated)
            </button>
          </div>
        )
      )}

      {/* LIBRARY */}
      {tab === 'library' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
          {STATIC_WORDS.map((w,i) => (
            <div key={w.ar} className="aw-card" style={{ padding:'18px', animation:`fadeUp 0.3s ${i*0.04}s ease both`, cursor:'pointer' }}
              onClick={() => { setWord(w); setTab('today'); }}>
              <div className="arabic" style={{ fontSize:36, color:'#C9A84C', marginBottom:8, textAlign:'center' }}>{w.ar}</div>
              <div style={{ textAlign:'center', fontFamily:'Cinzel,serif', fontSize:14, fontWeight:600, color:'#E8C97A', marginBottom:3 }}>{w.tr}</div>
              <div style={{ textAlign:'center', fontSize:12, color:'rgba(242,237,228,0.5)', marginBottom:8 }}>{w.en}</div>
              {w.root && <div style={{ textAlign:'center' }}><span className="arabic" style={{ fontSize:12, color:'rgba(201,168,76,0.5)' }}>{w.root}</span></div>}
            </div>
          ))}
        </div>
      )}

      {/* QUIZ */}
      {tab === 'quiz' && quizWord && (
        <div style={{ maxWidth:460, margin:'0 auto' }}>
          <div className="aw-card" style={{ padding:'28px', textAlign:'center', marginBottom:14 }}>
            <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:16 }}>WHAT IS THE MEANING OF</div>
            <div className="arabic" style={{ fontSize:56, color:'#C9A84C', marginBottom:10, lineHeight:1.4 }}>{quizWord.ar}</div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:16, color:'rgba(242,237,228,0.6)', marginBottom:20 }}>{quizWord.tr}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {quizOpts.map(opt => {
                const isCorrect  = opt.ar === quizWord.ar;
                const isSelected = quizAns?.ar === opt.ar;
                return (
                  <button key={opt.ar} onClick={() => !quizAns && setQuizAns(opt)}
                    disabled={!!quizAns}
                    style={{ padding:'13px 18px', background:quizAns ? isCorrect?'rgba(46,204,113,0.15)':isSelected?'rgba(231,76,60,0.1)':'rgba(255,255,255,0.03)' : 'rgba(201,168,76,0.06)', border:`1px solid ${quizAns?isCorrect?'rgba(46,204,113,0.4)':isSelected?'rgba(231,76,60,0.3)':'rgba(201,168,76,0.1)':'rgba(201,168,76,0.15)'}`, borderRadius:12, color:'rgba(242,237,228,0.85)', fontSize:13, cursor:'pointer', fontFamily:'inherit', textAlign:'left', transition:'all 0.2s' }}>
                    {quizAns && isCorrect ? '✅ ' : quizAns && isSelected ? '❌ ' : ''}{opt.en}
                  </button>
                );
              })}
            </div>
            {quizAns && (
              <button onClick={startQuiz}
                style={{ marginTop:16, padding:'11px 28px', background:'linear-gradient(135deg,#C9A84C,#E8C97A)', border:'none', borderRadius:10, color:'#050505', fontFamily:'Cinzel,serif', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                Next Word →
              </button>
            )}
          </div>
        </div>
      )}

      {/* FAVOURITES */}
      {tab === 'favs' && (
        favs.length === 0 ? (
          <div style={{ textAlign:'center', padding:60, color:'rgba(242,237,228,0.3)' }}>
            <div style={{ fontSize:36, marginBottom:12 }}>❤️</div>
            No saved words yet. Tap the heart on any word card!
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
            {favs.map((w,i) => (
              <div key={w.ar} className="aw-card" style={{ padding:'18px', animation:`fadeUp 0.3s ${i*0.05}s ease both`, position:'relative' }}>
                <button onClick={() => toggleFav(w)} style={{ position:'absolute', top:10, right:10, background:'none', border:'none', cursor:'pointer', fontSize:16 }}>❤️</button>
                <div className="arabic" style={{ fontSize:36, color:'#C9A84C', textAlign:'center', marginBottom:8 }}>{w.ar}</div>
                <div style={{ textAlign:'center', fontFamily:'Cinzel,serif', fontSize:14, fontWeight:600, color:'#E8C97A', marginBottom:4 }}>{w.tr}</div>
                <div style={{ textAlign:'center', fontSize:12, color:'rgba(242,237,228,0.5)' }}>{w.en}</div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}