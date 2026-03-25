import React, { useState } from 'react';
import { Search, MessageSquare } from 'lucide-react';

const hadithBooks = [
  { name: 'Sahih Bukhari',  arabic: 'صحيح البخاري',  count: '7563 Hadith', color: '#1B6B3A' },
  { name: 'Sahih Muslim',   arabic: 'صحيح مسلم',     count: '7500 Hadith', color: '#1A5276' },
  { name: 'Abu Dawud',      arabic: 'سنن أبي داود',   count: '5274 Hadith', color: '#6D4C41' },
  { name: 'At-Tirmidhi',   arabic: 'سنن الترمذي',    count: '3956 Hadith', color: '#B7950B' },
  { name: 'An-Nasai',       arabic: 'سنن النسائي',    count: '5761 Hadith', color: '#8E44AD' },
  { name: 'Ibn Majah',      arabic: 'سنن ابن ماجه',   count: '4341 Hadith', color: '#D35400' },
];

const hadiths = [
  { book: 'Bukhari', num: '1',    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',                                                                                              english: 'Actions are judged by intentions, and each person will be rewarded according to their intention.',          narrator: 'Umar ibn al-Khattab (RA)', topic: 'Intentions' },
  { book: 'Muslim',  num: '45',   arabic: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',                                                           english: 'None of you truly believes until he loves for his brother what he loves for himself.',                     narrator: 'Anas ibn Malik (RA)',       topic: 'Brotherhood' },
  { book: 'Bukhari', num: '6018', arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',                                              english: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.',                         narrator: 'Abu Hurayrah (RA)',         topic: 'Speech' },
  { book: 'Muslim',  num: '2699', arabic: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',                                  english: 'Whoever follows a path in pursuit of knowledge, Allah will make easy for him a path to Paradise.',        narrator: 'Abu Hurayrah (RA)',         topic: 'Knowledge' },
  { book: 'Tirmidhi',num: '2518', arabic: 'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا',                                                      english: 'Fear Allah wherever you are, follow a bad deed with a good deed and it will erase it.',                   narrator: "Mu'adh ibn Jabal (RA)",     topic: 'Taqwa' },
  { book: 'Bukhari', num: '5763', arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',                                                                                    english: 'The best of you are those who learn the Quran and teach it.',                                            narrator: 'Uthman ibn Affan (RA)',     topic: 'Quran' },
  { book: 'Muslim',  num: '223',  arabic: 'الطَّهُورُ شَطْرُ الإِيمَانِ',                                                                                                        english: 'Cleanliness is half of faith.',                                                                           narrator: 'Abu Malik al-Ashari (RA)', topic: 'Purification' },
  { book: 'Bukhari', num: '2442', arabic: 'الْمُسْلِمُ أَخُو الْمُسْلِمِ لاَ يَظْلِمُهُ وَلاَ يُسْلِمُهُ',                                                                       english: 'A Muslim is the brother of another Muslim; he does not oppress him nor does he abandon him.',             narrator: 'Abdullah ibn Umar (RA)',   topic: 'Brotherhood' },
];

export function Hadith() {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const filtered = hadiths.filter(h =>
    h.english.toLowerCase().includes(search.toLowerCase()) ||
    h.topic.toLowerCase().includes(search.toLowerCase()) ||
    h.narrator.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <MessageSquare size={22} color="#D4AF37" />
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Hadith Collection</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px,1fr))', gap: 10, marginBottom: 24 }}>
        {hadithBooks.map(b => (
          <div key={b.name} style={{ background: 'var(--dark-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', cursor: 'pointer', borderLeft: `3px solid ${b.color}`, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div className="arabic" style={{ fontSize: 12, color: b.color, marginBottom: 3 }}>{b.arabic}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#c0d4c8' }}>{b.name}</div>
            <div style={{ fontSize: 10, color: '#4a6355', marginTop: 2 }}>{b.count}</div>
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', marginBottom: 18 }}>
        <Search size={13} color="#4a6355" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hadith..."
          style={{ width: '100%', padding: '10px 12px 10px 36px', background: 'var(--dark-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'white', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
      </div>
      {filtered.map((h, i) => (
        <div key={i} onClick={() => setExpanded(expanded === i ? null : i)} style={{ background: 'var(--dark-card)', border: `1px solid ${expanded === i ? 'rgba(46,139,87,0.35)' : 'var(--border)'}`, borderRadius: 14, padding: '18px 22px', marginBottom: 10, cursor: 'pointer', borderLeft: '3px solid #2E8B57', transition: 'all 0.2s' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 10, background: 'rgba(46,139,87,0.15)', color: '#3aad6e', borderRadius: 5, padding: '3px 8px', fontWeight: 600 }}>{h.book}</span>
            <span style={{ fontSize: 10, background: 'rgba(212,175,55,0.1)', color: '#D4AF37', borderRadius: 5, padding: '3px 8px' }}>#{h.num}</span>
            <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.05)', color: '#7a9585', borderRadius: 5, padding: '3px 8px' }}>{h.topic}</span>
          </div>
          <div className="arabic" style={{ fontSize: 18, color: '#f5d060', marginBottom: 10, lineHeight: 2 }}>{h.arabic}</div>
          <div style={{ fontSize: 13, color: '#7a9585', lineHeight: 1.7, fontStyle: 'italic' }}>"{h.english}"</div>
          {expanded === i && <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(46,139,87,0.1)', fontSize: 12, color: '#4a6355' }}>Narrated by: <span style={{ color: '#3aad6e', fontWeight: 600 }}>{h.narrator}</span></div>}
        </div>
      ))}
    </div>
  );
}

export function Namaz() {
  const [step, setStep] = useState(0);
  const prayers = [
    { name: 'Fajr',    rakats: '2 Fard',        time: '05:12', icon: '🌙' },
    { name: 'Dhuhr',   rakats: '4 Fard',        time: '12:30', icon: '☀️' },
    { name: 'Asr',     rakats: '4 Fard',        time: '15:45', icon: '🌤' },
    { name: 'Maghrib', rakats: '3 Fard',        time: '18:52', icon: '🌅' },
    { name: 'Isha',    rakats: '4 Fard',        time: '20:15', icon: '🌙' },
  ];
  const steps = [
    { num: 1, title: 'Niyyah (Intention)',    arabic: 'نِيَّة',                    desc: 'Make intention in your heart to perform the specific prayer for the sake of Allah alone.',              icon: '🤲' },
    { num: 2, title: 'Takbir-ul-Ihram',       arabic: 'تَكْبِيرَة الإِحْرَام',    desc: 'Raise both hands to earlobes and say "Allahu Akbar". This marks the beginning of prayer.',           icon: '🙌' },
    { num: 3, title: 'Qiyam (Standing)',       arabic: 'قِيَام',                   desc: 'Stand upright, place right hand over left on chest. Recite Al-Fatiha then another Surah.',            icon: '🧍' },
    { num: 4, title: 'Ruku (Bowing)',          arabic: 'رُكُوع',                   desc: 'Bow with hands on knees, back parallel to ground. Say "Subhana Rabbiyal Adheem" 3 times.',           icon: '🏃' },
    { num: 5, title: "I'tidal (Rising)",       arabic: 'اعْتِدَال',                desc: 'Rise from bowing saying "Sami Allahu liman hamidah", then stand straight saying "Rabbana lakal hamd".',icon: '⬆️' },
    { num: 6, title: 'Sujood (Prostration)',   arabic: 'سُجُود',                   desc: 'Prostrate with forehead, nose, both palms, knees and toes on ground. Say "Subhana Rabbiyal Ala" 3x.', icon: '🙏' },
    { num: 7, title: 'Jalsa (Sitting)',        arabic: 'جَلْسَة',                  desc: 'Sit upright between two prostrations saying "Rabbighfir li". Then do second Sujood.',               icon: '🧘' },
    { num: 8, title: 'Tashahhud & Salaam',     arabic: 'تَشَهُّد وَسَلَام',        desc: 'Sit and recite Tashahhud and Durood. End by turning head right then left: "Assalamu Alaykum wa Rahmatullah".',icon: '☮️' },
  ];
  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>🕌 Namaz Guide</h1>
      <div style={{ display: 'flex', gap: 10, marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
        {prayers.map(p => (
          <div key={p.name} style={{ flex: '0 0 auto', background: 'var(--dark-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 16px', textAlign: 'center', minWidth: 95 }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{p.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{p.name}</div>
            <div style={{ fontSize: 11, color: '#3aad6e', fontWeight: 700 }}>{p.rakats}</div>
            <div style={{ fontSize: 10, color: '#4a6355' }}>{p.time}</div>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Step-by-Step Guide</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)} style={{ background: step === i ? 'rgba(27,107,58,0.3)' : 'var(--dark-card)', border: `1px solid ${step === i ? '#2E8B57' : 'var(--border)'}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: 12, color: step === i ? '#3aad6e' : '#7a9585', fontWeight: step === i ? 600 : 400 }}>
            Step {s.num}
          </button>
        ))}
      </div>
      <div style={{ background: 'linear-gradient(135deg, #0f3d22, #122018)', border: '1px solid rgba(46,139,87,0.3)', borderRadius: 20, padding: '28px 32px' }}>
        <div style={{ fontSize: 38, marginBottom: 14 }}>{steps[step].icon}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 26, height: 26, background: 'rgba(212,175,55,0.2)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#D4AF37' }}>{steps[step].num}</div>
          <h3 style={{ fontSize: 17, fontWeight: 700 }}>{steps[step].title}</h3>
        </div>
        <div className="arabic" style={{ fontSize: 20, color: '#D4AF37', marginBottom: 12 }}>{steps[step].arabic}</div>
        <p style={{ fontSize: 14, color: '#7a9585', lineHeight: 1.7 }}>{steps[step].desc}</p>
        <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
          <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 16px', color: 'white', cursor: step === 0 ? 'not-allowed' : 'pointer', opacity: step === 0 ? 0.4 : 1, fontSize: 13 }}>← Previous</button>
          <button onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))} disabled={step === steps.length - 1} style={{ background: 'linear-gradient(135deg, #1B6B3A, #2E8B57)', color: 'white', border: 'none', borderRadius: 10, padding: '8px 20px', cursor: step === steps.length - 1 ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, opacity: step === steps.length - 1 ? 0.4 : 1 }}>Next Step →</button>
        </div>
      </div>
    </div>
  );
}

export function Kids() {
  const [activeTab, setActiveTab] = useState('alphabet');
  const alphabet = [
    {letter:'ا',name:'Alif'},{letter:'ب',name:'Ba'},{letter:'ت',name:'Ta'},{letter:'ث',name:'Tha'},
    {letter:'ج',name:'Jeem'},{letter:'ح',name:'Ha'},{letter:'خ',name:'Kha'},{letter:'د',name:'Dal'},
    {letter:'ذ',name:'Dhal'},{letter:'ر',name:'Ra'},{letter:'ز',name:'Zay'},{letter:'س',name:'Seen'},
    {letter:'ش',name:'Sheen'},{letter:'ص',name:'Sad'},{letter:'ض',name:'Dad'},{letter:'ط',name:'Ta'},
    {letter:'ظ',name:'Dha'},{letter:'ع',name:'Ain'},{letter:'غ',name:'Ghain'},{letter:'ف',name:'Fa'},
    {letter:'ق',name:'Qaf'},{letter:'ك',name:'Kaf'},{letter:'ل',name:'Lam'},{letter:'م',name:'Meem'},
    {letter:'ن',name:'Nun'},{letter:'ه',name:'Ha'},{letter:'و',name:'Waw'},{letter:'ي',name:'Ya'},
  ];
  const surahs = [
    {name:'Al-Fatiha',arabic:'الفاتحة',ayats:7,emoji:'🌟'},{name:'Al-Ikhlas',arabic:'الإخلاص',ayats:4,emoji:'✨'},
    {name:'Al-Falaq',arabic:'الفلق',ayats:5,emoji:'🌅'},{name:'An-Nas',arabic:'الناس',ayats:6,emoji:'🌙'},
    {name:'Al-Asr',arabic:'العصر',ayats:3,emoji:'⏰'},{name:'Al-Kawthar',arabic:'الكوثر',ayats:3,emoji:'🌊'},
    {name:'Al-Masad',arabic:'المسد',ayats:5,emoji:'🔥'},{name:'An-Nasr',arabic:'النصر',ayats:3,emoji:'🏆'},
  ];
  const stories = [
    {name:'Prophet Ibrahim ﷺ',emoji:'🔥',desc:'The story of Ibrahim and the fire of Nimrod'},
    {name:'Prophet Musa ﷺ',emoji:'🌊',desc:'The story of Musa parting the sea'},
    {name:'Prophet Yusuf ﷺ',emoji:'⭐',desc:"The story of Yusuf and his brothers' jealousy"},
    {name:'Prophet Yunus ﷺ',emoji:'🐋',desc:'The story of Yunus inside the whale'},
    {name:"Prophet Nuh ﷺ",emoji:'⛵',desc:'The story of Nuh and the great flood'},
    {name:'Prophet Isa ﷺ',emoji:'🕊️',desc:'The story of Isa and his miracles'},
  ];
  const duas = [
    {title:'Morning Dua',arabic:'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ',eng:'We enter the morning and the kingdom belongs to Allah',emoji:'🌅'},
    {title:'Eating Dua',arabic:'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',eng:'In the name of Allah and with the blessings of Allah',emoji:'🍽️'},
    {title:'Sleeping Dua',arabic:'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',eng:'In Your name O Allah, I die and I live',emoji:'🌙'},
    {title:'Entering Home',arabic:'بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا',eng:'In the name of Allah we enter and in the name of Allah we leave',emoji:'🏠'},
    {title:'Travel Dua',arabic:'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا',eng:'Glory be to He who has subjected this for us',emoji:'✈️'},
    {title:'After Eating',arabic:'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا',eng:'All praise to Allah who fed us and gave us drink',emoji:'🤲'},
  ];
  return (
    <div style={{ padding: 32, maxWidth: 900 }}>
      <div style={{ background: 'linear-gradient(135deg, #6B2FA0, #8E44AD)', borderRadius: 20, padding: '22px 26px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 36 }}>🌟</span>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>Kids Islamic Learning</h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>Fun & interactive Islamic education for children</p>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#f5d060' }}>⭐ 245</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>Stars earned</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
        {['alphabet','surahs','stories','dua'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ background: activeTab === t ? 'rgba(142,68,173,0.25)' : 'var(--dark-card)', border: `1px solid ${activeTab === t ? '#8E44AD' : 'var(--border)'}`, borderRadius: 10, padding: '8px 18px', cursor: 'pointer', fontSize: 13, color: activeTab === t ? '#c39bd3' : '#7a9585', fontWeight: activeTab === t ? 600 : 400, textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>
      {activeTab === 'alphabet' && (
        <div>
          <p style={{ fontSize: 13, color: '#7a9585', marginBottom: 14 }}>Click each letter to learn! 🎉</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(68px,1fr))', gap: 8 }}>
            {alphabet.map((a, i) => (
              <div key={i} style={{ background: 'var(--dark-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 6px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(142,68,173,0.15)'; e.currentTarget.style.transform = 'scale(1.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--dark-card)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <div className="arabic" style={{ fontSize: 26, color: '#D4AF37', marginBottom: 3 }}>{a.letter}</div>
                <div style={{ fontSize: 9, color: '#7a9585' }}>{a.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === 'surahs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 12 }}>
          {surahs.map((s, i) => (
            <div key={i} style={{ background: 'var(--dark-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(142,68,173,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>{s.emoji}</div>
              <div className="arabic" style={{ fontSize: 16, color: '#D4AF37', marginBottom: 3 }}>{s.arabic}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'white', marginBottom: 3 }}>{s.name}</div>
              <div style={{ fontSize: 10, color: '#4a6355', marginBottom: 10 }}>{s.ayats} Ayats</div>
              <button style={{ background: 'rgba(142,68,173,0.2)', border: '1px solid rgba(142,68,173,0.3)', borderRadius: 7, padding: '5px 12px', color: '#c39bd3', fontSize: 11, cursor: 'pointer' }}>▶ Learn</button>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'stories' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {stories.map((s, i) => (
            <div key={i} style={{ background: 'var(--dark-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{s.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 5 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: '#7a9585', marginBottom: 12, lineHeight: 1.5 }}>{s.desc}</div>
              <button style={{ background: 'rgba(142,68,173,0.2)', border: '1px solid rgba(142,68,173,0.3)', borderRadius: 7, padding: '5px 12px', color: '#c39bd3', fontSize: 11, cursor: 'pointer' }}>Read Story →</button>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'dua' && duas.map((d, i) => (
        <div key={i} style={{ background: 'var(--dark-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 22px', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 20 }}>{d.emoji}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#c39bd3' }}>{d.title}</span>
          </div>
          <div className="arabic" style={{ fontSize: 18, color: '#D4AF37', marginBottom: 8 }}>{d.arabic}</div>
          <div style={{ fontSize: 12, color: '#7a9585', fontStyle: 'italic' }}>"{d.eng}"</div>
        </div>
      ))}
    </div>
  );
}

export function Wazifa() {
  const [checked, setChecked] = useState({});
  const wazifas = [
    {id:1,name:'Subhanallah',    arabic:'سُبْحَانَ اللَّه',     count:33,  benefit:'Glorification of Allah',    color:'#1B6B3A'},
    {id:2,name:'Alhamdulillah',  arabic:'الْحَمْدُ لِلَّه',     count:33,  benefit:'Gratitude to Allah',         color:'#1A5276'},
    {id:3,name:'Allahu Akbar',   arabic:'اللَّهُ أَكْبَر',      count:34,  benefit:'Greatness of Allah',         color:'#B7950B'},
    {id:4,name:'Astaghfirullah', arabic:'أَسْتَغْفِرُ اللَّه',  count:100, benefit:'Seeking forgiveness',        color:'#D35400'},
    {id:5,name:'Durood Ibrahim', arabic:'اللَّهُمَّ صَلِّ عَلَى مُحَمَّد',count:10, benefit:'Blessings on Prophet ﷺ', color:'#8E44AD'},
    {id:6,name:'La ilaha illallah',arabic:'لَا إِلَٰهَ إِلَّا اللَّه',count:100,benefit:'Declaration of faith',  color:'#148F77'},
  ];
  const done = Object.values(checked).filter(Boolean).length;
  return (
    <div style={{ padding: 32, maxWidth: 700 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>⭐ Daily Wazifa Tracker</h1>
      <p style={{ fontSize: 13, color: '#7a9585', marginBottom: 22 }}>Track your daily dhikr and wazifa</p>
      <div style={{ background: 'linear-gradient(135deg, #0f3d22, #1B6B3A)', borderRadius: 16, padding: '18px 22px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>{done}/{wazifas.length}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Completed today</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
            <div style={{ width: `${(done/wazifas.length)*100}%`, height: '100%', background: 'linear-gradient(90deg, #D4AF37, #f5d060)', borderRadius: 3, transition: 'width 0.4s' }} />
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 5 }}>{Math.round((done/wazifas.length)*100)}% complete</div>
        </div>
      </div>
      {wazifas.map(w => (
        <div key={w.id} onClick={() => setChecked(c => ({...c,[w.id]:!c[w.id]}))} style={{ background: checked[w.id] ? `${w.color}18` : 'var(--dark-card)', border: `1px solid ${checked[w.id] ? w.color+'44' : 'var(--border)'}`, borderRadius: 14, padding: '16px 20px', marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.25s', borderLeft: `4px solid ${w.color}` }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: checked[w.id] ? w.color : 'rgba(255,255,255,0.05)', border: `2px solid ${checked[w.id] ? w.color : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            {checked[w.id] && <span style={{ fontSize: 13, color: 'white' }}>✓</span>}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: checked[w.id] ? 'white' : '#c0d4c8' }}>{w.name}</span>
              <span style={{ fontSize: 11, background: `${w.color}22`, color: w.color, borderRadius: 5, padding: '3px 9px', fontWeight: 600 }}>×{w.count}</span>
            </div>
            <div className="arabic" style={{ fontSize: 16, color: '#D4AF37', margin: '3px 0' }}>{w.arabic}</div>
            <div style={{ fontSize: 11, color: '#4a6355' }}>{w.benefit}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Assalamu Alaikum! 🌙 I am your Islamic AI assistant. Ask me anything about Islam — Quran, Hadith, Namaz, Islamic history, or daily Islamic questions.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const suggestions = [
    'What is the meaning of Surah Al-Fatiha?',
    'How many times should I pray daily?',
    'What are the pillars of Islam?',
    'Tell me about Prophet Muhammad ﷺ',
  ];
  const send = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text: msg }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setMessages(m => [...m, { role: 'assistant', text: 'JazakAllah Khair for your question! To enable real AI responses, add your Claude API key to a .env file as REACT_APP_CLAUDE_KEY. The chatbot will then answer all Islamic questions with knowledge from Quran and Hadith.' }]);
    setLoading(false);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '22px 28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #148F77, #1abc9c)', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🤖</div>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 800 }}>Islamic AI Assistant</h1>
          <p style={{ fontSize: 11, color: '#3aad6e' }}>● Online · Ask anything Islamic</p>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 14 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
            {m.role === 'assistant' && <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #148F77, #1abc9c)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, marginRight: 7, flexShrink: 0, alignSelf: 'flex-end' }}>🤖</div>}
            <div style={{ maxWidth: '72%', padding: '11px 15px', background: m.role === 'user' ? 'linear-gradient(135deg, #1B6B3A, #2E8B57)' : 'var(--dark-card)', border: m.role === 'user' ? 'none' : '1px solid var(--border)', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', fontSize: 13, color: 'white', lineHeight: 1.6 }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #148F77, #1abc9c)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🤖</div>
            <div style={{ background: 'var(--dark-card)', border: '1px solid var(--border)', borderRadius: '16px 16px 16px 4px', padding: '11px 16px', display: 'flex', gap: 4 }}>
              {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#3aad6e', animation: `pulse 1.4s ease ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}
      </div>
      {messages.length === 1 && (
        <div style={{ display: 'flex', gap: 7, marginBottom: 10, flexWrap: 'wrap' }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => send(s)} style={{ background: 'rgba(20,143,119,0.12)', border: '1px solid rgba(20,143,119,0.25)', borderRadius: 18, padding: '5px 12px', cursor: 'pointer', fontSize: 12, color: '#3aad6e' }}>{s}</button>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, background: 'var(--dark-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '5px 5px 5px 14px' }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask an Islamic question..." style={{ flex: 1, background: 'none', border: 'none', color: 'white', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
        <button onClick={() => send()} style={{ background: 'linear-gradient(135deg, #1B6B3A, #2E8B57)', color: 'white', border: 'none', padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Send</button>
      </div>
    </div>
  );
}