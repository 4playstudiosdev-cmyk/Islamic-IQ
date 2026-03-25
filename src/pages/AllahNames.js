/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Heart, Play, Pause, SkipForward, SkipBack, Loader } from 'lucide-react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .an-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { to{background-position:200% center} }
  @keyframes pulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
  @keyframes wave    { 0%,100%{height:6px} 50%{height:18px} }
  @keyframes flip    { 0%{transform:rotateY(0)} 50%{transform:rotateY(90deg)} 100%{transform:rotateY(0)} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .an-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:16px; cursor:pointer; transition:all 0.3s; }
  .an-card:hover { border-color:rgba(201,168,76,0.3); transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,0.4); }
  .an-card.playing { border-color:rgba(201,168,76,0.5); background:rgba(201,168,76,0.06); }
  .an-card.fav { border-color:rgba(231,76,60,0.3); }
  .tab-btn { background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.1); border-radius:10px; color:rgba(242,237,228,0.5); cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; transition:all 0.25s; padding:9px 16px; }
  .tab-btn.active { background:rgba(201,168,76,0.15); border-color:rgba(201,168,76,0.4); color:#C9A84C; font-weight:700; }
`;

const NAMES = [
  {num:1,  ar:'ٱللَّهُ',          tr:'Allah',          en:'The Greatest Name',           ur:'اللہ'},
  {num:2,  ar:'ٱلرَّحْمَـٰنُ',   tr:'Ar-Rahman',      en:'The Most Gracious',           ur:'رحمان'},
  {num:3,  ar:'ٱلرَّحِيمُ',      tr:'Ar-Raheem',      en:'The Most Merciful',           ur:'رحیم'},
  {num:4,  ar:'ٱلْمَلِكُ',       tr:'Al-Malik',       en:'The King',                    ur:'بادشاہ'},
  {num:5,  ar:'ٱلْقُدُّوسُ',     tr:'Al-Quddus',      en:'The Most Holy',               ur:'پاک'},
  {num:6,  ar:'ٱلسَّلَـٰمُ',     tr:'As-Salam',       en:'The Source of Peace',         ur:'سلامتی'},
  {num:7,  ar:'ٱلْمُؤْمِنُ',     tr:'Al-Mumin',       en:'The Guardian of Faith',       ur:'امن دینے والا'},
  {num:8,  ar:'ٱلْمُهَيْمِنُ',   tr:'Al-Muhaymin',    en:'The Protector',               ur:'نگہبان'},
  {num:9,  ar:'ٱلْعَزِيزُ',      tr:'Al-Aziz',        en:'The Almighty',                ur:'غالب'},
  {num:10, ar:'ٱلْجَبَّارُ',     tr:'Al-Jabbar',      en:'The Compeller',               ur:'زبردست'},
  {num:11, ar:'ٱلْمُتَكَبِّرُ',  tr:'Al-Mutakabbir',  en:'The Supreme',                 ur:'بڑائی والا'},
  {num:12, ar:'ٱلْخَـٰلِقُ',     tr:'Al-Khaliq',      en:'The Creator',                 ur:'خالق'},
  {num:13, ar:'ٱلْبَارِئُ',      tr:'Al-Bari',        en:'The Originator',              ur:'بنانے والا'},
  {num:14, ar:'ٱلْمُصَوِّرُ',    tr:'Al-Musawwir',    en:'The Fashioner',               ur:'صورت بنانے والا'},
  {num:15, ar:'ٱلْغَفَّـٰرُ',    tr:'Al-Ghaffar',     en:'The Forgiving',               ur:'بخشنے والا'},
  {num:16, ar:'ٱلْقَهَّارُ',     tr:'Al-Qahhar',      en:'The Subduer',                 ur:'قہر کرنے والا'},
  {num:17, ar:'ٱلْوَهَّابُ',     tr:'Al-Wahhab',      en:'The Giver of All',            ur:'دینے والا'},
  {num:18, ar:'ٱلرَّزَّاقُ',     tr:'Ar-Razzaq',      en:'The Sustainer',               ur:'رزق دینے والا'},
  {num:19, ar:'ٱلْفَتَّاحُ',     tr:'Al-Fattah',      en:'The Opener',                  ur:'کھولنے والا'},
  {num:20, ar:'ٱلْعَلِيمُ',      tr:'Al-Alim',        en:'The All-Knowing',             ur:'علم والا'},
  {num:21, ar:'ٱلْقَابِضُ',      tr:'Al-Qabid',       en:'The Restrainer',              ur:'روکنے والا'},
  {num:22, ar:'ٱلْبَاسِطُ',      tr:'Al-Basit',       en:'The Extender',                ur:'پھیلانے والا'},
  {num:23, ar:'ٱلْخَافِضُ',      tr:'Al-Khafid',      en:'The Reducer',                 ur:'پست کرنے والا'},
  {num:24, ar:'ٱلرَّافِعُ',      tr:'Ar-Rafi',        en:'The Exalter',                 ur:'بلند کرنے والا'},
  {num:25, ar:'ٱلْمُعِزُّ',      tr:'Al-Muizz',       en:'The Honourer',                ur:'عزت دینے والا'},
  {num:26, ar:'ٱلْمُذِلُّ',      tr:'Al-Mudhill',     en:'The Dishonourer',             ur:'ذلیل کرنے والا'},
  {num:27, ar:'ٱلسَّمِيعُ',      tr:'As-Sami',        en:'The All-Hearing',             ur:'سننے والا'},
  {num:28, ar:'ٱلْبَصِيرُ',      tr:'Al-Basir',       en:'The All-Seeing',              ur:'دیکھنے والا'},
  {num:29, ar:'ٱلْحَكَمُ',       tr:'Al-Hakam',       en:'The Judge',                   ur:'فیصلہ کرنے والا'},
  {num:30, ar:'ٱلْعَدْلُ',       tr:'Al-Adl',         en:'The Just',                    ur:'انصاف والا'},
  {num:31, ar:'ٱللَّطِيفُ',      tr:'Al-Latif',       en:'The Subtle One',              ur:'مہربان'},
  {num:32, ar:'ٱلْخَبِيرُ',      tr:'Al-Khabir',      en:'The Aware',                   ur:'باخبر'},
  {num:33, ar:'ٱلْحَلِيمُ',      tr:'Al-Halim',       en:'The Forbearing',              ur:'بردبار'},
  {num:34, ar:'ٱلْعَظِيمُ',      tr:'Al-Azim',        en:'The Magnificent',             ur:'عظیم'},
  {num:35, ar:'ٱلْغَفُورُ',      tr:'Al-Ghafur',      en:'The Forgiving',               ur:'معاف کرنے والا'},
  {num:36, ar:'ٱلشَّكُورُ',      tr:'Ash-Shakur',     en:'The Appreciative',            ur:'قدردان'},
  {num:37, ar:'ٱلْعَلِىُّ',      tr:'Al-Ali',         en:'The Most High',               ur:'بلند'},
  {num:38, ar:'ٱلْكَبِيرُ',      tr:'Al-Kabir',       en:'The Greatest',                ur:'بڑا'},
  {num:39, ar:'ٱلْحَفِيظُ',      tr:'Al-Hafiz',       en:'The Preserver',               ur:'حفاظت کرنے والا'},
  {num:40, ar:'ٱلْمُقِيتُ',      tr:'Al-Muqit',       en:'The Nourisher',               ur:'روزی دینے والا'},
  {num:41, ar:'ٱلْحَسِيبُ',      tr:'Al-Hasib',       en:'The Reckoner',                ur:'حساب لینے والا'},
  {num:42, ar:'ٱلْجَلِيلُ',      tr:'Al-Jalil',       en:'The Majestic',                ur:'جلال والا'},
  {num:43, ar:'ٱلْكَرِيمُ',      tr:'Al-Karim',       en:'The Most Generous',           ur:'کریم'},
  {num:44, ar:'ٱلرَّقِيبُ',      tr:'Ar-Raqib',       en:'The Watchful',                ur:'نگران'},
  {num:45, ar:'ٱلْمُجِيبُ',      tr:'Al-Mujib',       en:'The Responsive',              ur:'قبول کرنے والا'},
  {num:46, ar:'ٱلْوَاسِعُ',      tr:'Al-Wasi',        en:'The All-Encompassing',        ur:'وسعت والا'},
  {num:47, ar:'ٱلْحَكِيمُ',      tr:'Al-Hakim',       en:'The All-Wise',                ur:'حکمت والا'},
  {num:48, ar:'ٱلْوَدُودُ',      tr:'Al-Wadud',       en:'The Loving',                  ur:'محبت کرنے والا'},
  {num:49, ar:'ٱلْمَجِيدُ',      tr:'Al-Majid',       en:'The Glorious',                ur:'شاندار'},
  {num:50, ar:'ٱلْبَاعِثُ',      tr:'Al-Baath',       en:'The Resurrector',             ur:'اٹھانے والا'},
  {num:51, ar:'ٱلشَّهِيدُ',      tr:'Ash-Shahid',     en:'The Witness',                 ur:'گواہ'},
  {num:52, ar:'ٱلْحَقُّ',        tr:'Al-Haqq',        en:'The Truth',                   ur:'حق'},
  {num:53, ar:'ٱلْوَكِيلُ',      tr:'Al-Wakil',       en:'The Trustee',                 ur:'وکیل'},
  {num:54, ar:'ٱلْقَوِىُّ',      tr:'Al-Qawi',        en:'The All-Strong',              ur:'طاقتور'},
  {num:55, ar:'ٱلْمَتِينُ',      tr:'Al-Matin',       en:'The Firm',                    ur:'مضبوط'},
  {num:56, ar:'ٱلْوَلِىُّ',      tr:'Al-Wali',        en:'The Protecting Friend',       ur:'دوست'},
  {num:57, ar:'ٱلْحَمِيدُ',      tr:'Al-Hamid',       en:'The Praiseworthy',            ur:'قابل تعریف'},
  {num:58, ar:'ٱلْمُحْصِى',      tr:'Al-Muhsi',       en:'The Counter',                 ur:'گننے والا'},
  {num:59, ar:'ٱلْمُبْدِئُ',     tr:'Al-Mubdi',       en:'The Originator',              ur:'ابتدا کرنے والا'},
  {num:60, ar:'ٱلْمُعِيدُ',      tr:'Al-Muid',        en:'The Restorer',                ur:'لوٹانے والا'},
  {num:61, ar:'ٱلْمُحْيِى',      tr:'Al-Muhyi',       en:'The Giver of Life',           ur:'زندگی دینے والا'},
  {num:62, ar:'ٱلْمُمِيتُ',      tr:'Al-Mumit',       en:'The Taker of Life',           ur:'موت دینے والا'},
  {num:63, ar:'ٱلْحَىُّ',        tr:'Al-Hayy',        en:'The Ever-Living',             ur:'ہمیشہ زندہ'},
  {num:64, ar:'ٱلْقَيُّومُ',     tr:'Al-Qayyum',      en:'The Self-Subsisting',         ur:'قائم رہنے والا'},
  {num:65, ar:'ٱلْوَاجِدُ',      tr:'Al-Wajid',       en:'The Finder',                  ur:'پانے والا'},
  {num:66, ar:'ٱلْمَاجِدُ',      tr:'Al-Majid',       en:'The Noble',                   ur:'بزرگ'},
  {num:67, ar:'ٱلْوَاحِدُ',      tr:'Al-Wahid',       en:'The One',                     ur:'ایک'},
  {num:68, ar:'ٱلْأَحَدُ',       tr:'Al-Ahad',        en:'The Unique',                  ur:'یکتا'},
  {num:69, ar:'ٱلصَّمَدُ',       tr:'As-Samad',       en:'The Eternal Refuge',          ur:'بے نیاز'},
  {num:70, ar:'ٱلْقَادِرُ',      tr:'Al-Qadir',       en:'The Capable',                 ur:'قادر'},
  {num:71, ar:'ٱلْمُقْتَدِرُ',   tr:'Al-Muqtadir',   en:'The All-Determiner',          ur:'طاقتور'},
  {num:72, ar:'ٱلْمُقَدِّمُ',    tr:'Al-Muqaddim',    en:'The Expediter',               ur:'آگے کرنے والا'},
  {num:73, ar:'ٱلْمُؤَخِّرُ',    tr:'Al-Muakhkhir',   en:'The Delayer',                 ur:'پیچھے کرنے والا'},
  {num:74, ar:'ٱلْأَوَّلُ',      tr:'Al-Awwal',       en:'The First',                   ur:'اول'},
  {num:75, ar:'ٱلْآخِرُ',        tr:'Al-Akhir',       en:'The Last',                    ur:'آخر'},
  {num:76, ar:'ٱلظَّاهِرُ',      tr:'Az-Zahir',       en:'The Manifest',                ur:'ظاہر'},
  {num:77, ar:'ٱلْبَاطِنُ',      tr:'Al-Batin',       en:'The Hidden',                  ur:'پوشیدہ'},
  {num:78, ar:'ٱلْوَالِى',       tr:'Al-Wali',        en:'The Governor',                ur:'حاکم'},
  {num:79, ar:'ٱلْمُتَعَالِى',   tr:'Al-Mutaali',     en:'The Self Exalted',            ur:'بلند تر'},
  {num:80, ar:'ٱلْبَرُّ',        tr:'Al-Barr',        en:'The Source of Goodness',      ur:'نیکی کرنے والا'},
  {num:81, ar:'ٱلتَّوَّابُ',     tr:'At-Tawwab',      en:'The Ever-Pardoning',          ur:'توبہ قبول کرنے والا'},
  {num:82, ar:'ٱلْمُنْتَقِمُ',   tr:'Al-Muntaqim',    en:'The Avenger',                 ur:'بدلہ لینے والا'},
  {num:83, ar:'ٱلْعَفُوُّ',      tr:'Al-Afuw',        en:'The Pardoner',                ur:'معاف کرنے والا'},
  {num:84, ar:'ٱلرَّءُوفُ',      tr:'Ar-Rauf',        en:'The Most Kind',               ur:'شفقت والا'},
  {num:85, ar:'مَالِكُ ٱلْمُلْكِ',tr:'Malik-ul-Mulk', en:'The Owner of Sovereignty',   ur:'بادشاہی کا مالک'},
  {num:86, ar:'ذُو ٱلْجَلَالِ',  tr:'Dhul-Jalali',    en:'Lord of Majesty',             ur:'جلال والا'},
  {num:87, ar:'ٱلْمُقْسِطُ',     tr:'Al-Muqsit',      en:'The Equitable One',           ur:'انصاف والا'},
  {num:88, ar:'ٱلْجَامِعُ',      tr:'Al-Jami',        en:'The Gatherer',                ur:'جمع کرنے والا'},
  {num:89, ar:'ٱلْغَنِىُّ',      tr:'Al-Ghani',       en:'The Self-Sufficient',         ur:'بے نیاز'},
  {num:90, ar:'ٱلْمُغْنِى',      tr:'Al-Mughni',      en:'The Enricher',                ur:'مالدار کرنے والا'},
  {num:91, ar:'ٱلْمَانِعُ',      tr:'Al-Mani',        en:'The Withholder',              ur:'روکنے والا'},
  {num:92, ar:'ٱلضَّارُّ',       tr:'Ad-Darr',        en:'The Distresser',              ur:'نقصان دینے والا'},
  {num:93, ar:'ٱلنَّافِعُ',      tr:'An-Nafi',        en:'The Propitious',              ur:'نفع دینے والا'},
  {num:94, ar:'ٱلنُّورُ',        tr:'An-Nur',         en:'The Light',                   ur:'نور'},
  {num:95, ar:'ٱلْهَادِى',       tr:'Al-Hadi',        en:'The Guide',                   ur:'ہدایت دینے والا'},
  {num:96, ar:'ٱلْبَدِيعُ',      tr:'Al-Badi',        en:'The Incomparable',            ur:'بے مثال'},
  {num:97, ar:'ٱلْبَاقِى',       tr:'Al-Baqi',        en:'The Everlasting',             ur:'باقی رہنے والا'},
  {num:98, ar:'ٱلْوَارِثُ',      tr:'Al-Warith',      en:'The Inheritor',               ur:'وارث'},
  {num:99, ar:'ٱلرَّشِيدُ',      tr:'Ar-Rashid',      en:'The Guide to Right Path',     ur:'سیدھا راستہ دکھانے والا'},
];

const COLORS = ['#C9A84C','#E8C97A','#2E8B57','#1A5276','#8E44AD','#D35400','#148F77','#B7950B'];

export default function AllahNames() {
  const [tab, setTab]         = useState('all');
  const [search, setSearch]   = useState('');
  const [favs, setFavs]       = useState(() => { try { return JSON.parse(localStorage.getItem('an_favs')||'[]'); } catch { return []; }});
  const [playing, setPlaying] = useState(null);
  const [playAll, setPlayAll] = useState(false);
  const [playIdx, setPlayIdx] = useState(0);
  const [quiz, setQuiz]       = useState(null); // {name, options, selected, correct}
  const audioRef   = useRef(new Audio());
  const playAllRef = useRef(false);

  const saveFavs = (f) => { try { localStorage.setItem('an_favs', JSON.stringify(f)); } catch {} };

  const toggleFav = (num, e) => {
    e.stopPropagation();
    const next = favs.includes(num) ? favs.filter(f=>f!==num) : [...favs, num];
    setFavs(next); saveFavs(next);
  };

  // ── TTS speak ─────────────────────────────────────────────
  const speak = (name, idx, onEnd) => {
    window.speechSynthesis.cancel();
    audioRef.current.pause();
    setPlaying(idx);
    const voices = window.speechSynthesis.getVoices();
    const utter  = new SpeechSynthesisUtterance(`${name.tr}. ${name.en}`);
    const en     = voices.find(v=>v.lang==='en-GB')||voices.find(v=>v.lang.startsWith('en'));
    if (en) utter.voice = en;
    utter.rate = 0.8; utter.pitch = 1.0; utter.volume = 1;
    utter.onend  = () => {
      const ar = new SpeechSynthesisUtterance(name.ar);
      const arV = voices.find(v=>v.lang==='ar-SA')||voices.find(v=>v.lang.startsWith('ar'));
      if (arV) ar.voice = arV;
      ar.lang = 'ar-SA'; ar.rate = 0.6;
      ar.onend = ar.onerror = () => { if (onEnd) onEnd(); else setPlaying(null); };
      window.speechSynthesis.speak(ar);
    };
    utter.onerror = () => { if (onEnd) onEnd(); else setPlaying(null); };
    setTimeout(() => window.speechSynthesis.speak(utter), 80);
  };

  const startPlayAll = () => {
    playAllRef.current = true; setPlayAll(true); setPlayIdx(0); playSeq(0);
  };
  const stopPlayAll = () => {
    playAllRef.current = false; setPlayAll(false);
    window.speechSynthesis.cancel(); setPlaying(null);
  };
  const playSeq = (i) => {
    if (!playAllRef.current || i >= filtered.length) { playAllRef.current=false; setPlayAll(false); setPlaying(null); return; }
    setPlayIdx(i);
    speak(filtered[i], filtered[i].num, () => { if (playAllRef.current) setTimeout(() => playSeq(i+1), 400); });
  };

  useEffect(() => () => { window.speechSynthesis.cancel(); audioRef.current.pause(); }, []);

  // ── Quiz ──────────────────────────────────────────────────
  const newQuiz = () => {
    const correct  = NAMES[Math.floor(Math.random()*99)];
    const opts     = [correct];
    while (opts.length < 4) {
      const r = NAMES[Math.floor(Math.random()*99)];
      if (!opts.find(o=>o.num===r.num)) opts.push(r);
    }
    setQuiz({ name:correct, options:opts.sort(()=>Math.random()-0.5), selected:null, correct:correct.num });
  };

  const filtered = NAMES.filter(n =>
    tab === 'favs' ? favs.includes(n.num) :
    n.tr.toLowerCase().includes(search.toLowerCase()) ||
    n.en.toLowerCase().includes(search.toLowerCase()) ||
    n.ar.includes(search) || String(n.num).includes(search)
  );

  return (
    <div className="an-root" style={{ padding:'24px 28px', maxWidth:1100, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D,#050505)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:22, padding:'28px 30px', marginBottom:22, textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 65%)', pointerEvents:'none' }}/>
        <div className="arabic" style={{ fontSize:52, color:'#C9A84C', marginBottom:6, position:'relative', animation:'pulse 3s ease-in-out infinite' }}>ٱللَّهُ</div>
        <h1 className="gold-shimmer" style={{ fontFamily:'Cinzel,serif', fontSize:22, fontWeight:700, marginBottom:4 }}>Asma-ul-Husna</h1>
        <p style={{ fontSize:12, color:'rgba(242,237,228,0.4)' }}>The 99 Beautiful Names of Allah</p>
        <div className="arabic" style={{ fontSize:14, color:'rgba(201,168,76,0.5)', margin:'10px 0' }}>وَلِلَّهِ ٱلْأَسْمَآءُ ٱلْحُسْنَىٰ فَٱدْعُوهُ بِهَا</div>
        {/* Play all */}
        <div style={{ marginTop:14 }}>
          {!playAll
            ? <button onClick={startPlayAll} style={{ padding:'10px 28px', background:'linear-gradient(135deg,#C9A84C,#E8C97A)', border:'none', borderRadius:50, color:'#050505', fontFamily:'Cinzel,serif', fontSize:13, fontWeight:700, cursor:'pointer' }}>▶ Play All 99 Names</button>
            : <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                <div style={{ fontSize:12, color:'#C9A84C' }}>Playing {playIdx+1}/99...</div>
                <div style={{ width:200, height:4, background:'rgba(255,255,255,0.08)', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${((playIdx+1)/99)*100}%`, background:'linear-gradient(90deg,#C9A84C,#E8C97A)', transition:'width 0.5s' }}/>
                </div>
                <button onClick={stopPlayAll} style={{ padding:'8px 20px', background:'rgba(231,76,60,0.15)', border:'1px solid rgba(231,76,60,0.3)', borderRadius:50, color:'#e74c3c', cursor:'pointer', fontSize:12, fontFamily:'inherit' }}>⏹ Stop</button>
              </div>
          }
        </div>
        {/* Favs count */}
        {favs.length > 0 && <div style={{ marginTop:10, fontSize:11, color:'rgba(231,76,60,0.6)' }}>❤️ {favs.length} favourites saved</div>}
      </div>

      {/* Tabs + Search */}
      <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' }}>
        {[['all',`📿 All (99)`],['favs',`❤️ Favourites (${favs.length})`],['learn','🧠 Learn Mode']].map(([id,label]) => (
          <button key={id} className={`tab-btn ${tab===id?'active':''}`} onClick={() => { setTab(id); if(id==='learn') newQuiz(); }}>{label}</button>
        ))}
        {tab === 'all' && (
          <div style={{ position:'relative', flex:1, minWidth:200 }}>
            <Search size={13} color="rgba(201,168,76,0.4)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or meaning..."
              style={{ width:'100%', padding:'9px 12px 9px 34px', background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:10, color:'#F2EDE4', fontSize:12, fontFamily:'inherit', outline:'none' }}/>
            {search && <button onClick={() => setSearch('')} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(242,237,228,0.3)' }}><X size={12}/></button>}
          </div>
        )}
      </div>

      {/* ══════ LEARN MODE ══════ */}
      {tab === 'learn' && quiz && (
        <div style={{ maxWidth:500, margin:'0 auto' }}>
          <div style={{ background:'#0F0F0D', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'30px', textAlign:'center', marginBottom:16 }}>
            <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:16 }}>WHAT IS THE MEANING OF</div>
            <div className="arabic" style={{ fontSize:48, color:'#C9A84C', marginBottom:8, lineHeight:1.4 }}>{quiz.name.ar}</div>
            <div style={{ fontSize:16, color:'rgba(242,237,228,0.6)', marginBottom:24, fontFamily:'Cinzel,serif' }}>{quiz.name.tr}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {quiz.options.map(opt => {
                const isSelected = quiz.selected === opt.num;
                const isCorrect  = opt.num === quiz.correct;
                const bg = quiz.selected
                  ? isCorrect ? 'rgba(46,204,113,0.15)' : isSelected ? 'rgba(231,76,60,0.15)' : 'rgba(255,255,255,0.03)'
                  : 'rgba(201,168,76,0.06)';
                const border = quiz.selected
                  ? isCorrect ? '1px solid rgba(46,204,113,0.4)' : isSelected ? '1px solid rgba(231,76,60,0.3)' : '1px solid rgba(255,255,255,0.06)'
                  : '1px solid rgba(201,168,76,0.15)';
                return (
                  <button key={opt.num} onClick={() => { if (!quiz.selected) setQuiz(prev => ({ ...prev, selected: opt.num })); }}
                    style={{ padding:'14px 18px', background:bg, border, borderRadius:12, color:'rgba(242,237,228,0.85)', fontSize:13, cursor:'pointer', fontFamily:'inherit', textAlign:'left', transition:'all 0.2s' }}>
                    {quiz.selected && isCorrect && '✅ '}{quiz.selected && isSelected && !isCorrect && '❌ '}{opt.en}
                  </button>
                );
              })}
            </div>
            {quiz.selected && (
              <button onClick={newQuiz} style={{ marginTop:18, padding:'11px 28px', background:'linear-gradient(135deg,#C9A84C,#E8C97A)', border:'none', borderRadius:10, color:'#050505', fontFamily:'Cinzel,serif', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                Next Question →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ══════ NAMES GRID ══════ */}
      {(tab === 'all' || tab === 'favs') && (
        <>
          <div style={{ fontSize:11, color:'rgba(242,237,228,0.3)', marginBottom:14 }}>Showing {filtered.length} names</div>
          {filtered.length === 0 && tab === 'favs' && (
            <div style={{ textAlign:'center', padding:40, color:'rgba(242,237,228,0.3)' }}>
              <div style={{ fontSize:32, marginBottom:12 }}>❤️</div>
              <div>No favourites yet. Tap the heart icon on any name card!</div>
            </div>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12 }}>
            {filtered.map((n, i) => {
              const color   = COLORS[i % COLORS.length];
              const isPlay  = playing === n.num;
              const isFav   = favs.includes(n.num);
              return (
                <div key={n.num} className={`an-card ${isPlay?'playing':''} ${isFav?'fav':''}`}
                  onClick={() => { if (isPlay) { window.speechSynthesis.cancel(); setPlaying(null); } else speak(n, n.num, null); }}
                  style={{ padding:'16px 14px', textAlign:'center', position:'relative', animation:`fadeUp 0.3s ${Math.min(i*0.01,0.4)}s ease both` }}>
                  {/* Number */}
                  <div style={{ position:'absolute', top:10, left:12, width:22, height:22, borderRadius:6, background:`${color}15`, border:`1px solid ${color}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, color, fontFamily:'Cinzel,serif' }}>{n.num}</div>
                  {/* Fav */}
                  <button onClick={e => toggleFav(n.num,e)} style={{ position:'absolute', top:10, right:10, background:'none', border:'none', cursor:'pointer', fontSize:14 }}>
                    {isFav ? '❤️' : '🤍'}
                  </button>
                  {/* Arabic */}
                  <div className="arabic" style={{ fontSize:26, color:'#C9A84C', fontWeight:700, margin:'22px 0 8px', lineHeight:1.5 }}>{n.ar}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'rgba(242,237,228,0.85)', marginBottom:3 }}>{n.tr}</div>
                  <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)', marginBottom:6 }}>{n.en}</div>
                  <div className="arabic" style={{ fontSize:12, color, opacity:0.8 }}>{n.ur}</div>
                  {/* Playing waves */}
                  {isPlay && (
                    <div style={{ display:'flex', justifyContent:'center', gap:3, marginTop:8 }}>
                      {[0,1,2,3].map(j => <div key={j} style={{ width:3, background:color, borderRadius:2, animation:`wave 0.8s ${j*0.1}s ease-in-out infinite` }}/>)}
                    </div>
                  )}
                  {!isPlay && <div style={{ fontSize:10, color:'rgba(201,168,76,0.4)', marginTop:6 }}>🔊 Tap</div>}
                </div>
              );
            })}
          </div>
          {/* Bottom hadith */}
          <div style={{ marginTop:24, background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:14, padding:'16px 20px', textAlign:'center' }}>
            <div className="arabic" style={{ fontSize:14, color:'rgba(201,168,76,0.6)', marginBottom:6 }}>مَنْ أَحْصَاهَا دَخَلَ الْجَنَّةَ</div>
            <div style={{ fontSize:12, color:'rgba(242,237,228,0.3)', fontStyle:'italic' }}>"Whoever memorizes them will enter Paradise." — Sahih Bukhari</div>
          </div>
        </>
      )}
    </div>
  );
}