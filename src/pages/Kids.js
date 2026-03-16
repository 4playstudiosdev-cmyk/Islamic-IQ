/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Loader, RefreshCw } from 'lucide-react';
import axios from 'axios';

// ✅ Add your Groq key here
const GROQ_KEY = process.env.REACT_APP_GROQ_KEY || '';

const today = () => new Date().toISOString().split('T')[0];

// ── Arabic alphabet ────────────────────────────────────────────
const ALPHABET = [
  {letter:'ا',name:'Alif', exEng:'Allah'},  {letter:'ب',name:'Ba',   exEng:'Bism'},
  {letter:'ت',name:'Ta',   exEng:'Taqwa'},  {letter:'ث',name:'Tha',  exEng:'Thawab'},
  {letter:'ج',name:'Jeem', exEng:'Jannat'}, {letter:'ح',name:'Ha',   exEng:'Halal'},
  {letter:'خ',name:'Kha',  exEng:'Khuda'},  {letter:'د',name:'Dal',  exEng:'Dua'},
  {letter:'ذ',name:'Dhal', exEng:'Dhikr'},  {letter:'ر',name:'Ra',   exEng:'Rahmat'},
  {letter:'ز',name:'Zay',  exEng:'Zakat'},  {letter:'س',name:'Seen', exEng:'Salam'},
  {letter:'ش',name:'Sheen',exEng:'Shukar'}, {letter:'ص',name:'Sad',  exEng:'Sabr'},
  {letter:'ض',name:'Dad',  exEng:'Zaroor'}, {letter:'ط',name:'Ta',   exEng:'Taharat'},
  {letter:'ظ',name:'Dha',  exEng:'Zulm'},   {letter:'ع',name:'Ain',  exEng:'Ibadat'},
  {letter:'غ',name:'Ghain',exEng:'Ghayb'},  {letter:'ف',name:'Fa',   exEng:'Fajr'},
  {letter:'ق',name:'Qaf',  exEng:'Quran'},  {letter:'ك',name:'Kaf',  exEng:'Kaaba'},
  {letter:'ل',name:'Lam',  exEng:'Laylah'}, {letter:'م',name:'Meem', exEng:'Masjid'},
  {letter:'ن',name:'Nun',  exEng:'Namaz'},  {letter:'و',name:'Waw',  exEng:'Wudu'},
  {letter:'ه',name:'Ha',   exEng:'Hijrat'}, {letter:'ي',name:'Ya',   exEng:'Yaqeen'},
];

// ── Short surahs ───────────────────────────────────────────────
const KID_SURAHS = [
  {num:1,   name:'Al-Fatiha',  arabic:'الفاتحة',  ayats:7,  emoji:'🌟', meaning:'The Opening'},
  {num:112, name:'Al-Ikhlas',  arabic:'الإخلاص',  ayats:4,  emoji:'💫', meaning:'The Sincerity'},
  {num:113, name:'Al-Falaq',   arabic:'الفلق',    ayats:5,  emoji:'🌅', meaning:'The Daybreak'},
  {num:114, name:'An-Nas',     arabic:'الناس',    ayats:6,  emoji:'🌙', meaning:'The People'},
  {num:108, name:'Al-Kawthar', arabic:'الكوثر',   ayats:3,  emoji:'🌊', meaning:'The Abundance'},
  {num:103, name:'Al-Asr',     arabic:'العصر',    ayats:3,  emoji:'⏰', meaning:'The Time'},
  {num:107, name:'Al-Maoon',   arabic:'الماعون',  ayats:7,  emoji:'🤲', meaning:'The Assistance'},
  {num:110, name:'An-Nasr',    arabic:'النصر',    ayats:3,  emoji:'🏆', meaning:'The Victory'},
  {num:109, name:'Al-Kafirun', arabic:'الكافرون', ayats:6,  emoji:'✨', meaning:'The Disbelievers'},
  {num:105, name:'Al-Feel',    arabic:'الفيل',    ayats:5,  emoji:'🐘', meaning:'The Elephant'},
];

// ── Prophet story topics ───────────────────────────────────────
const PROPHET_STORIES = [
  {name:'Prophet Adam ﷺ',    emoji:'🌿', color:'#1B6B3A'},
  {name:'Prophet Nuh ﷺ',     emoji:'⛵', color:'#1A5276'},
  {name:'Prophet Ibrahim ﷺ', emoji:'🔥', color:'#D35400'},
  {name:'Prophet Yusuf ﷺ',   emoji:'⭐', color:'#B7950B'},
  {name:'Prophet Musa ﷺ',    emoji:'🌊', color:'#1B6B3A'},
  {name:'Prophet Dawud ﷺ',   emoji:'🎵', color:'#8E44AD'},
  {name:'Prophet Yunus ﷺ',   emoji:'🐋', color:'#1A5276'},
  {name:'Prophet Isa ﷺ',     emoji:'🕊️', color:'#148F77'},
  {name:'Prophet Muhammad ﷺ',emoji:'🌟', color:'#D4AF37'},
];

// ── Duas with Quran ayat audio URLs ───────────────────────────
// Audio from everyayah.com CDN (same as Quran reader)
const getAyatAudio = (surah, ayat) => {
  const s = String(surah).padStart(3,'0');
  const a = String(ayat).padStart(3,'0');
  return `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;
};

const DUAS = [
  {
    title:'Surah Al-Fatiha (Full)',
    emoji:'🌟', 
    arabic:'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    english:'In the name of Allah, the Most Gracious, the Most Merciful. All praise is for Allah, Lord of all worlds.',
    // Play full Al-Fatiha ayats 1-7
    audioUrls: [1,2,3,4,5,6,7].map(a => getAyatAudio(1, a)),
  },
  {
    title:'Bismillah',
    emoji:'✨',
    arabic:'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    english:'In the name of Allah, the Most Gracious, the Most Merciful.',
    audioUrls: [getAyatAudio(1, 1)],
  },
  {
    title:'Surah Al-Ikhlas',
    emoji:'💫',
    arabic:'قُلْ هُوَ اللَّهُ أَحَدٌ اللَّهُ الصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ',
    english:'Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born.',
    audioUrls: [1,2,3,4].map(a => getAyatAudio(112, a)),
  },
  {
    title:'Surah Al-Falaq',
    emoji:'🌅',
    arabic:'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ مِن شَرِّ مَا خَلَقَ',
    english:'Say: I seek refuge in the Lord of daybreak, from the evil of what He has created.',
    audioUrls: [1,2,3,4,5].map(a => getAyatAudio(113, a)),
  },
  {
    title:'Surah An-Nas',
    emoji:'🌙',
    arabic:'قُلْ أَعُوذُ بِرَبِّ النَّاسِ مَلِكِ النَّاسِ إِلَٰهِ النَّاسِ',
    english:'Say: I seek refuge in the Lord of mankind, the King of mankind, the God of mankind.',
    audioUrls: [1,2,3,4,5,6].map(a => getAyatAudio(114, a)),
  },
  {
    title:'Ayat al-Kursi',
    emoji:'👑',
    arabic:'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    english:'Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence.',
    audioUrls: [getAyatAudio(2, 255)],
  },
  {
    title:'Surah Al-Asr',
    emoji:'⏰',
    arabic:'وَالْعَصْرِ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ إِلَّا الَّذِينَ آمَنُوا',
    english:'By time, indeed, mankind is in loss — except those who believe and do good deeds.',
    audioUrls: [1,2,3].map(a => getAyatAudio(103, a)),
  },
  {
    title:'Surah Al-Kawthar',
    emoji:'🌊',
    arabic:'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ فَصَلِّ لِرَبِّكَ وَانْحَرْ',
    english:'Indeed, We have granted you Al-Kawthar. So pray to your Lord and sacrifice.',
    audioUrls: [1,2,3].map(a => getAyatAudio(108, a)),
  },
  {
    title:'Dua for Parents',
    emoji:'❤️',
    arabic:'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    english:'My Lord have mercy on them as they raised me when I was young.',
    audioUrls: [getAyatAudio(17, 24)],
  },
  {
    title:'Dua for Knowledge',
    emoji:'📚',
    arabic:'رَّبِّ زِدْنِي عِلْمًا',
    english:'My Lord, increase me in knowledge.',
    audioUrls: [getAyatAudio(20, 114)],
  },
];

// ── Speak Arabic using Arabic TTS ─────────────────────────────
function speakEnglish(text, onEnd) {
  window.speechSynthesis.cancel();
  const voices = window.speechSynthesis.getVoices();
  const utter  = new SpeechSynthesisUtterance(text);
  const best   = voices.find(v => v.name.includes('Google UK') || v.name.includes('Zira') || v.lang === 'en-GB')
               || voices.find(v => v.lang.startsWith('en'));
  if (best) utter.voice = best;
  utter.lang = 'en-US'; utter.rate = 0.82; utter.pitch = 1.05;
  utter.onend = onEnd; utter.onerror = onEnd;
  window.speechSynthesis.speak(utter);
}

// ── Main Kids component ────────────────────────────────────────
export default function Kids() {
  const [tab, setTab]     = useState('alphabet');
  const [stars, setStars] = useState(() => {
    try { return parseInt(localStorage.getItem('kids_stars') || '0'); } catch { return 0; }
  });

  const addStar = () => setStars(s => {
    const n = s + 1;
    try { localStorage.setItem('kids_stars', String(n)); } catch {}
    return n;
  });

  const TABS = [
    {id:'alphabet', label:'🔤 Alphabet', color:'#8E44AD'},
    {id:'surahs',   label:'📖 Surahs',   color:'#1B6B3A'},
    {id:'stories',  label:'📚 Stories',  color:'#D35400'},
    {id:'duas',     label:'🤲 Duas',     color:'#1A5276'},
  ];

  return (
    <div style={{padding:'20px 24px', maxWidth:940, margin:'0 auto'}}>
      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#6B2FA0,#8E44AD)', borderRadius:20, padding:'18px 22px', marginBottom:20, display:'flex', alignItems:'center', gap:14}}>
        <span style={{fontSize:36}}>🌟</span>
        <div>
          <h1 style={{fontSize:18, fontWeight:800, color:'white'}}>Kids Islamic Learning</h1>
          <p style={{fontSize:11, color:'rgba(255,255,255,0.7)', marginTop:2}}>Tap to listen and learn! 🎵</p>
        </div>
        <div style={{marginLeft:'auto', background:'rgba(255,255,255,0.15)', borderRadius:12, padding:'8px 14px', textAlign:'center'}}>
          <div style={{fontSize:20, fontWeight:800, color:'#f5d060'}}>⭐ {stars}</div>
          <div style={{fontSize:9, color:'rgba(255,255,255,0.6)'}}>Stars</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:'flex', gap:8, marginBottom:20, overflowX:'auto'}}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{flexShrink:0, background: tab===t.id ? `${t.color}30` : 'var(--dark-card)', border:`1px solid ${tab===t.id ? t.color : 'rgba(255,255,255,0.08)'}`, borderRadius:12, padding:'9px 18px', cursor:'pointer', fontSize:13, fontWeight: tab===t.id ? 700 : 400, color: tab===t.id ? 'white' : '#7a9585'}}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'alphabet' && <AlphabetTab onStar={addStar}/>}
      {tab === 'surahs'   && <SurahsTab   onStar={addStar}/>}
      {tab === 'stories'  && <StoriesTab  onStar={addStar}/>}
      {tab === 'duas'     && <DuasTab     onStar={addStar}/>}
    </div>
  );
}

// ── ALPHABET TAB ───────────────────────────────────────────────
function AlphabetTab({onStar}) {
  const [active, setActive]   = useState(null);
  const [speaking, setSpeaking] = useState(null);

  const play = (a, i) => {
    setActive(i); setSpeaking(i);
    // Say name in English then Arabic letter
    speakEnglish(`${a.name}. Example: ${a.exEng}`, () => {
      setSpeaking(null); onStar();
    });
  };

  return (
    <div>
      <p style={{fontSize:12, color:'#4a6355', marginBottom:14}}>Tap any letter to hear its name! 🎵</p>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(88px,1fr))', gap:9}}>
        {ALPHABET.map((a,i) => (
          <button key={i} onClick={() => play(a,i)} style={{background: active===i ? 'rgba(142,68,173,0.25)' : 'var(--dark-card)', border:`2px solid ${active===i ? '#8E44AD' : 'rgba(142,68,173,0.12)'}`, borderRadius:14, padding:'13px 6px', cursor:'pointer', textAlign:'center', transform: active===i ? 'scale(1.06)' : 'scale(1)', transition:'all 0.2s'}}>
            <div className="arabic" style={{fontSize:28, color:'#D4AF37', marginBottom:3}}>{a.letter}</div>
            <div style={{fontSize:11, fontWeight:600, color:'white', marginBottom:1}}>{a.name}</div>
            <div style={{fontSize:9, color:'#4a6355'}}>{a.exEng}</div>
            {speaking===i && <div style={{marginTop:4, display:'flex', justifyContent:'center', gap:2}}>{[0,1,2].map(j=><div key={j} style={{width:3,height:8,background:'#8E44AD',borderRadius:2,animation:`pulse 0.6s ease ${j*0.15}s infinite`}}/>)}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── SURAHS TAB ─────────────────────────────────────────────────
function SurahsTab({onStar}) {
  const [playing, setPlaying] = useState(null);
  const [loading, setLoading] = useState(null);
  const audioRef = useRef(null);

  // ✅ Fix: create audio element properly
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = 'anonymous';
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const playSurah = (s, i) => {
    const audio = audioRef.current;
    if (!audio) return;

    // If already playing this one, stop it
    if (playing === i) {
      audio.pause();
      audio.src = '';
      setPlaying(null);
      return;
    }

    // Stop previous
    audio.pause();
    audio.src = '';
    setPlaying(null);
    setLoading(i);

    // ✅ Use everyayah.com for individual ayats or quranicaudio for full surah
    const num = String(s.num).padStart(3, '0');
    const url = `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${num}.mp3`;

    audio.src = url;
    audio.load();

    audio.oncanplaythrough = () => {
      setLoading(null);
      setPlaying(i);
      audio.play().catch(err => {
        console.error('Play failed:', err);
        setLoading(null);
        setPlaying(null);
        // Try alternative URL
        const altUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${num}.mp3`;
        audio.src = altUrl;
        audio.load();
        audio.play().then(() => setPlaying(i)).catch(() => setPlaying(null));
      });
    };

    audio.onended = () => { setPlaying(null); onStar(); };
    audio.onerror = () => {
      setLoading(null);
      setPlaying(null);
      // Try backup CDN
      const backupUrl = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${num}.mp3`;
      if (audio.src !== backupUrl) {
        audio.src = backupUrl;
        audio.load();
        audio.play().then(() => setPlaying(i)).catch(() => {});
      }
    };
  };

  return (
    <div>
      <p style={{fontSize:12, color:'#4a6355', marginBottom:14}}>Tap Listen to hear the Surah recitation! 🎵</p>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12}}>
        {KID_SURAHS.map((s,i) => (
          <div key={i} style={{background:'var(--dark-card)', border:`1px solid ${playing===i ? 'rgba(46,139,87,0.5)' : 'rgba(46,139,87,0.1)'}`, borderRadius:16, padding:'18px 14px', textAlign:'center', boxShadow: playing===i ? '0 4px 20px rgba(46,139,87,0.2)' : 'none', transition:'all 0.3s'}}>
            <div style={{fontSize:32, marginBottom:8}}>{s.emoji}</div>
            <div className="arabic" style={{fontSize:16, color:'#D4AF37', marginBottom:4}}>{s.arabic}</div>
            <div style={{fontSize:13, fontWeight:700, color:'white', marginBottom:2}}>{s.name}</div>
            <div style={{fontSize:10, color:'#4a6355', marginBottom:12}}>{s.meaning} · {s.ayats} ayats</div>
            <button onClick={() => playSurah(s,i)} style={{width:'100%', background: playing===i ? 'rgba(231,76,60,0.2)' : 'linear-gradient(135deg,#1B6B3A,#2E8B57)', border: playing===i ? '1px solid rgba(231,76,60,0.4)' : 'none', borderRadius:10, padding:'9px', cursor:'pointer', color:'white', fontSize:12, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:6}}>
              {loading===i ? <><Loader size={13} style={{animation:'spin 1s linear infinite'}}/> Loading...</> : playing===i ? <><Pause size={13}/> Stop</> : <><Play size={13}/> Listen</>}
            </button>
            {playing===i && (
              <div style={{display:'flex', justifyContent:'center', gap:3, marginTop:8}}>
                {[0,1,2,3].map(j=><div key={j} style={{width:3,height:14,background:'#3aad6e',borderRadius:2,animation:`pulse 0.8s ease ${j*0.15}s infinite`}}/>)}
              </div>
            )}
          </div>
        ))}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── STORIES TAB ────────────────────────────────────────────────
function StoriesTab({onStar}) {
  const [selected, setSelected] = useState(null);
  const [stories, setStories]   = useState([]); // array of story objects
  const [loading, setLoading]   = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [activeStory, setActiveStory] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchStories = async (prophet, count = 5, append = false) => {
    if (!append) { setLoading(true); setStories([]); setActiveStory(0); }
    else setLoadingMore(true);

    const cacheKey = `kids_stories_${prophet.name}_${today()}`;

    // Check cache
    if (!append) {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.length > 0) {
            setStories(parsed);
            setLoading(false);
            return;
          }
        }
      } catch {}
    }

    try {
      const existing = append ? stories.map(s => s.title).join(', ') : '';
      const res = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [{
            role: 'user',
            content: `Generate ${count} different Islamic stories for children (ages 6-12) about ${prophet.name}.

${append ? `Do NOT repeat these already shown stories: ${existing}` : ''}

Requirements for EACH story:
- Full complete story (300-400 words)
- Simple words a child can understand
- Fun, engaging, like a bedtime story  
- Include the main miracle or key event in detail
- Include dialogue when possible
- End with a clear moral lesson
- Islamic values throughout

Return ONLY a valid JSON array, no other text:
[
  {
    "title": "Story title here",
    "story": "Full complete story text here (300-400 words)...",
    "lesson": "The moral lesson of this story"
  }
]`
          }],
          max_tokens: 3000,
          temperature: 0.8,
        },
        {headers:{'Authorization':`Bearer ${GROQ_KEY}`,'Content-Type':'application/json'}}
      );

      const text = res.data.choices[0].message.content;
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) throw new Error('Invalid response');

      const parsed = JSON.parse(match[0]);
      const valid  = parsed.filter(s => s.title && s.story && s.story.length > 50);

      if (append) {
        const combined = [...stories, ...valid];
        setStories(combined);
        try { localStorage.setItem(cacheKey, JSON.stringify(combined)); } catch {}
      } else {
        setStories(valid);
        try { localStorage.setItem(cacheKey, JSON.stringify(valid)); } catch {}
      }
      onStar();
    } catch (e) {
      // Fallback static
      if (!append) setStories([getStaticStory(prophet.name)]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const selectProphet = (p) => {
    setSelected(p);
    window.speechSynthesis.cancel();
    setSpeaking(false);
    fetchStories(p, 5, false);
  };

  const speakStory = (text) => {
    if (speaking) { speakEnglish('', () => {}); window.speechSynthesis.cancel(); setSpeaking(false); return; }
    setSpeaking(true);
    speakEnglish(text, () => setSpeaking(false));
  };

  const getStaticStory = (name) => ({
    title: `The Story of ${name}`,
    story: `Once upon a time, there was a great prophet named ${name}. This prophet loved Allah more than anything in the world. Every day, the prophet would pray to Allah and ask for guidance. The prophet was always kind to everyone — to the poor, to animals, and even to those who were unkind. Allah gave this prophet special miracles to help people believe. Many people followed the prophet and learned to worship only Allah. The prophet taught everyone that we should be honest, kind, and always remember Allah. Even when things were very hard and difficult, the prophet never gave up. Allah always helped and protected the prophet. And because of the prophet's patience and love for Allah, everything worked out beautifully in the end.`,
    lesson: 'Always trust in Allah and be patient. Allah loves those who are patient and kind.'
  });

  const cur = stories[activeStory];

  return (
    <div style={{display:'flex', gap:18, flexWrap:'wrap'}}>
      {/* Prophet list */}
      <div style={{width:200, flexShrink:0}}>
        <p style={{fontSize:12, color:'#4a6355', marginBottom:12}}>Choose a Prophet ✨</p>
        {PROPHET_STORIES.map((p,i) => (
          <button key={i} onClick={() => selectProphet(p)} style={{width:'100%', background: selected?.name===p.name ? `${p.color}22` : 'var(--dark-card)', border:`1px solid ${selected?.name===p.name ? p.color+'55' : 'rgba(255,255,255,0.06)'}`, borderLeft:`3px solid ${selected?.name===p.name ? p.color : 'transparent'}`, borderRadius:10, padding:'10px 12px', cursor:'pointer', textAlign:'left', marginBottom:7, transition:'all 0.2s'}}>
            <div style={{display:'flex', alignItems:'center', gap:8}}>
              <span style={{fontSize:18}}>{p.emoji}</span>
              <span style={{fontSize:11, fontWeight:600, color: selected?.name===p.name ? 'white' : '#c0d4c8'}}>{p.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Story area */}
      <div style={{flex:1, minWidth:280}}>
        {!selected ? (
          <div style={{height:300, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', opacity:0.5}}>
            <span style={{fontSize:48, marginBottom:10}}>📚</span>
            <p style={{fontSize:13, color:'#4a6355'}}>Select a Prophet to read their story!</p>
          </div>
        ) : loading ? (
          <div style={{background:'var(--dark-card)', borderRadius:16, padding:40, textAlign:'center'}}>
            <Loader size={30} color="#D35400" style={{animation:'spin 1s linear infinite', marginBottom:14}}/>
            <p style={{color:'#4a6355', fontSize:13}}>🤖 AI is writing stories of {selected.name}...</p>
            <p style={{color:'#2a3a2f', fontSize:11, marginTop:6}}>Generating 5 complete stories...</p>
          </div>
        ) : cur ? (
          <div style={{background:`${selected.color}12`, border:`1px solid ${selected.color}33`, borderRadius:18, padding:'20px 22px'}}>
            {/* Story tabs */}
            <div style={{display:'flex', gap:6, marginBottom:16, overflowX:'auto', paddingBottom:4}}>
              {stories.map((s,i) => (
                <button key={i} onClick={() => setActiveStory(i)} style={{flexShrink:0, background: activeStory===i ? `${selected.color}33` : 'rgba(255,255,255,0.06)', border:`1px solid ${activeStory===i ? selected.color+'55' : 'rgba(255,255,255,0.08)'}`, borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:11, fontWeight: activeStory===i ? 600 : 400, color: activeStory===i ? 'white' : '#7a9585', whiteSpace:'nowrap'}}>
                  Story {i+1}
                </button>
              ))}
              {/* Load more button */}
              <button onClick={() => fetchStories(selected, 5, true)} disabled={loadingMore} style={{flexShrink:0, background:'rgba(212,175,55,0.1)', border:'1px solid rgba(212,175,55,0.25)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:11, color:'#D4AF37', display:'flex', alignItems:'center', gap:4, whiteSpace:'nowrap'}}>
                {loadingMore ? <><Loader size={10} style={{animation:'spin 1s linear infinite'}}/> Loading...</> : '+ More Stories'}
              </button>
            </div>

            {/* Story header */}
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14}}>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <span style={{fontSize:26}}>{selected.emoji}</span>
                <div>
                  <div style={{fontSize:14, fontWeight:800, color:'white'}}>{cur.title}</div>
                  <div style={{fontSize:11, color:selected.color}}>{selected.name}</div>
                </div>
              </div>
              <div style={{display:'flex', gap:7}}>
                <button onClick={() => speakStory(cur.story)} style={{background: speaking ? `${selected.color}33` : 'rgba(255,255,255,0.08)', border:`1px solid ${speaking ? selected.color+'55' : 'rgba(255,255,255,0.1)'}`, borderRadius:9, padding:'7px 12px', cursor:'pointer', color: speaking ? 'white' : '#7a9585', fontSize:11, fontWeight:600, display:'flex', alignItems:'center', gap:5}}>
                  {speaking ? <><Pause size={12}/> Stop</> : <><Volume2 size={12}/> Listen</>}
                </button>
                <button onClick={() => { try { localStorage.removeItem(`kids_stories_${selected.name}_${today()}`); } catch {} fetchStories(selected, 5, false); }} style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:9, padding:'7px 10px', cursor:'pointer', color:'#4a6355', fontSize:11}}>
                  <RefreshCw size={12}/>
                </button>
              </div>
            </div>

            {/* Story text */}
            <div style={{fontSize:14, color:'#c0d4c8', lineHeight:1.9, marginBottom:16, whiteSpace:'pre-wrap'}}>{cur.story}</div>

            {/* Lesson */}
            {cur.lesson && (
              <div style={{background:'rgba(212,175,55,0.1)', border:'1px solid rgba(212,175,55,0.25)', borderRadius:10, padding:'12px 14px'}}>
                <div style={{fontSize:11, color:'#D4AF37', fontWeight:700, marginBottom:4}}>🌟 Lesson</div>
                <div style={{fontSize:13, color:'#c0d4c8', lineHeight:1.6}}>{cur.lesson}</div>
              </div>
            )}
          </div>
        ) : null}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── DUAS TAB ───────────────────────────────────────────────────
function DuasTab({onStar}) {
  const [playing, setPlaying]   = useState(null);
  const [phase, setPhase]       = useState(null); // 'arabic' | 'english'
  const [loading, setLoading]   = useState(null);
  const [dispLang, setDispLang] = useState('both');
  const audioRef = useRef(null);
  const ayatIdxRef = useRef(0);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = 'anonymous';
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
      window.speechSynthesis.cancel();
    };
  }, []);

  // Play ayats one by one from the audioUrls array
  const playAyatSequence = (urls, idx, onDone) => {
    if (idx >= urls.length) { onDone(); return; }
    const audio = audioRef.current;
    audio.src = urls[idx];
    audio.load();
    ayatIdxRef.current = idx;
    audio.oncanplaythrough = () => {};
    audio.onended = () => playAyatSequence(urls, idx + 1, onDone);
    audio.onerror = () => playAyatSequence(urls, idx + 1, onDone); // skip failed, continue
    audio.play().catch(() => playAyatSequence(urls, idx + 1, onDone));
  };

  const playDua = (dua, i) => {
    // Stop anything playing
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.onended = null; audioRef.current.src = ''; }
    window.speechSynthesis.cancel();

    if (playing === i) { setPlaying(null); setPhase(null); setLoading(null); return; }

    setPlaying(i);
    setPhase('arabic');
    setLoading(i);

    // Step 1: Play all Arabic audio ayats sequentially
    playAyatSequence(dua.audioUrls, 0, () => {
      setLoading(null);
      // Step 2: After all Arabic audio, speak English meaning
      setPhase('english');
      const voices = window.speechSynthesis.getVoices();
      const utter  = new SpeechSynthesisUtterance(dua.english);
      const enVoice = voices.find(v => v.name.includes('Google UK'))
                   || voices.find(v => v.name.includes('Zira'))
                   || voices.find(v => v.lang === 'en-GB')
                   || voices.find(v => v.lang.startsWith('en'));
      if (enVoice) utter.voice = enVoice;
      utter.lang = 'en-US'; utter.rate = 0.82; utter.pitch = 1.05;
      utter.onend  = () => { setPlaying(null); setPhase(null); onStar(); };
      utter.onerror= () => { setPlaying(null); setPhase(null); };
      window.speechSynthesis.speak(utter);
    });
  };

  const stopAll = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.onended = null; audioRef.current.src = ''; }
    window.speechSynthesis.cancel();
    setPlaying(null); setPhase(null); setLoading(null);
  };

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14}}>
        <p style={{fontSize:12, color:'#4a6355'}}>🎵 Arabic dua plays first, then English meaning</p>
        <div style={{display:'flex', background:'rgba(0,0,0,0.2)', borderRadius:8, padding:3}}>
          {[{v:'arabic',l:'AR'},{v:'english',l:'EN'},{v:'both',l:'Both'}].map(({v,l}) => (
            <button key={v} onClick={() => setDispLang(v)} style={{background: dispLang===v ? 'rgba(26,82,118,0.4)' : 'transparent', border:'none', borderRadius:6, padding:'4px 10px', color: dispLang===v ? 'white' : 'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:11, fontWeight: dispLang===v ? 600 : 400}}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12}}>
        {DUAS.map((dua,i) => (
          <div key={i} style={{background: playing===i ? 'rgba(26,82,118,0.15)' : 'var(--dark-card)', border:`1px solid ${playing===i ? 'rgba(26,82,118,0.4)' : 'rgba(26,82,118,0.1)'}`, borderRadius:16, padding:'16px 18px', transition:'all 0.3s'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <span style={{fontSize:20}}>{dua.emoji}</span>
                <span style={{fontSize:13, fontWeight:700, color:'white'}}>{dua.title}</span>
              </div>
              <button onClick={() => playing===i ? stopAll() : playDua(dua,i)} style={{background: playing===i ? 'rgba(231,76,60,0.2)' : 'rgba(26,82,118,0.2)', border:`1px solid ${playing===i ? 'rgba(231,76,60,0.3)' : 'rgba(26,82,118,0.3)'}`, borderRadius:8, padding:'6px 10px', cursor:'pointer', color: playing===i ? '#e74c3c' : '#5dade2', display:'flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600}}>
                {playing===i ? <><Pause size={12}/> Stop</> : <><Volume2 size={12}/> 🔊 Listen</>}
              </button>
            </div>

            {(dispLang==='arabic'||dispLang==='both') && (
              <div className="arabic" style={{fontSize:17, color:'#f5d060', lineHeight:2, marginBottom: dispLang==='both' ? 8 : 0, padding:'8px 0', borderBottom: dispLang==='both' ? '1px solid rgba(255,255,255,0.06)' : 'none'}}>{dua.arabic}</div>
            )}
            {(dispLang==='english'||dispLang==='both') && (
              <div style={{fontSize:12, color:'#7a9585', lineHeight:1.7, fontStyle:'italic', marginTop: dispLang==='both' ? 4 : 0}}>"{dua.english}"</div>
            )}

            {playing===i && (
              <div style={{marginTop:8}}>
                <div style={{fontSize:10, color: phase==='arabic' ? '#D4AF37' : '#5dade2', marginBottom:4, fontWeight:600}}>
                  {loading===i ? '⏳ Loading audio...' : phase==='arabic' ? '🔊 Playing Arabic recitation...' : '🔊 Playing English meaning...'}
                </div>
                <div style={{display:'flex', gap:3}}>
                  {[0,1,2,3].map(j=><div key={j} style={{width:3,height:10,background: phase==='arabic' ? '#D4AF37' : '#5dade2',borderRadius:2,animation:`pulse 0.8s ease ${j*0.15}s infinite`}}/>)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}