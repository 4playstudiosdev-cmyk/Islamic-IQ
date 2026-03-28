/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Grid, List, Loader, ZoomIn, ZoomOut } from 'lucide-react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .qr-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { to{background-position:200% center} }
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .qr-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:14px; cursor:pointer; transition:all 0.25s; }
  .qr-card:hover { border-color:rgba(201,168,76,0.3); transform:translateY(-2px); }
  .qr-card.active { border-color:rgba(201,168,76,0.5); background:rgba(201,168,76,0.08); }
  .qr-page-img { max-width:100%; border-radius:8px; box-shadow:0 8px 32px rgba(0,0,0,0.6); transition:opacity 0.3s; }
  .qr-page-img.loading { opacity:0.3; }
  .tab-btn { background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.1); border-radius:10px; color:rgba(242,237,228,0.5); cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; transition:all 0.25s; padding:9px 16px; white-space:nowrap; }
  .tab-btn.active { background:rgba(201,168,76,0.15); border-color:rgba(201,168,76,0.4); color:#C9A84C; font-weight:700; }
`;

// Surah data — name, page number in Madina Mushaf (Quran.com uses this)
const SURAHS = [
  {n:1,  name:'Al-Fatiha',      ar:'الفاتحة', page:1,   juz:1 },
  {n:2,  name:'Al-Baqarah',     ar:'البقرة',  page:2,   juz:1 },
  {n:3,  name:'Aal-Imran',      ar:'آل عمران',page:50,  juz:3 },
  {n:4,  name:'An-Nisa',        ar:'النساء',  page:77,  juz:4 },
  {n:5,  name:'Al-Maidah',      ar:'المائدة', page:106, juz:6 },
  {n:6,  name:'Al-Anam',        ar:'الأنعام', page:128, juz:7 },
  {n:7,  name:'Al-Araf',        ar:'الأعراف', page:151, juz:8 },
  {n:8,  name:'Al-Anfal',       ar:'الأنفال', page:177, juz:9 },
  {n:9,  name:'At-Tawbah',      ar:'التوبة',  page:187, juz:10},
  {n:10, name:"Yunus",          ar:'يونس',    page:208, juz:11},
  {n:11, name:'Hud',            ar:'هود',     page:221, juz:11},
  {n:12, name:'Yusuf',          ar:'يوسف',    page:235, juz:12},
  {n:13, name:"Ar-Ra'd",        ar:'الرعد',   page:249, juz:13},
  {n:14, name:'Ibrahim',        ar:'إبراهيم', page:255, juz:13},
  {n:15, name:'Al-Hijr',        ar:'الحجر',   page:262, juz:14},
  {n:16, name:'An-Nahl',        ar:'النحل',   page:267, juz:14},
  {n:17, name:"Al-Isra",        ar:'الإسراء', page:282, juz:15},
  {n:18, name:'Al-Kahf',        ar:'الكهف',   page:293, juz:15},
  {n:19, name:'Maryam',         ar:'مريم',    page:305, juz:16},
  {n:20, name:'Ta-Ha',          ar:'طه',      page:312, juz:16},
  {n:21, name:"Al-Anbiya",      ar:'الأنبياء',page:322, juz:17},
  {n:22, name:'Al-Hajj',        ar:'الحج',    page:332, juz:17},
  {n:23, name:"Al-Muminun",     ar:'المؤمنون',page:342, juz:18},
  {n:24, name:'An-Nur',         ar:'النور',   page:350, juz:18},
  {n:25, name:'Al-Furqan',      ar:'الفرقان', page:359, juz:18},
  {n:26, name:"Ash-Shu'ara",    ar:'الشعراء', page:367, juz:19},
  {n:27, name:'An-Naml',        ar:'النمل',   page:377, juz:19},
  {n:28, name:'Al-Qasas',       ar:'القصص',   page:385, juz:20},
  {n:29, name:"Al-Ankabut",     ar:'العنكبوت',page:396, juz:20},
  {n:30, name:'Ar-Rum',         ar:'الروم',   page:404, juz:21},
  {n:31, name:'Luqman',         ar:'لقمان',   page:411, juz:21},
  {n:32, name:'As-Sajdah',      ar:'السجدة',  page:415, juz:21},
  {n:33, name:'Al-Ahzab',       ar:'الأحزاب', page:418, juz:21},
  {n:34, name:"Saba",           ar:'سبأ',     page:428, juz:22},
  {n:35, name:'Fatir',          ar:'فاطر',    page:434, juz:22},
  {n:36, name:'Ya-Sin',         ar:'يس',      page:440, juz:22},
  {n:37, name:"As-Saffat",      ar:'الصافات', page:446, juz:23},
  {n:38, name:'Sad',            ar:'ص',       page:453, juz:23},
  {n:39, name:'Az-Zumar',       ar:'الزمر',   page:458, juz:23},
  {n:40, name:'Ghafir',         ar:'غافر',    page:467, juz:24},
  {n:41, name:'Fussilat',       ar:'فصلت',    page:477, juz:24},
  {n:42, name:'Ash-Shura',      ar:'الشورى',  page:483, juz:25},
  {n:43, name:'Az-Zukhruf',     ar:'الزخرف',  page:489, juz:25},
  {n:44, name:'Ad-Dukhan',      ar:'الدخان',  page:496, juz:25},
  {n:45, name:'Al-Jathiyah',    ar:'الجاثية', page:499, juz:25},
  {n:46, name:'Al-Ahqaf',       ar:'الأحقاف', page:502, juz:26},
  {n:47, name:'Muhammad',       ar:'محمد',    page:507, juz:26},
  {n:48, name:'Al-Fath',        ar:'الفتح',   page:511, juz:26},
  {n:49, name:'Al-Hujurat',     ar:'الحجرات', page:515, juz:26},
  {n:50, name:'Qaf',            ar:'ق',       page:518, juz:26},
  {n:51, name:'Adh-Dhariyat',   ar:'الذاريات',page:520, juz:26},
  {n:52, name:'At-Tur',         ar:'الطور',   page:523, juz:27},
  {n:53, name:'An-Najm',        ar:'النجم',   page:526, juz:27},
  {n:54, name:'Al-Qamar',       ar:'القمر',   page:528, juz:27},
  {n:55, name:'Ar-Rahman',      ar:'الرحمن',  page:531, juz:27},
  {n:56, name:"Al-Waqiah",      ar:'الواقعة', page:534, juz:27},
  {n:57, name:'Al-Hadid',       ar:'الحديد',  page:537, juz:27},
  {n:58, name:'Al-Mujadila',    ar:'المجادلة',page:542, juz:28},
  {n:59, name:'Al-Hashr',       ar:'الحشر',   page:545, juz:28},
  {n:60, name:'Al-Mumtahanah',  ar:'الممتحنة',page:549, juz:28},
  {n:61, name:'As-Saf',         ar:'الصف',    page:551, juz:28},
  {n:62, name:"Al-Jumu'ah",     ar:'الجمعة',  page:553, juz:28},
  {n:63, name:'Al-Munafiqun',   ar:'المنافقون',page:554, juz:28},
  {n:64, name:'At-Taghabun',    ar:'التغابن', page:556, juz:28},
  {n:65, name:'At-Talaq',       ar:'الطلاق',  page:558, juz:28},
  {n:66, name:'At-Tahrim',      ar:'التحريم', page:560, juz:28},
  {n:67, name:'Al-Mulk',        ar:'الملك',   page:562, juz:29},
  {n:68, name:'Al-Qalam',       ar:'القلم',   page:564, juz:29},
  {n:69, name:"Al-Haqqah",      ar:'الحاقة',  page:566, juz:29},
  {n:70, name:"Al-Ma'arij",     ar:'المعارج', page:568, juz:29},
  {n:71, name:'Nuh',            ar:'نوح',     page:570, juz:29},
  {n:72, name:'Al-Jinn',        ar:'الجن',    page:572, juz:29},
  {n:73, name:'Al-Muzzammil',   ar:'المزمل',  page:574, juz:29},
  {n:74, name:'Al-Muddaththir', ar:'المدثر',  page:575, juz:29},
  {n:75, name:'Al-Qiyamah',     ar:'القيامة', page:577, juz:29},
  {n:76, name:'Al-Insan',       ar:'الإنسان', page:578, juz:29},
  {n:77, name:'Al-Mursalat',    ar:'المرسلات',page:580, juz:29},
  {n:78, name:"An-Naba",        ar:'النبأ',   page:582, juz:30},
  {n:79, name:"An-Nazi'at",     ar:'النازعات',page:583, juz:30},
  {n:80, name:'Abasa',          ar:'عبس',     page:585, juz:30},
  {n:81, name:'At-Takwir',      ar:'التكوير', page:586, juz:30},
  {n:82, name:'Al-Infitar',     ar:'الانفطار',page:587, juz:30},
  {n:83, name:'Al-Mutaffifin',  ar:'المطففين',page:587, juz:30},
  {n:84, name:'Al-Inshiqaq',    ar:'الانشقاق',page:589, juz:30},
  {n:85, name:'Al-Buruj',       ar:'البروج',  page:590, juz:30},
  {n:86, name:'At-Tariq',       ar:'الطارق',  page:591, juz:30},
  {n:87, name:"Al-A'la",        ar:'الأعلى',  page:591, juz:30},
  {n:88, name:'Al-Ghashiyah',   ar:'الغاشية', page:592, juz:30},
  {n:89, name:'Al-Fajr',        ar:'الفجر',   page:593, juz:30},
  {n:90, name:'Al-Balad',       ar:'البلد',   page:594, juz:30},
  {n:91, name:'Ash-Shams',      ar:'الشمس',   page:595, juz:30},
  {n:92, name:'Al-Layl',        ar:'الليل',   page:595, juz:30},
  {n:93, name:'Ad-Duha',        ar:'الضحى',   page:596, juz:30},
  {n:94, name:'Ash-Sharh',      ar:'الشرح',   page:596, juz:30},
  {n:95, name:'At-Tin',         ar:'التين',   page:597, juz:30},
  {n:96, name:"Al-'Alaq",       ar:'العلق',   page:597, juz:30},
  {n:97, name:'Al-Qadr',        ar:'القدر',   page:598, juz:30},
  {n:98, name:'Al-Bayyinah',    ar:'البينة',  page:598, juz:30},
  {n:99, name:'Az-Zalzalah',    ar:'الزلزلة', page:599, juz:30},
  {n:100,name:"Al-'Adiyat",     ar:'العاديات',page:599, juz:30},
  {n:101,name:"Al-Qari'ah",     ar:'القارعة', page:600, juz:30},
  {n:102,name:'At-Takathur',    ar:'التكاثر', page:600, juz:30},
  {n:103,name:"Al-'Asr",        ar:'العصر',   page:601, juz:30},
  {n:104,name:'Al-Humazah',     ar:'الهمزة',  page:601, juz:30},
  {n:105,name:'Al-Fil',         ar:'الفيل',   page:601, juz:30},
  {n:106,name:'Quraysh',        ar:'قريش',    page:602, juz:30},
  {n:107,name:"Al-Ma'un",       ar:'الماعون', page:602, juz:30},
  {n:108,name:'Al-Kawthar',     ar:'الكوثر',  page:602, juz:30},
  {n:109,name:'Al-Kafirun',     ar:'الكافرون',page:603, juz:30},
  {n:110,name:'An-Nasr',        ar:'النصر',   page:603, juz:30},
  {n:111,name:'Al-Masad',       ar:'المسد',   page:603, juz:30},
  {n:112,name:'Al-Ikhlas',      ar:'الإخلاص', page:604, juz:30},
  {n:113,name:'Al-Falaq',       ar:'الفلق',   page:604, juz:30},
  {n:114,name:'An-Nas',         ar:'الناس',   page:604, juz:30},
];

const JUZ_PAGES = [
  {juz:1,page:1},{juz:2,page:22},{juz:3,page:42},{juz:4,page:62},{juz:5,page:82},
  {juz:6,page:102},{juz:7,page:122},{juz:8,page:142},{juz:9,page:162},{juz:10,page:182},
  {juz:11,page:202},{juz:12,page:222},{juz:13,page:242},{juz:14,page:262},{juz:15,page:282},
  {juz:16,page:302},{juz:17,page:322},{juz:18,page:342},{juz:19,page:362},{juz:20,page:382},
  {juz:21,page:402},{juz:22,page:422},{juz:23,page:442},{juz:24,page:462},{juz:25,page:482},
  {juz:26,page:502},{juz:27,page:522},{juz:28,page:542},{juz:29,page:562},{juz:30,page:582},
];

// Get page image URL from quran.com CDN
const getPageUrl = (page) => {
  const p = String(page).padStart(3, '0');
  return `https://static.quran.com/downloads/madani/images/jpg/page${p}.jpg`;
};

// Get which surah starts on this page
const getSurahAtPage = (page) => SURAHS.filter(s => s.page <= page).pop();
const getJuzAtPage   = (page) => JUZ_PAGES.filter(j => j.page <= page).pop()?.juz || 1;

export default function QuranReader() {
  const [tab, setTab]         = useState('read');   // 'read' | 'surah' | 'juz'
  const [page, setPage]       = useState(() => { try { return parseInt(localStorage.getItem('qr_page')||'1'); } catch { return 1; }});
  const [imgLoaded, setImgLoaded] = useState(false);
  const [zoom, setZoom]       = useState(100);
  const [search, setSearch]   = useState('');
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'double'
  const imgRef = useRef(null);

  const TOTAL_PAGES = 604;

  const goToPage = (p) => {
    const clamped = Math.max(1, Math.min(TOTAL_PAGES, p));
    setPage(clamped);
    setImgLoaded(false);
    try { localStorage.setItem('qr_page', String(clamped)); } catch {}
  };

  const curSurah = getSurahAtPage(page);
  const curJuz   = getJuzAtPage(page);

  const filteredSurahs = SURAHS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.ar.includes(search) ||
    String(s.n).includes(search)
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (tab !== 'read') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToPage(page + 1);
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goToPage(page - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [page, tab]);

  return (
    <div className="qr-root" style={{ padding:'20px 24px', maxWidth:1000, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'20px 26px', marginBottom:20, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at top right,rgba(201,168,76,0.06),transparent 60%)', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:14, position:'relative', flexWrap:'wrap' }}>
          <div style={{ width:48, height:48, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>📖</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:3, color:'rgba(201,168,76,0.6)', marginBottom:3 }}>HOLY QURAN</div>
            <h1 className="gold-shimmer" style={{ fontSize:20, fontWeight:800, fontFamily:'Cinzel,serif' }}>Quran Reader</h1>
            <div style={{ fontSize:12, color:'rgba(242,237,228,0.4)', marginTop:2 }}>
              {tab==='read' && `Page ${page} of ${TOTAL_PAGES} · ${curSurah?.name||''} · Juz ${curJuz}`}
              {tab==='surah' && '114 Surahs — Select to read'}
              {tab==='juz' && '30 Juz — Select to read'}
            </div>
          </div>
          {tab==='read' && (
            <div style={{ display:'flex', gap:6, alignItems:'center' }}>
              <button onClick={() => setZoom(z=>Math.max(60,z-10))} style={{ width:30,height:30,borderRadius:7,background:'rgba(201,168,76,0.08)',border:'1px solid rgba(201,168,76,0.15)',color:'#C9A84C',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}><ZoomOut size={13}/></button>
              <span style={{ fontSize:11,color:'rgba(242,237,228,0.5)',minWidth:36,textAlign:'center' }}>{zoom}%</span>
              <button onClick={() => setZoom(z=>Math.min(150,z+10))} style={{ width:30,height:30,borderRadius:7,background:'rgba(201,168,76,0.08)',border:'1px solid rgba(201,168,76,0.15)',color:'#C9A84C',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center' }}><ZoomIn size={13}/></button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:18, overflowX:'auto' }}>
        {[['read','📖 Read'],['surah','📋 By Surah'],['juz','🌙 By Juz']].map(([id,label]) => (
          <button key={id} className={`tab-btn ${tab===id?'active':''}`} onClick={() => setTab(id)} style={{ flexShrink:0 }}>{label}</button>
        ))}
      </div>

      {/* ══ READ VIEW ══ */}
      {tab === 'read' && (
        <div>
          {/* Page nav top */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, gap:10, flexWrap:'wrap' }}>
            <button onClick={() => goToPage(page-1)} disabled={page<=1}
              style={{ padding:'9px 16px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:10, color:page<=1?'rgba(242,237,228,0.2)':'#C9A84C', cursor:page<=1?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:6, fontSize:13 }}>
              <ChevronLeft size={16}/> Prev
            </button>

            {/* Page input */}
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <input type="number" value={page} min={1} max={TOTAL_PAGES}
                onChange={e => goToPage(parseInt(e.target.value)||1)}
                style={{ width:70, padding:'8px 10px', background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:8, color:'#C9A84C', textAlign:'center', fontSize:14, fontFamily:'Cinzel,serif', fontWeight:700, outline:'none' }}/>
              <span style={{ fontSize:12, color:'rgba(242,237,228,0.35)' }}>/ {TOTAL_PAGES}</span>
            </div>

            <button onClick={() => goToPage(page+1)} disabled={page>=TOTAL_PAGES}
              style={{ padding:'9px 16px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:10, color:page>=TOTAL_PAGES?'rgba(242,237,228,0.2)':'#C9A84C', cursor:page>=TOTAL_PAGES?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:6, fontSize:13 }}>
              Next <ChevronRight size={16}/>
            </button>
          </div>

          {/* Page image */}
          <div style={{ display:'flex', justifyContent:'center', background:'rgba(255,255,255,0.02)', borderRadius:16, padding:'16px', border:'1px solid rgba(201,168,76,0.08)', position:'relative', minHeight:400, overflow:'hidden' }}>
            {!imgLoaded && (
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ textAlign:'center' }}>
                  <Loader size={28} color="#C9A84C" style={{ animation:'spin 1s linear infinite', marginBottom:10 }}/>
                  <div style={{ fontSize:12, color:'rgba(242,237,228,0.4)' }}>Loading page {page}...</div>
                </div>
              </div>
            )}
            <img
              ref={imgRef}
              src={getPageUrl(page)}
              alt={`Quran page ${page}`}
              className={`qr-page-img ${!imgLoaded?'loading':''}`}
              style={{ width:`${zoom}%`, maxWidth:'100%', display:'block' }}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
            />
          </div>

          {/* Surah info bar */}
          <div style={{ marginTop:12, display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:8 }}>
              <span style={{ fontSize:11, color:'rgba(201,168,76,0.5)' }}>Surah:</span>
              <span style={{ fontSize:12, fontWeight:600, color:'#C9A84C' }}>{curSurah?.name}</span>
              <span className="arabic" style={{ fontSize:13, color:'rgba(201,168,76,0.7)' }}>{curSurah?.ar}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:8 }}>
              <span style={{ fontSize:11, color:'rgba(201,168,76,0.5)' }}>Juz:</span>
              <span style={{ fontSize:12, fontWeight:600, color:'#C9A84C' }}>{curJuz}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 14px', background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:8 }}>
              <span style={{ fontSize:11, color:'rgba(201,168,76,0.5)' }}>Page:</span>
              <span style={{ fontSize:12, fontWeight:600, color:'#C9A84C' }}>{page} / {TOTAL_PAGES}</span>
            </div>
          </div>

          {/* Keyboard hint */}
          <div style={{ textAlign:'center', marginTop:10, fontSize:11, color:'rgba(242,237,228,0.2)' }}>
            ← → Arrow keys to navigate · Scroll or pinch to zoom
          </div>
        </div>
      )}

      {/* ══ SURAH VIEW ══ */}
      {tab === 'surah' && (
        <div>
          <div style={{ position:'relative', marginBottom:16 }}>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search surah name..."
              style={{ width:'100%', padding:'11px 14px 11px 16px', background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:10, color:'#F2EDE4', fontSize:13, fontFamily:'inherit', outline:'none' }}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
            {filteredSurahs.map((s, i) => (
              <div key={s.n} className={`qr-card ${page===s.page?'active':''}`}
                onClick={() => { goToPage(s.page); setTab('read'); }}
                style={{ padding:'14px 16px', animation:`fadeUp 0.3s ${Math.min(i*0.02,0.4)}s ease both` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                  <div style={{ width:28, height:28, borderRadius:7, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cinzel,serif', fontSize:11, fontWeight:700, color:'#C9A84C', flexShrink:0 }}>
                    {s.n}
                  </div>
                  <div className="arabic" style={{ fontSize:16, color:'rgba(201,168,76,0.7)' }}>{s.ar}</div>
                </div>
                <div style={{ fontSize:12, fontWeight:600, color:'rgba(242,237,228,0.85)', marginBottom:3 }}>{s.name}</div>
                <div style={{ display:'flex', gap:8, fontSize:10, color:'rgba(242,237,228,0.35)' }}>
                  <span>Page {s.page}</span>
                  <span>·</span>
                  <span>Juz {s.juz}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ JUZ VIEW ══ */}
      {tab === 'juz' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
          {JUZ_PAGES.map((j, i) => {
            const startSurah = getSurahAtPage(j.page);
            const isActive   = curJuz === j.juz;
            return (
              <div key={j.juz} className={`qr-card ${isActive?'active':''}`}
                onClick={() => { goToPage(j.page); setTab('read'); }}
                style={{ padding:'18px 16px', textAlign:'center', animation:`fadeUp 0.3s ${i*0.05}s ease both` }}>
                <div style={{ fontFamily:'Cinzel,serif', fontSize:28, fontWeight:900, color:isActive?'#C9A84C':'rgba(201,168,76,0.5)', marginBottom:4 }}>{j.juz}</div>
                <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:1, marginBottom:8 }}>JUZ</div>
                <div style={{ fontSize:11, color:'rgba(242,237,228,0.6)', marginBottom:3 }}>{startSurah?.name}</div>
                <div style={{ fontSize:10, color:'rgba(242,237,228,0.3)' }}>Page {j.page}</div>
                {isActive && <div style={{ marginTop:8, fontSize:9, color:'#C9A84C', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:5, padding:'2px 7px', letterSpacing:1 }}>READING</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom info */}
      <div style={{ marginTop:20, background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:14, padding:'14px 18px', textAlign:'center' }}>
        <div className="arabic" style={{ fontSize:14, color:'rgba(201,168,76,0.7)', marginBottom:5 }}>اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</div>
        <div style={{ fontSize:11, color:'rgba(242,237,228,0.3)', fontStyle:'italic' }}>"Read in the name of your Lord who created." — Quran 96:1</div>
      </div>
    </div>
  );
}