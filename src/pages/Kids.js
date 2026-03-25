/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Loader, RefreshCw, Star } from 'lucide-react';
import { zyphraSpeak, playAudio } from '../services/zyphraService';

const GROQ_KEY = process.env.REACT_APP_GROQ_KEY || '';
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .kd-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer  { to{background-position:200% center} }
  @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes bounce   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes wave     { 0%,100%{height:6px} 50%{height:18px} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .kd-tab { background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.1); border-radius:10px; color:rgba(242,237,228,0.5); cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; transition:all 0.25s; padding:9px 16px; }
  .kd-tab.active { background:rgba(201,168,76,0.15); border-color:rgba(201,168,76,0.4); color:#C9A84C; font-weight:700; }
  .kd-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:16px; transition:all 0.3s; cursor:pointer; }
  .kd-card:hover { border-color:rgba(201,168,76,0.3); transform:translateY(-2px); }
  .kd-card.active { border-color:rgba(201,168,76,0.4); background:rgba(201,168,76,0.06); }
`;

const ALPHABET = [
  {letter:'ا',name:'Alif',ex:'Allah اللہ'},{letter:'ب',name:'Ba',ex:'Bismillah بسملہ'},
  {letter:'ت',name:'Ta',ex:'Tawbah توبہ'},{letter:'ث',name:'Tha',ex:'Thawab ثواب'},
  {letter:'ج',name:'Jeem',ex:'Jannah جنت'},{letter:'ح',name:'Ha',ex:'Halal حلال'},
  {letter:'خ',name:'Kha',ex:'Khuda خدا'},{letter:'د',name:'Dal',ex:'Dua دعا'},
  {letter:'ذ',name:'Dhal',ex:'Dhikr ذکر'},{letter:'ر',name:'Ra',ex:'Rahmat رحمت'},
  {letter:'ز',name:'Zay',ex:'Zakat زکوٰۃ'},{letter:'س',name:'Seen',ex:'Salat صلوٰۃ'},
  {letter:'ش',name:'Sheen',ex:'Shukar شکر'},{letter:'ص',name:'Sad',ex:'Sabr صبر'},
  {letter:'ض',name:'Dad',ex:'Deen دین'},{letter:'ط',name:'Ta',ex:'Taharat طہارت'},
  {letter:'ظ',name:'Dha',ex:'Zulm ظلم'},{letter:'ع',name:'Ain',ex:'Ibadat عبادت'},
  {letter:'غ',name:'Ghain',ex:'Ghayb غیب'},{letter:'ف',name:'Fa',ex:'Fajr فجر'},
  {letter:'ق',name:'Qaf',ex:'Quran قرآن'},{letter:'ك',name:'Kaf',ex:'Kaaba کعبہ'},
  {letter:'ل',name:'Lam',ex:'Laylah لیلہ'},{letter:'م',name:'Meem',ex:'Masjid مسجد'},
  {letter:'ن',name:'Nun',ex:'Namaz نماز'},{letter:'و',name:'Waw',ex:'Wudu وضو'},
  {letter:'ه',name:'Ha',ex:'Hijrat ہجرت'},{letter:'ي',name:'Ya',ex:'Yaqeen یقین'},
];

const SURAHS = [
  {num:1,  name:'Al-Fatiha',  ar:'الفاتحة', emoji:'🌟', ayats:7  },
  {num:112,name:'Al-Ikhlas',  ar:'الإخلاص', emoji:'💫', ayats:4  },
  {num:113,name:'Al-Falaq',   ar:'الفلق',   emoji:'🌅', ayats:5  },
  {num:114,name:'An-Nas',     ar:'الناس',   emoji:'🌙', ayats:6  },
  {num:108,name:'Al-Kawthar', ar:'الكوثر',  emoji:'🌊', ayats:3  },
  {num:103,name:'Al-Asr',     ar:'العصر',   emoji:'⏰', ayats:3  },
  {num:107,name:'Al-Maoon',   ar:'الماعون', emoji:'🤲', ayats:7  },
  {num:110,name:'An-Nasr',    ar:'النصر',   emoji:'🏆', ayats:3  },
];

const PROPHETS = [
  {name:'Prophet Adam ﷺ',    emoji:'🌿', color:'#1B6B3A'},
  {name:'Prophet Nuh ﷺ',     emoji:'⛵', color:'#1A5276'},
  {name:'Prophet Ibrahim ﷺ', emoji:'🔥', color:'#D35400'},
  {name:'Prophet Yusuf ﷺ',   emoji:'⭐', color:'#B7950B'},
  {name:'Prophet Musa ﷺ',    emoji:'🌊', color:'#1B6B3A'},
  {name:'Prophet Isa ﷺ',     emoji:'✨', color:'#8E44AD'},
  {name:'Prophet Muhammad ﷺ',emoji:'🌙', color:'#C9A84C'},
];

const DUAS = [
  {name:'Before Eating',    ar:'بِسْمِ اللَّهِ',                                en:'In the name of Allah', emoji:'🍽️'},
  {name:'After Eating',     ar:'الْحَمْدُ لِلَّهِ',                             en:'All praise to Allah',  emoji:'✅'},
  {name:'Before Sleeping',  ar:'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',       en:'O Allah, in Your name I die and live', emoji:'🌙'},
  {name:'Upon Waking',      ar:'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا',         en:'Praise Allah who gave us life', emoji:'☀️'},
  {name:'Entering Home',    ar:'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ',en:'O Allah, I ask You for good entry', emoji:'🏠'},
  {name:'Leaving Home',     ar:'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ',     en:'In Allah\'s name, I trust Allah', emoji:'🚪'},
  {name:'Before Study',     ar:'رَبِّ زِدْنِي عِلْمًا',                         en:'My Lord, increase me in knowledge', emoji:'📖'},
  {name:'Dua for Parents',  ar:'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',en:'My Lord, have mercy on them as they raised me', emoji:'❤️'},
];

const POEM_TOPICS = [
  {id:'allah',   title:'Allah is One',      emoji:'✨', color:'#D4AF37'},
  {id:'prophet', title:'Our Prophet ﷺ',    emoji:'🌟', color:'#1B6B3A'},
  {id:'quran',   title:'Holy Quran',        emoji:'📖', color:'#1A5276'},
  {id:'salah',   title:'Time to Pray',      emoji:'🕌', color:'#8E44AD'},
  {id:'jannah',  title:'Gardens of Jannah', emoji:'🌺', color:'#148F77'},
  {id:'parents', title:'Love Your Parents', emoji:'❤️', color:'#E91E8C'},
];

const QUIZ_QS = [
  {q:'How many times do we pray daily?',opts:['3','4','5','6'],ans:2},
  {q:'What is the first word of the Quran?',opts:['Iqra','Bismillah','Alhamdulillah','Rahman'],ans:1},
  {q:'Who is the last Prophet?',opts:['Isa ﷺ','Ibrahim ﷺ','Muhammad ﷺ','Musa ﷺ'],ans:2},
  {q:'How many Surahs in the Quran?',opts:['110','112','114','116'],ans:2},
  {q:'What is the holy book of Islam?',opts:['Bible','Torah','Quran','Zabur'],ans:2},
  {q:'What do we say before eating?',opts:['Alhamdulillah','Bismillah','Mashallah','Subhanallah'],ans:1},
  {q:'Which month do Muslims fast?',opts:['Muharram','Rajab','Ramadan','Shawwal'],ans:2},
  {q:'Where is the Kaaba?',opts:['Madinah','Jerusalem','Makkah','Baghdad'],ans:2},
];

const today = () => new Date().toISOString().split('T')[0];

export default function Kids() {
  const [tab, setTab]       = useState('alphabet');
  const [stars, setStars]   = useState(() => { try { return parseInt(localStorage.getItem('kids_stars')||'0'); } catch { return 0; }});
  const [speaking, setSpeaking] = useState(null);
  const [playingSurah, setPlayingSurah] = useState(null);
  const [poem, setPoem]     = useState(null);
  const [poemTopic, setPoemTopic] = useState(null);
  const [poemLoading, setPoemLoading] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAns, setQuizAns] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const audioRef    = useRef(new Audio());
  const zAudioRef   = useRef(new Audio()); // Zyphra audio
  const [zLoading, setZLoading] = useState(null); // key being loaded

  const addStar = () => setStars(s => { const n=s+1; try{localStorage.setItem('kids_stars',String(n));}catch{} return n; });

  const speak = (text, lang='en-US', rate=0.85) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    if (lang === 'ar-SA') {
      const ar = voices.find(v=>v.lang==='ar-SA')||voices.find(v=>v.lang.startsWith('ar'));
      if (ar) u.voice = ar;
    } else {
      const en = voices.find(v=>v.name.includes('Google UK'))||voices.find(v=>v.lang.startsWith('en'));
      if (en) u.voice = en;
    }
    u.lang = lang; u.rate = rate; u.pitch = 1.1; u.volume = 1;
    u.onend = u.onerror = () => setSpeaking(null);
    window.speechSynthesis.speak(u);
  };

  // ── Zyphra multi-language speak ───────────────────────────────
  const zSpeak = async (texts, key) => {
    setZLoading(key);
    zAudioRef.current.pause();
    window.speechSynthesis.cancel();

    for (const { text, lang } of texts) {
      if (!text?.trim()) continue;
      console.log(`🎵 zSpeak: lang=${lang} text="${text.substring(0,30)}"`);

      // Try Zyphra first
      const blobUrl = await zyphraSpeak(text, lang);

      if (blobUrl) {
        console.log('✅ Playing Zyphra audio');
        await new Promise((resolve) => {
          zAudioRef.current.src = blobUrl;
          zAudioRef.current.volume = 1;
          zAudioRef.current.onended  = resolve;
          zAudioRef.current.onerror  = () => { console.error('Audio playback error'); resolve(); };
          zAudioRef.current.play().catch(e => { console.error('Play error:', e); resolve(); });
        });
      } else {
        // Fallback: browser TTS
        console.log('⚠️ Zyphra failed, using browser TTS');
        await new Promise(resolve => {
          const u = new SpeechSynthesisUtterance(text);
          const voices = window.speechSynthesis.getVoices();
          if (lang === 'ar') {
            const arV = voices.find(v=>v.lang==='ar-SA')||voices.find(v=>v.lang.startsWith('ar'));
            if (arV) { u.voice = arV; u.lang = 'ar-SA'; }
          } else {
            const enV = voices.find(v=>v.lang==='en-GB')||voices.find(v=>v.lang.startsWith('en'));
            if (enV) u.voice = enV;
          }
          u.rate = lang==='ar'?0.6:0.85;
          u.volume = 1;
          u.onend = u.onerror = resolve;
          window.speechSynthesis.speak(u);
        });
      }
      await new Promise(r => setTimeout(r, 300));
    }
    setZLoading(null);
  };

  const playSurah = (s) => {
    audioRef.current.pause();
    if (playingSurah?.num === s.num) { setPlayingSurah(null); return; }
    const num = String(s.num).padStart(3,'0');
    audioRef.current.src = `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${num}.mp3`;
    audioRef.current.play().catch(()=>{});
    setPlayingSurah(s);
    audioRef.current.onended = () => setPlayingSurah(null);
    addStar();
  };

  const loadPoem = async (topic) => {
    setPoemTopic(topic); setPoem(null); setPoemLoading(true);
    const cacheKey = `kids_poem_${topic.id}_${today()}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) { setPoem(JSON.parse(cached)); setPoemLoading(false); return; }
    } catch {}
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method:'POST',
        headers:{'Authorization':`Bearer ${GROQ_KEY}`,'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'llama-3.3-70b-versatile',
          messages:[{role:'user',content:`Write a short Islamic poem for children (age 5-10) about "${topic.title}".
4 stanzas, 4 lines each, simple rhyming words.
Then provide Urdu translation.
Return ONLY JSON: {"title":"...","english":"full poem with \\n","urdu":"urdu translation with \\n","moral":"one sentence lesson"}`}],
          max_tokens:800, temperature:0.8,
        }),
      });
      const d   = await res.json();
      const txt = d.choices?.[0]?.message?.content||'{}';
      const m   = txt.match(/\{[\s\S]*\}/);
      if (m) { const p=JSON.parse(m[0]); setPoem(p); try{localStorage.setItem(cacheKey,JSON.stringify(p));}catch{} addStar(); }
    } catch { setPoem({title:topic.title,english:'Could not load poem. Try again!',urdu:'',moral:''}); }
    setPoemLoading(false);
  };

  const answerQuiz = (idx) => {
    if (quizAns !== null) return;
    setQuizAns(idx);
    if (idx === QUIZ_QS[quizIdx].ans) { setQuizScore(s=>s+1); addStar(); }
    setTimeout(() => {
      if (quizIdx+1 >= QUIZ_QS.length) setQuizDone(true);
      else { setQuizIdx(i=>i+1); setQuizAns(null); }
    }, 1200);
  };

  const resetQuiz = () => { setQuizIdx(0); setQuizAns(null); setQuizScore(0); setQuizDone(false); };

  useEffect(() => () => { window.speechSynthesis.cancel(); audioRef.current.pause(); zAudioRef.current.pause(); }, []);

  const TABS = [
    {id:'alphabet',label:'🔤 Alphabet'},{id:'surahs',label:'📖 Surahs'},
    {id:'duas',label:'🤲 Duas'},{id:'stories',label:'📚 Stories'},
    {id:'poems',label:'🎵 Poems'},{id:'quiz',label:'🧠 Quiz'},
  ];

  return (
    <div className="kd-root" style={{ padding:'24px 28px', maxWidth:1000, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#6B2FA0,#8E44AD)', border:'1px solid rgba(142,68,173,0.3)', borderRadius:20, padding:'22px 28px', marginBottom:22, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, background:'radial-gradient(ellipse,rgba(255,255,255,0.1),transparent)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:14, position:'relative' }}>
          <div style={{ fontSize:36 }}>🌟</div>
          <div>
            <h1 style={{ fontSize:20, fontWeight:800, color:'white', marginBottom:2 }}>Kids Islamic Learning</h1>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.6)' }}>Tap to listen and learn! 🎵</p>
          </div>
          <div style={{ marginLeft:'auto', background:'rgba(255,255,255,0.15)', borderRadius:12, padding:'10px 16px', textAlign:'center' }}>
            <div style={{ fontSize:20, fontWeight:800, color:'#f5d060' }}>⭐ {stars}</div>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.6)' }}>Stars</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:22, overflowX:'auto', paddingBottom:2 }}>
        {TABS.map(t => <button key={t.id} className={`kd-tab ${tab===t.id?'active':''}`} onClick={()=>setTab(t.id)} style={{ flexShrink:0 }}>{t.label}</button>)}
      </div>

      {/* ══ ALPHABET ══ */}
      {tab === 'alphabet' && (
        <div>
          <p style={{ fontSize:13, color:'rgba(242,237,228,0.4)', marginBottom:16 }}>Tap any letter to hear it! 🔊</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(90px,1fr))', gap:10 }}>
            {ALPHABET.map((a,i) => (
              <div key={a.letter} onClick={async () => {
                  if (zLoading === `alpha_${i}`) return;
                  setSpeaking(i); addStar();
                  await zSpeak([
                    { text: a.name, lang:'en' },          // English name
                    { text: a.letter, lang:'ar' },         // Arabic letter
                    { text: a.ex.split(' ')[0], lang:'en' }, // Example word
                  ], `alpha_${i}`);
                  setSpeaking(null);
                }}
                style={{ background: speaking===i?'rgba(142,68,173,0.2)':'#0F0F0D', border:`1px solid ${speaking===i?'rgba(142,68,173,0.5)':'rgba(201,168,76,0.1)'}`, borderRadius:12, padding:'14px 8px', textAlign:'center', cursor:'pointer', transition:'all 0.2s', animation:`fadeUp 0.3s ${Math.min(i*0.02,0.4)}s ease both` }}>
                <div className="arabic" style={{ fontSize:32, color:'#C9A84C', fontWeight:700 }}>{a.letter}</div>
                <div style={{ fontSize:11, fontWeight:600, color:'rgba(242,237,228,0.7)', marginTop:4 }}>{a.name}</div>
                <div style={{ fontSize:10, color:'rgba(242,237,228,0.3)', marginTop:2 }}>{a.ex.split(' ')[0]}</div>
                {(speaking===i || zLoading===`alpha_${i}`) && (
                  <div style={{ display:'flex', justifyContent:'center', gap:2, marginTop:4 }}>
                    {zLoading===`alpha_${i}` ? <Loader size={10} color="#8E44AD" style={{animation:'spin 1s linear infinite'}}/> :
                    [0,1,2].map(j=><div key={j} style={{width:3,background:'#8E44AD',borderRadius:2,animation:`wave 0.8s ${j*0.15}s infinite`}}/>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ SURAHS ══ */}
      {tab === 'surahs' && (
        <div>
          <p style={{ fontSize:13, color:'rgba(242,237,228,0.4)', marginBottom:16 }}>Listen to short Surahs! Tap to play 🎵</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
            {SURAHS.map((s,i) => {
              const isPlaying = playingSurah?.num === s.num;
              return (
                <div key={s.num} onClick={() => playSurah(s)} className={`kd-card ${isPlaying?'active':''}`}
                  style={{ padding:'18px 16px', animation:`fadeUp 0.3s ${i*0.07}s ease both` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                    <div style={{ fontSize:28 }}>{s.emoji}</div>
                    {isPlaying
                      ? <Pause size={18} color="#C9A84C"/>
                      : <Play size={18} color="rgba(201,168,76,0.5)"/>}
                  </div>
                  <div className="arabic" style={{ fontSize:20, color:'#C9A84C', marginBottom:4 }}>{s.ar}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:'rgba(242,237,228,0.8)' }}>{s.name}</div>
                  <div style={{ fontSize:11, color:'rgba(242,237,228,0.35)', marginTop:2 }}>{s.ayats} Ayats</div>
                  {isPlaying && <div style={{ display:'flex', gap:3, marginTop:8 }}>{[0,1,2,3,4].map(j=><div key={j} style={{width:4,background:'#C9A84C',borderRadius:2,animation:`wave 0.8s ${j*0.1}s infinite`}}/>)}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ DUAS ══ */}
      {tab === 'duas' && (
        <div>
          <p style={{ fontSize:13, color:'rgba(242,237,228,0.4)', marginBottom:16 }}>Daily duas for kids! Tap to listen 🤲</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
            {DUAS.map((d,i) => (
              <div key={d.name} className="kd-card" style={{ padding:'18px', animation:`fadeUp 0.3s ${i*0.07}s ease both` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div style={{ fontSize:24 }}>{d.emoji}</div>
                  <div style={{ display:'flex', gap:5 }}>
                    <button onClick={async () => { addStar(); await zSpeak([{ text:`${d.name}. ${d.en}`, lang:'en'}], `dua_en_${d.name}`); }}
                      style={{ padding:'5px 10px', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:8, color:'#C9A84C', cursor:'pointer', fontSize:10, display:'flex', alignItems:'center', gap:4 }}>
                      {zLoading===`dua_en_${d.name}` ? <Loader size={9} style={{animation:'spin 1s linear infinite'}}/> : <Volume2 size={10}/>} EN
                    </button>
                    <button onClick={async () => { addStar(); await zSpeak([{ text: d.ar, lang:'ar'}], `dua_ar_${d.name}`); }}
                      style={{ padding:'5px 10px', background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:8, color:'#E8C97A', cursor:'pointer', fontSize:10, display:'flex', alignItems:'center', gap:4 }}>
                      {zLoading===`dua_ar_${d.name}` ? <Loader size={9} style={{animation:'spin 1s linear infinite'}}/> : <Volume2 size={10}/>} AR
                    </button>
                    <button onClick={async () => { addStar(); await zSpeak([{text:d.ar,lang:'ar'},{text:d.en,lang:'en'}], `dua_all_${d.name}`); }}
                      style={{ padding:'5px 10px', background:'linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.08))', border:'1px solid rgba(201,168,76,0.3)', borderRadius:8, color:'#C9A84C', cursor:'pointer', fontSize:10, fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                      {zLoading===`dua_all_${d.name}` ? <Loader size={9} style={{animation:'spin 1s linear infinite'}}/> : '🔊'} All
                    </button>
                  </div>
                </div>
                <div style={{ fontSize:12, fontWeight:700, color:'rgba(242,237,228,0.7)', marginBottom:8 }}>{d.name}</div>
                <div className="arabic" style={{ fontSize:16, color:'#C9A84C', lineHeight:2, marginBottom:6, direction:'rtl' }}>{d.ar}</div>
                <div style={{ fontSize:12, color:'rgba(242,237,228,0.45)', fontStyle:'italic' }}>{d.en}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ STORIES ══ */}
      {tab === 'stories' && (
        <div>
          <p style={{ fontSize:13, color:'rgba(242,237,228,0.4)', marginBottom:16 }}>AI stories about Prophets! 📚</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
            {PROPHETS.map((p,i) => (
              <ProphetStory key={p.name} prophet={p} i={i} addStar={addStar}/>
            ))}
          </div>
        </div>
      )}

      {/* ══ POEMS ══ */}
      {tab === 'poems' && (
        <div>
          <p style={{ fontSize:13, color:'rgba(242,237,228,0.4)', marginBottom:16 }}>AI Islamic poems with Urdu translation! 🎵</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))', gap:10, marginBottom:20 }}>
            {POEM_TOPICS.map(t => (
              <div key={t.id} onClick={() => loadPoem(t)}
                style={{ background: poemTopic?.id===t.id?`${t.color}22`:'#0F0F0D', border:`1px solid ${poemTopic?.id===t.id?`${t.color}55`:'rgba(201,168,76,0.1)'}`, borderRadius:14, padding:'14px 10px', cursor:'pointer', textAlign:'center', transition:'all 0.2s' }}>
                <div style={{ fontSize:26, marginBottom:6 }}>{t.emoji}</div>
                <div style={{ fontSize:11, fontWeight:700, color:'rgba(242,237,228,0.8)' }}>{t.title}</div>
              </div>
            ))}
          </div>
          {poemLoading && <div style={{ textAlign:'center', padding:40 }}><Loader size={24} color="#C9A84C" style={{ animation:'spin 1s linear infinite' }}/><div style={{ color:'rgba(242,237,228,0.4)', fontSize:13, marginTop:12 }}>Writing poem...</div></div>}
          {poem && !poemLoading && (
            <div style={{ background:'#0F0F0D', border:`1px solid ${poemTopic?.color||'#C9A84C'}33`, borderRadius:18, overflow:'hidden' }}>
              <div style={{ background:`linear-gradient(135deg,${poemTopic?.color||'#C9A84C'}cc,${poemTopic?.color||'#C9A84C'}88)`, padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ fontSize:15, fontWeight:800, color:'white' }}>{poem.title}</div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  <button onClick={async () => { addStar(); await zSpeak([{text:poem.english,lang:'en'}],'poem_en'); }}
                    style={{ padding:'6px 11px', background:'rgba(0,0,0,0.2)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:8, color:'white', cursor:'pointer', fontSize:10, display:'flex', alignItems:'center', gap:4 }}>
                    {zLoading==='poem_en'?<Loader size={9} style={{animation:'spin 1s linear infinite'}}/>:'🔊'} EN
                  </button>
                  {poem.urdu && <button onClick={async () => { addStar(); await zSpeak([{text:poem.urdu,lang:'ur'}],'poem_ur'); }}
                    style={{ padding:'6px 11px', background:'rgba(0,0,0,0.2)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:8, color:'#f5d060', cursor:'pointer', fontSize:10, display:'flex', alignItems:'center', gap:4 }}>
                    {zLoading==='poem_ur'?<Loader size={9} style={{animation:'spin 1s linear infinite'}}/>:'🔊'} UR
                  </button>}
                  <button onClick={async () => { addStar(); await zSpeak([{text:poem.english,lang:'en'},{text:poem.urdu||'',lang:'ur'}],'poem_all'); }}
                    style={{ padding:'6px 11px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:8, color:'white', cursor:'pointer', fontSize:10, fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                    {zLoading==='poem_all'?<Loader size={9} style={{animation:'spin 1s linear infinite'}}/>:'🔊'} EN+UR
                  </button>
                  <button onClick={() => loadPoem(poemTopic)} style={{ padding:'6px 10px', background:'rgba(0,0,0,0.2)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:8, color:'white', cursor:'pointer', fontSize:10 }}><RefreshCw size={11}/></button>
                </div>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap' }}>
                <div style={{ flex:'1 1 240px', padding:'20px', borderRight:`1px solid ${poemTopic?.color||'#C9A84C'}22` }}>
                  <div style={{ fontSize:10, color:'rgba(242,237,228,0.4)', letterSpacing:1, marginBottom:10 }}>🇬🇧 ENGLISH</div>
                  <div style={{ fontSize:13, color:'rgba(242,237,228,0.7)', lineHeight:2.2, whiteSpace:'pre-line', fontStyle:'italic' }}>{poem.english}</div>
                </div>
                {poem.urdu && <div style={{ flex:'1 1 240px', padding:'20px' }}>
                  <div style={{ fontSize:10, color:'rgba(242,237,228,0.4)', letterSpacing:1, marginBottom:10 }}>🇵🇰 URDU</div>
                  <div className="arabic" style={{ fontSize:15, color:'#C9A84C', lineHeight:2.4, whiteSpace:'pre-line' }}>{poem.urdu}</div>
                </div>}
              </div>
              {poem.moral && <div style={{ margin:'0 20px 20px', background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:10, padding:'10px 14px' }}>
                <span style={{ fontSize:11, color:'#C9A84C', fontWeight:700 }}>💡 Lesson: </span>
                <span style={{ fontSize:12, color:'rgba(242,237,228,0.6)' }}>{poem.moral}</span>
              </div>}
            </div>
          )}
        </div>
      )}

      {/* ══ QUIZ ══ */}
      {tab === 'quiz' && (
        <div style={{ maxWidth:500, margin:'0 auto' }}>
          {quizDone ? (
            <div style={{ textAlign:'center', padding:'40px 20px' }}>
              <div style={{ fontSize:48, marginBottom:12 }}>{quizScore>=6?'🏆':quizScore>=4?'⭐':'📚'}</div>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:22, fontWeight:700, color:'#C9A84C', marginBottom:6 }}>Quiz Complete!</div>
              <div style={{ fontSize:32, color:'#E8C97A', fontFamily:'Cinzel,serif', marginBottom:16 }}>{quizScore}/{QUIZ_QS.length}</div>
              <button onClick={resetQuiz} style={{ padding:'12px 28px', background:'linear-gradient(135deg,#C9A84C,#E8C97A)', border:'none', borderRadius:10, color:'#050505', fontFamily:'Cinzel,serif', fontSize:13, fontWeight:700, cursor:'pointer' }}>Try Again!</button>
            </div>
          ) : (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <div style={{ fontSize:12, color:'rgba(201,168,76,0.6)', fontFamily:'Cinzel,serif' }}>Question {quizIdx+1}/{QUIZ_QS.length}</div>
                <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:13, color:'#f5d060' }}><Star size={13}/>{quizScore}</div>
              </div>
              <div style={{ background:'#0F0F0D', border:'1px solid rgba(201,168,76,0.15)', borderRadius:16, padding:'22px', marginBottom:14 }}>
                <div style={{ fontSize:16, fontWeight:600, color:'rgba(242,237,228,0.9)', lineHeight:1.6 }}>{QUIZ_QS[quizIdx].q}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {QUIZ_QS[quizIdx].opts.map((opt, i) => {
                  const isCorrect = i === QUIZ_QS[quizIdx].ans;
                  const isSelected= i === quizAns;
                  const bg = quizAns!==null ? isCorrect?'rgba(46,204,113,0.15)':isSelected?'rgba(231,76,60,0.1)':'rgba(255,255,255,0.03)' : 'rgba(201,168,76,0.06)';
                  const bc = quizAns!==null ? isCorrect?'rgba(46,204,113,0.4)':isSelected?'rgba(231,76,60,0.3)':'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.15)';
                  return (
                    <button key={i} onClick={() => answerQuiz(i)} disabled={quizAns!==null}
                      style={{ padding:'14px 18px', background:bg, border:`1px solid ${bc}`, borderRadius:12, color:'rgba(242,237,228,0.85)', fontSize:13, cursor:'pointer', fontFamily:'inherit', textAlign:'left', transition:'all 0.2s' }}>
                      {quizAns!==null&&isCorrect?'✅ ':''}
                      {quizAns!==null&&isSelected&&!isCorrect?'❌ ':''}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Prophet Story Component ───────────────────────────────────
function ProphetStory({ prophet, i, addStar }) {
  const [story, setStory]   = useState(null);
  const [loading, setLoading] = useState(false);

  const loadStory = async () => {
    if (story || loading) return;
    setLoading(true);
    const cacheKey = `story_${prophet.name}_${new Date().toISOString().split('T')[0]}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) { setStory(cached); setLoading(false); addStar(); return; }
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method:'POST',
        headers:{'Authorization':`Bearer ${process.env.REACT_APP_GROQ_KEY||''}`,'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'llama-3.3-70b-versatile',
          messages:[{role:'user',content:`Tell a short, engaging Islamic story about ${prophet.name} for children aged 5-10. Maximum 150 words. Make it educational and inspiring. Focus on one key lesson.`}],
          max_tokens:300, temperature:0.8,
        }),
      });
      const d = await res.json();
      const s = d.choices?.[0]?.message?.content||'Story not available.';
      setStory(s); try{localStorage.setItem(cacheKey,s);}catch{} addStar();
    } catch { setStory('Could not load story. Please try again.'); }
    setLoading(false);
  };

  return (
    <div style={{ background:'#0F0F0D', border:`1px solid ${prophet.color}22`, borderRadius:16, padding:'16px', animation:`fadeUp 0.3s ${i*0.07}s ease both`, transition:'all 0.3s' }}>
      <div style={{ fontSize:28, marginBottom:8 }}>{prophet.emoji}</div>
      <div style={{ fontSize:12, fontWeight:700, color:prophet.color, marginBottom:8 }}>{prophet.name}</div>
      {!story && !loading && (
        <button onClick={loadStory} style={{ width:'100%', padding:'9px', background:`${prophet.color}15`, border:`1px solid ${prophet.color}30`, borderRadius:8, color:prophet.color, cursor:'pointer', fontSize:11, fontFamily:'inherit' }}>
          📖 Read Story
        </button>
      )}
      {loading && <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'rgba(242,237,228,0.4)' }}><Loader size={12} style={{animation:'spin 1s linear infinite'}}/>Loading...</div>}
      {story && <div style={{ fontSize:12, color:'rgba(242,237,228,0.65)', lineHeight:1.75 }}>{story}</div>}
    </div>
  );
}