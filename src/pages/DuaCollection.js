import React, { useState } from 'react';
import { Search, Volume2, Heart, X } from 'lucide-react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .du-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { to{background-position:200% center} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .du-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:16px; transition:all 0.3s; cursor:pointer; }
  .du-card:hover { border-color:rgba(201,168,76,0.3); }
  .du-card.expanded { border-color:rgba(201,168,76,0.35); background:rgba(201,168,76,0.04); }
  .du-input { background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.15); border-radius:10px; color:#F2EDE4; outline:none; padding:11px 14px 11px 38px; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; width:100%; }
  .du-input:focus { border-color:rgba(201,168,76,0.4); }
  .du-input::placeholder { color:rgba(242,237,228,0.25); }
  .cat-btn { background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.1); border-radius:20px; color:rgba(242,237,228,0.5); cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; padding:7px 14px; transition:all 0.2s; white-space:nowrap; }
  .cat-btn.active { background:rgba(201,168,76,0.15); border-color:rgba(201,168,76,0.4); color:#C9A84C; font-weight:700; }
`;

const DUAS = [
  // Morning & Evening
  { id:1,  cat:'Morning & Evening', name:'Morning Dhikr — Ayatul Kursi',        emoji:'🌅', arabic:'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ', urdu:'اللہ کے سوا کوئی معبود نہیں، وہ زندہ اور قائم ہے۔', english:'Allah! There is no god but He, the Living, the Self-subsisting.', source:'Quran 2:255', benefit:'Protection from shaytan all day.' },
  { id:2,  cat:'Morning & Evening', name:'Morning — Seeking Protection',         emoji:'🌅', arabic:'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ', urdu:'ہم نے صبح کی اور اللہ کی ہی بادشاہی ہے۔', english:'We have entered the morning and at this very time all sovereignty belongs to Allah.', source:'Abu Dawud', benefit:'Start the day with tawakkul.' },
  { id:3,  cat:'Morning & Evening', name:'Evening — Seeking Forgiveness',        emoji:'🌙', arabic:'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ', urdu:'ہم نے شام کی اور اللہ ہی کی بادشاہت ہے۔', english:'We have entered the evening and at this very time sovereignty belongs to Allah.', source:'Muslim', benefit:'End the day in remembrance of Allah.' },
  { id:4,  cat:'Morning & Evening', name:'Sayyidul Istighfar',                  emoji:'🤲', arabic:'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ', urdu:'اے اللہ! تو میرا رب ہے، تیرے سوا کوئی معبود نہیں، تو نے مجھے پیدا کیا اور میں تیرا بندہ ہوں۔', english:'O Allah, You are my Lord, none has the right to be worshipped except You. You created me and I am Your servant.', source:'Bukhari', benefit:'Best dua for forgiveness. If recited in morning or evening sincerely, Jannah is guaranteed.' },

  // Prayers
  { id:5,  cat:'Prayers & Worship', name:'Before Salah',                        emoji:'🕌', arabic:'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ', urdu:'اے اللہ! تو پاک ہے، تیری حمد ہے، تیرا نام مبارک ہے۔', english:'Glory be to You O Allah, and praise be to You, blessed is Your name.', source:'Abu Dawud', benefit:'Opening dua in salah (Thana).' },
  { id:6,  cat:'Prayers & Worship', name:'After Salah — Complete Dhikr',        emoji:'🕌', arabic:'سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣) اللَّهُ أَكْبَرُ (٣٤)', urdu:'اللہ پاک ہے (33 بار)، تمام تعریفیں اللہ کے لیے (33 بار)، اللہ سب سے بڑا ہے (34 بار)۔', english:'SubhanAllah (33x), Alhamdulillah (33x), Allahu Akbar (34x).', source:'Muslim', benefit:'Sins are forgiven even if as much as the foam of the sea.' },
  { id:7,  cat:'Prayers & Worship', name:'Dua Qunoot (Witr)',                   emoji:'🌙', arabic:'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ وَعَافِنِي فِيمَنْ عَافَيْتَ', urdu:'اے اللہ! مجھے ہدایت دے ان لوگوں میں سے جن کو تو نے ہدایت دی۔', english:'O Allah guide me among those whom You have guided, and grant me safety among those whom You have granted safety.', source:'Tirmidhi', benefit:'Recited in Witr prayer.' },

  // Daily Life
  { id:8,  cat:'Daily Life', name:'Before Eating',                              emoji:'🍽️', arabic:'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ', urdu:'اللہ کے نام سے اور اللہ کی برکت سے۔', english:'In the name of Allah and with the blessings of Allah.', source:'Abu Dawud', benefit:'Shaytan cannot share in the food.' },
  { id:9,  cat:'Daily Life', name:'After Eating',                               emoji:'✅', arabic:'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ', urdu:'تمام تعریفیں اللہ کے لیے جس نے ہمیں کھلایا، پلایا اور مسلمان بنایا۔', english:'All praise is for Allah who fed us, gave us drink, and made us Muslims.', source:'Abu Dawud', benefit:'Gratitude to Allah for His blessings.' },
  { id:10, cat:'Daily Life', name:'Before Sleeping',                            emoji:'🌙', arabic:'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', urdu:'اے اللہ! تیرے نام پر مرتا ہوں اور جیتا ہوں۔', english:'In Your name O Allah I die and I live.', source:'Bukhari', benefit:'Sunnah dua before sleep.' },
  { id:11, cat:'Daily Life', name:'Upon Waking Up',                             emoji:'☀️', arabic:'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', urdu:'تمام تعریفیں اللہ کے لیے جس نے ہمیں مارنے کے بعد زندہ کیا اور اسی کی طرف جانا ہے۔', english:'All praise is for Allah who gave us life after having given us death, and unto Him is the resurrection.', source:'Bukhari', benefit:'Start the day with gratitude.' },
  { id:12, cat:'Daily Life', name:'Entering Home',                              emoji:'🏠', arabic:'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ', urdu:'اے اللہ! میں تجھ سے اچھے داخل ہونے اور اچھے نکلنے کا سوال کرتا ہوں۔', english:'O Allah, I ask You for the good of entering and the good of leaving.', source:'Abu Dawud', benefit:'Protection when entering home.' },
  { id:13, cat:'Daily Life', name:'Leaving Home',                               emoji:'🚪', arabic:'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', urdu:'اللہ کے نام سے، اللہ پر بھروسہ کیا، اللہ کے بغیر نہ قوت ہے نہ طاقت۔', english:'In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.', source:'Tirmidhi', benefit:'Protected from evil when leaving home.' },

  // Travel
  { id:14, cat:'Travel & Transport', name:'Dua for Travel',                     emoji:'✈️', arabic:'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ', urdu:'پاک ہے وہ ذات جس نے ہمارے لیے اسے مسخر کیا، ورنہ ہم اسے قابو نہ کر سکتے تھے۔', english:'Glory be to Him who has subjected this to us, and we were not able to do it ourselves.', source:'Quran 43:13', benefit:'Sunnah dua when boarding any transport.' },
  { id:15, cat:'Travel & Transport', name:'Entering a New City',                emoji:'🏙️', arabic:'اللَّهُمَّ بَارِكْ لَنَا فِيهَا', urdu:'اے اللہ! ہمارے لیے اس میں برکت عطا فرما۔', english:'O Allah, bless us in it.', source:'Muslim', benefit:'Dua when arriving at a new place.' },

  // Distress & Anxiety
  { id:16, cat:'Distress & Anxiety', name:'Dua of Prophet Yunus ﷺ',            emoji:'🐋', arabic:'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ', urdu:'تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ظالموں میں سے تھا۔', english:'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.', source:'Quran 21:87', benefit:'Prophet Yunus recited this in the whale\'s belly. Allah accepted and saved him.' },
  { id:17, cat:'Distress & Anxiety', name:'Dua for Anxiety & Grief',           emoji:'💚', arabic:'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ', urdu:'اے اللہ! میں تیری پناہ لیتا ہوں پریشانی اور غم سے۔', english:'O Allah, I seek refuge in You from worry and grief.', source:'Bukhari', benefit:'Complete dua against all forms of distress.' },
  { id:18, cat:'Distress & Anxiety', name:'Hasbunallah wa Ni\'mal Wakeel',     emoji:'🤝', arabic:'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', urdu:'اللہ ہمارے لیے کافی ہے اور وہ بہترین وکیل ہے۔', english:'Allah is sufficient for us, and He is the best disposer of affairs.', source:'Quran 3:173', benefit:'Ibrahim (AS) said this when thrown into fire. Trust Allah completely.' },

  // Health & Illness
  { id:19, cat:'Health & Illness', name:'Dua for Shifa (Healing)',              emoji:'💊', arabic:'اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَاسَ، اشْفِ أَنْتَ الشَّافِي', urdu:'اے اللہ! لوگوں کے رب، بیماری کو دور کر، شفا دے، تو ہی شفا دینے والا ہے۔', english:'O Allah, Lord of mankind, remove the affliction, grant cure, You are the Healer.', source:'Bukhari', benefit:'Sunnah dua for healing - recited 3 times.' },
  { id:20, cat:'Health & Illness', name:'Ruqyah — Protection',                 emoji:'🛡️', arabic:'بِسْمِ اللَّهِ أَرْقِيكَ، مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ', urdu:'اللہ کے نام سے تجھ پر دم کرتا ہوں، ہر اس چیز سے جو تجھے تکلیف دے۔', english:'In the name of Allah I perform ruqyah for you, from everything that harms you.', source:'Muslim', benefit:'Jibril (AS) recited this as ruqyah for the Prophet ﷺ.' },

  // Parents & Family
  { id:21, cat:'Parents & Family', name:'Dua for Parents',                     emoji:'❤️', arabic:'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', urdu:'اے میرے رب! ان پر رحم فرما جیسا کہ انہوں نے بچپن میں مجھے پالا۔', english:'My Lord, have mercy upon them as they brought me up when I was small.', source:'Quran 17:24', benefit:'Best dua for parents. Recite for both living and deceased parents.' },
  { id:22, cat:'Parents & Family', name:'Dua for Righteous Spouse & Children', emoji:'👨‍👩‍👧', arabic:'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ', urdu:'اے ہمارے رب! ہمیں ہماری بیویوں اور اولاد سے آنکھوں کی ٹھنڈک عطا فرما۔', english:'Our Lord, grant us from among our wives and offspring comfort to our eyes.', source:'Quran 25:74', benefit:'Dua for a happy and righteous family.' },

  // Knowledge & Guidance
  { id:23, cat:'Knowledge & Guidance', name:'Dua for Knowledge',               emoji:'📖', arabic:'رَبِّ زِدْنِي عِلْمًا', urdu:'اے میرے رب! مجھے علم میں اضافہ عطا فرما۔', english:'My Lord, increase me in knowledge.', source:'Quran 20:114', benefit:'Short but powerful. Recite before studying.' },
  { id:24, cat:'Knowledge & Guidance', name:'Dua for Guidance on Decisions',   emoji:'🎯', arabic:'اللَّهُمَّ خِرْ لِي وَاخْتَرْ لِي', urdu:'اے اللہ! میرے لیے بہتری اختیار فرما اور میرے لیے چن لے۔', english:'O Allah, make the right choice for me and choose for me.', source:'Tirmidhi', benefit:'Dua of Istikharah — seeking guidance from Allah for decisions.' },
  { id:25, cat:'Forgiveness', name:'Dua for Complete Forgiveness',             emoji:'🤲', arabic:'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ', urdu:'اے اللہ! میرے تمام گناہ معاف فرما، چھوٹے بھی اور بڑے بھی۔', english:'O Allah forgive me all my sins, the small and great of them.', source:'Muslim', benefit:'Comprehensive dua for forgiveness of all types of sins.' },
];

const CATEGORIES = ['All', ...new Set(DUAS.map(d => d.cat))];

export default function DuaCollection() {
  const [search, setSearch]   = useState('');
  const [cat, setCat]         = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [favs, setFavs]       = useState(() => { try { return JSON.parse(localStorage.getItem('dua_favs') || '[]'); } catch { return []; } });
  const [tab, setTab]         = useState('all');

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

  const toggleFav = (id, e) => {
    e.stopPropagation();
    const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id];
    setFavs(next);
    try { localStorage.setItem('dua_favs', JSON.stringify(next)); } catch {}
  };

  const filtered = DUAS.filter(d => {
    const matchCat  = cat === 'All' || d.cat === cat;
    const matchFav  = tab === 'favs' ? favs.includes(d.id) : true;
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.english.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchFav && matchSearch;
  });

  return (
    <div className="du-root" style={{ padding: '24px 28px', maxWidth: 900, margin: '0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#050505,#0F0F0D)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 20, padding: '22px 28px', marginBottom: 22, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top right,rgba(201,168,76,0.06),transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <div style={{ width: 50, height: 50, background: 'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🤲</div>
          <div>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 10, letterSpacing: 3, color: 'rgba(201,168,76,0.6)', marginBottom: 4 }}>ISLAMIC SUPPLICATIONS</div>
            <h1 className="gold-shimmer" style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Cinzel,serif' }}>Dua Collection</h1>
            <p style={{ fontSize: 12, color: 'rgba(242,237,228,0.4)', marginTop: 2 }}>{DUAS.length} authentic duas · Arabic · Urdu · English</p>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'center', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ fontFamily: 'Cinzel,serif', fontSize: 18, fontWeight: 700, color: '#C9A84C' }}>❤️ {favs.length}</div>
            <div style={{ fontSize: 9, color: 'rgba(201,168,76,0.5)', letterSpacing: 1 }}>SAVED</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[['all', '📿 All Duas'], ['favs', `❤️ Favourites (${favs.length})`]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            style={{ padding: '9px 16px', background: tab === id ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.04)', border: `1px solid ${tab === id ? 'rgba(201,168,76,0.4)' : 'rgba(201,168,76,0.1)'}`, borderRadius: 10, color: tab === id ? '#C9A84C' : 'rgba(242,237,228,0.5)', cursor: 'pointer', fontSize: 12, fontWeight: tab === id ? 700 : 400, fontFamily: 'inherit' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 14 }}>
        <Search size={13} color="rgba(201,168,76,0.4)" style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)' }} />
        <input className="du-input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search duas by name or meaning..." />
        {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(242,237,228,0.3)' }}><X size={12} /></button>}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 20, paddingBottom: 4 }}>
        {CATEGORIES.map(c => (
          <button key={c} className={`cat-btn ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      {/* Dua list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: 'rgba(242,237,228,0.3)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤲</div>
            {tab === 'favs' ? 'No favourites yet. Tap ❤️ on any dua to save.' : 'No duas found.'}
          </div>
        )}
        {filtered.map((d, i) => {
          const isExp = expanded === d.id;
          const isFav = favs.includes(d.id);
          return (
            <div key={d.id} className={`du-card ${isExp ? 'expanded' : ''}`}
              onClick={() => setExpanded(isExp ? null : d.id)}
              style={{ animation: `fadeUp 0.3s ${Math.min(i * 0.04, 0.4)}s ease both` }}>
              {/* Header */}
              <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{d.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(242,237,228,0.9)', marginBottom: 2 }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.5)' }}>{d.cat}</div>
                </div>
                <button onClick={e => toggleFav(d.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>
                  {isFav ? '❤️' : '🤍'}
                </button>
                <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: 16 }}>{isExp ? '▲' : '▼'}</span>
              </div>

              {/* Expanded content */}
              {isExp && (
                <div style={{ padding: '0 18px 18px', borderTop: '1px solid rgba(201,168,76,0.08)' }}>
                  {/* Arabic */}
                  <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 12, padding: '16px', margin: '14px 0', textAlign: 'right' }}>
                    <div className="arabic" style={{ fontSize: 22, color: '#E8C97A', lineHeight: 2.2, marginBottom: 8 }}>{d.arabic}</div>
                    <button onClick={e => { e.stopPropagation(); speak(d.arabic, 'ar'); }}
                      style={{ padding: '5px 12px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 7, color: '#C9A84C', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, marginLeft: 'auto' }}>
                      <Volume2 size={11} /> Play Arabic
                    </button>
                  </div>

                  {/* Urdu */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.5)', letterSpacing: 1, marginBottom: 6 }}>URDU</div>
                    <div className="arabic" style={{ fontSize: 14, color: 'rgba(242,237,228,0.65)', lineHeight: 2, direction: 'rtl' }}>{d.urdu}</div>
                  </div>

                  {/* English */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.5)', letterSpacing: 1, marginBottom: 6 }}>ENGLISH</div>
                    <div style={{ fontSize: 13, color: 'rgba(242,237,228,0.7)', lineHeight: 1.7, fontStyle: 'italic' }}>{d.english}</div>
                    <button onClick={e => { e.stopPropagation(); speak(d.english, 'en'); }}
                      style={{ marginTop: 8, padding: '5px 12px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 7, color: '#C9A84C', cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Volume2 size={11} /> Play English
                    </button>
                  </div>

                  {/* Source + Benefit */}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 10, padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.5)', letterSpacing: 1, marginBottom: 4 }}>SOURCE</div>
                      <div style={{ fontSize: 12, color: '#C9A84C', fontWeight: 600 }}>{d.source}</div>
                    </div>
                    <div style={{ flex: 2, background: 'rgba(46,204,113,0.06)', border: '1px solid rgba(46,204,113,0.12)', borderRadius: 10, padding: '10px 12px' }}>
                      <div style={{ fontSize: 10, color: 'rgba(46,204,113,0.5)', letterSpacing: 1, marginBottom: 4 }}>BENEFIT</div>
                      <div style={{ fontSize: 12, color: 'rgba(46,204,113,0.8)' }}>{d.benefit}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 20, background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 14, padding: '14px 20px', textAlign: 'center' }}>
        <div className="arabic" style={{ fontSize: 14, color: 'rgba(201,168,76,0.7)', marginBottom: 6 }}>وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ</div>
        <div style={{ fontSize: 12, color: 'rgba(242,237,228,0.3)', fontStyle: 'italic' }}>"And your Lord says: Call upon Me; I will respond to you." — Quran 40:60</div>
      </div>
    </div>
  );
}