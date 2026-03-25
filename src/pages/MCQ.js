/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Loader, Trophy, Clock, RefreshCw, ChevronRight } from 'lucide-react';

const GROQ_KEY  = process.env.REACT_APP_GROQ_KEY || '';
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .mc-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { to{background-position:200% center} }
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes countdown { 0%{stroke-dashoffset:0} 100%{stroke-dashoffset:157} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .mc-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:16px; transition:all 0.3s; }
  .opt-btn { background:rgba(255,255,255,0.03); border:1px solid rgba(201,168,76,0.12); border-radius:12px; color:rgba(242,237,228,0.8); cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:13px; transition:all 0.2s; padding:14px 18px; text-align:left; width:100%; }
  .opt-btn:hover:not(:disabled) { border-color:rgba(201,168,76,0.35); background:rgba(201,168,76,0.06); color:#E8C97A; }
  .opt-btn.correct { background:rgba(46,204,113,0.12); border-color:rgba(46,204,113,0.4); color:#2ecc71; }
  .opt-btn.wrong   { background:rgba(231,76,60,0.1); border-color:rgba(231,76,60,0.3); color:#e74c3c; }
  .cat-btn { background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.1); border-radius:14px; color:rgba(242,237,228,0.6); cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; transition:all 0.25s; padding:14px 16px; text-align:center; }
  .cat-btn:hover { border-color:rgba(201,168,76,0.3); }
  .cat-btn.active { background:rgba(201,168,76,0.15); border-color:rgba(201,168,76,0.4); color:#C9A84C; }
`;

const CATEGORIES = [
  { id:'all',       name:'All Topics',        emoji:'📚', color:'#C9A84C' },
  { id:'quran',     name:'Holy Quran',         emoji:'📖', color:'#1A5276' },
  { id:'hadith',    name:'Hadith & Sunnah',    emoji:'📜', color:'#2E8B57' },
  { id:'fiqh',      name:'Islamic Fiqh',       emoji:'⚖️', color:'#8E44AD' },
  { id:'history',   name:'Islamic History',    emoji:'🏛️', color:'#D35400' },
  { id:'prophets',  name:'Prophets',           emoji:'✨', color:'#B7950B' },
  { id:'pillars',   name:'5 Pillars',          emoji:'🕌', color:'#148F77' },
  { id:'akhlaq',    name:'Islamic Ethics',     emoji:'💚', color:'#C9A84C' },
  { id:'ai',        name:'AI Daily Quiz',      emoji:'🤖', color:'#6B48C4' },
];

const STATIC_QS = {
  quran: [
    { q:'How many Surahs are in the Holy Quran?', opts:['110','112','114','116'], ans:2, exp:'The Quran contains 114 Surahs, from Al-Fatiha to An-Nas.' },
    { q:'Which Surah is known as the "Heart of the Quran"?', opts:['Al-Baqara','Ya-Seen','Al-Mulk','Al-Fatiha'], ans:1, exp:'Surah Ya-Seen (36) is called the heart of the Quran in a Hadith.' },
    { q:'How many Ayats are in Surah Al-Fatiha?', opts:['5','6','7','8'], ans:2, exp:'Al-Fatiha has 7 verses and is recited in every unit of prayer.' },
    { q:'Which is the longest Surah in the Quran?', opts:['Al-Imran','Al-Baqara','An-Nisa','Al-Maidah'], ans:1, exp:'Al-Baqara with 286 verses is the longest Surah.' },
    { q:'Which Surah does not begin with Bismillah?', opts:['Al-Fatiha','At-Tawbah','Al-Anfal','Al-Kahf'], ans:1, exp:'Surah At-Tawbah (9) is the only Surah without Bismillah at the start.' },
  ],
  hadith: [
    { q:'In which collection is the Hadith "Actions are by intentions" found?', opts:['Muslim','Tirmidhi','Bukhari','Abu Dawud'], ans:2, exp:'This famous Hadith is found in Sahih Bukhari and Muslim.' },
    { q:'What is the first obligation on a Muslim?', opts:['Prayer','Shahada','Fasting','Zakat'], ans:1, exp:'The Shahada (testimony of faith) is the first pillar.' },
    { q:'How many authentic Hadith books are in Kutub al-Sittah?', opts:['4','5','6','7'], ans:2, exp:'There are 6 canonical Hadith collections (Kutub al-Sittah).' },
  ],
  pillars: [
    { q:'How many times a day do Muslims pray?', opts:['3','4','5','6'], ans:2, exp:'Muslims pray 5 times daily: Fajr, Dhuhr, Asr, Maghrib, Isha.' },
    { q:'During which month do Muslims fast?', opts:['Muharram','Rajab','Ramadan','Shawwal'], ans:2, exp:'Muslims fast during the holy month of Ramadan.' },
    { q:'What is the minimum amount of wealth for Zakat (Nisab)?', opts:['50g gold','85g gold','100g gold','200g gold'], ans:1, exp:'Nisab is 85 grams of gold or its equivalent value.' },
    { q:'How many times must a Muslim perform Hajj?', opts:['Every year','5 times','Once in lifetime','Monthly'], ans:2, exp:'Hajj is obligatory once in a lifetime for those who are able.' },
  ],
  prophets: [
    { q:'How many Prophets are mentioned by name in the Quran?', opts:['20','25','30','35'], ans:1, exp:'25 Prophets are mentioned by name in the Holy Quran.' },
    { q:'Who was the first Prophet?', opts:['Ibrahim','Nuh','Adam','Idris'], ans:2, exp:'Prophet Adam (AS) was the first human and first Prophet.' },
    { q:'Which Prophet is known as Khalilullah (Friend of Allah)?', opts:['Musa','Isa','Ibrahim','Yusuf'], ans:2, exp:'Prophet Ibrahim (AS) is known as Khalilullah.' },
    { q:'Who was the last Prophet?', opts:['Isa','Idris','Muhammad','Yahya'], ans:2, exp:'Prophet Muhammad ﷺ is the last and final Prophet.' },
  ],
  history: [
    { q:'In which year did the Hijra (migration to Madinah) take place?', opts:['610 CE','615 CE','622 CE','630 CE'], ans:2, exp:'The Hijra took place in 622 CE, which marks Year 1 of the Islamic calendar.' },
    { q:'What was the first mosque built in Islam?', opts:['Masjid al-Haram','Masjid Nabawi','Masjid Quba','Masjid Al-Aqsa'], ans:2, exp:'Masjid Quba was the first mosque built by Prophet Muhammad ﷺ.' },
    { q:'In which battle did Muslims first fight?', opts:['Uhud','Badr','Khandaq','Hunayn'], ans:1, exp:'The Battle of Badr (624 CE) was the first major battle in Islam.' },
  ],
  fiqh: [
    { q:'Which direction do Muslims face during prayer?', opts:['Jerusalem','East','Qibla (Makkah)','North'], ans:2, exp:'Muslims face the Kaaba in Makkah — known as the Qibla.' },
    { q:'How many Fard (obligatory) prayers are there daily?', opts:['3','4','5','6'], ans:2, exp:'There are 5 obligatory daily prayers in Islam.' },
    { q:'What breaks the fast (Iftar) in Ramadan?', opts:['Noon prayer','Sunset (Maghrib)','Midnight','Sunrise'], ans:1, exp:'The fast is broken at Maghrib time (sunset).' },
  ],
  akhlaq: [
    { q:'Which virtue is described as "half of faith" in Hadith?', opts:['Prayer','Fasting','Cleanliness','Charity'], ans:2, exp:'Prophet Muhammad ﷺ said cleanliness (Taharah) is half of faith.' },
    { q:'What does "Rahmah" mean?', opts:['Justice','Mercy','Strength','Wisdom'], ans:1, exp:'Rahmah means mercy — one of the most praised qualities in Islam.' },
  ],
};

function getTodayKey() { return `mcq_${new Date().toISOString().split('T')[0]}`; }

export default function MCQ() {
  const [phase, setPhase]     = useState('select'); // select|quiz|result
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx]       = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore]     = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer]     = useState(20);
  const [timerActive, setTimerActive] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mcq_lb') || '[]'); } catch { return []; }
  });
  const timerRef = useRef(null);

  // Timer countdown
  useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleAnswer(-1); return 20; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerActive, qIdx]);

  const startQuiz = async (cat) => {
    setCategory(cat);
    setPhase('quiz'); setScore(0); setQIdx(0); setAnswers([]); setSelected(null);

    let qs = [];
    if (cat.id === 'ai') {
      await loadAiQuestions(setAiLoading);
      return;
    } else if (cat.id === 'all') {
      Object.values(STATIC_QS).forEach(arr => qs.push(...arr));
      qs = qs.sort(() => Math.random()-0.5).slice(0,10);
    } else {
      qs = (STATIC_QS[cat.id] || []).sort(() => Math.random()-0.5);
    }
    setQuestions(qs);
    setTimer(20); setTimerActive(true);
  };

  const loadAiQuestions = async (setLoad) => {
    const cached = localStorage.getItem(getTodayKey());
    if (cached) { const qs = JSON.parse(cached); setQuestions(qs); setTimer(20); setTimerActive(true); return; }
    setLoad(true);
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method:'POST',
        headers: { 'Authorization':`Bearer ${GROQ_KEY}`, 'Content-Type':'application/json' },
        body: JSON.stringify({
          model:'llama-3.3-70b-versatile',
          messages:[{ role:'user', content:`Generate 5 multiple choice Islamic quiz questions. Mix topics: Quran, Hadith, Islamic history, Fiqh, Prophets.
Return ONLY a JSON array, no other text:
[{"q":"question","opts":["A","B","C","D"],"ans":0,"exp":"explanation"}]
ans is the 0-based index of the correct answer.` }],
          max_tokens:1200, temperature:0.8,
        }),
      });
      const d    = await res.json();
      const txt  = d.choices?.[0]?.message?.content || '[]';
      const match = txt.match(/\[[\s\S]*\]/);
      const qs   = match ? JSON.parse(match[0]) : [];
      if (qs.length) { localStorage.setItem(getTodayKey(), JSON.stringify(qs)); setQuestions(qs); }
      else setQuestions(STATIC_QS.quran);
    } catch { setQuestions(STATIC_QS.quran); }
    setLoad(false); setTimer(20); setTimerActive(true);
  };

  const handleAnswer = (optIdx) => {
    clearInterval(timerRef.current); setTimerActive(false); setSelected(optIdx);
    const q       = questions[qIdx];
    const correct = q.ans;
    const isRight = optIdx === correct;
    if (isRight) setScore(s => s+1);
    setAnswers(prev => [...prev, { q, selected:optIdx, correct, isRight }]);
    setTimeout(() => {
      if (qIdx + 1 >= questions.length) {
        endQuiz();
      } else {
        setQIdx(i => i+1); setSelected(null); setTimer(20); setTimerActive(true);
      }
    }, 1500);
  };

  const endQuiz = () => {
    setPhase('result'); setTimerActive(false);
    const entry = { cat: category?.name, score, total: questions.length, date: new Date().toLocaleDateString(), pct: Math.round((score/questions.length)*100) };
    const lb = [entry, ...leaderboard].slice(0,10);
    setLeaderboard(lb);
    try { localStorage.setItem('mcq_lb', JSON.stringify(lb)); } catch {}
  };

  const q = questions[qIdx];
  const timerPct = (timer/20)*100;

  return (
    <div className="mc-root" style={{ padding:'24px 28px', maxWidth:800, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'22px 28px', marginBottom:22, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, background:'radial-gradient(ellipse,rgba(201,168,76,0.07),transparent)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:14, position:'relative' }}>
          <div style={{ width:50, height:50, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>📝</div>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:3, color:'rgba(201,168,76,0.6)', marginBottom:4 }}>KNOWLEDGE TEST</div>
            <h1 className="gold-shimmer" style={{ fontSize:22, fontWeight:800, fontFamily:'Cinzel,serif' }}>Islamic MCQ Quiz</h1>
            <p style={{ fontSize:12, color:'rgba(242,237,228,0.4)', marginTop:2 }}>Test your Islamic knowledge</p>
          </div>
          {leaderboard.length > 0 && (
            <div style={{ marginLeft:'auto', textAlign:'center', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:12, padding:'10px 14px' }}>
              <div style={{ fontFamily:'Cinzel,serif', fontSize:18, fontWeight:700, color:'#C9A84C', display:'flex', alignItems:'center', gap:4 }}><Trophy size={14}/>{leaderboard[0].pct}%</div>
              <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:1 }}>BEST</div>
            </div>
          )}
        </div>
      </div>

      {/* ══ SELECT ══ */}
      {phase === 'select' && (
        <div>
          <p style={{ fontSize:13, color:'rgba(242,237,228,0.4)', marginBottom:18 }}>Select a category to start your quiz. Each question has a 20-second timer!</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
            {CATEGORIES.map((cat, i) => (
              <div key={cat.id} className="cat-btn"
                onClick={() => startQuiz(cat)}
                style={{ animation:`fadeUp 0.3s ${i*0.06}s ease both`, borderColor:`${cat.color}20` }}
                onMouseEnter={e => e.currentTarget.style.borderColor=`${cat.color}50`}
                onMouseLeave={e => e.currentTarget.style.borderColor=`${cat.color}20`}>
                <div style={{ fontSize:28, marginBottom:8 }}>{cat.emoji}</div>
                <div style={{ fontSize:12, fontWeight:600, color:'rgba(242,237,228,0.8)', marginBottom:3 }}>{cat.name}</div>
                {cat.id === 'ai' && <div style={{ fontSize:10, color:'rgba(107,72,196,0.7)', marginTop:2 }}>Daily fresh questions</div>}
                {cat.id !== 'ai' && cat.id !== 'all' && <div style={{ fontSize:10, color:'rgba(242,237,228,0.3)' }}>{(STATIC_QS[cat.id]||[]).length} questions</div>}
              </div>
            ))}
          </div>

          {/* Recent scores */}
          {leaderboard.length > 0 && (
            <div className="mc-card" style={{ padding:'20px', marginTop:20 }}>
              <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:14, display:'flex', alignItems:'center', gap:6 }}>
                <Trophy size={12}/> RECENT SCORES
              </div>
              {leaderboard.slice(0,5).map((s,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 0', borderBottom:'1px solid rgba(201,168,76,0.06)' }}>
                  <div style={{ width:24, height:24, borderRadius:6, background:'rgba(201,168,76,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#C9A84C', fontFamily:'Cinzel,serif' }}>{i+1}</div>
                  <div style={{ flex:1, fontSize:12, color:'rgba(242,237,228,0.6)' }}>{s.cat}</div>
                  <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)' }}>{s.date}</div>
                  <div style={{ fontFamily:'Cinzel,serif', fontSize:13, fontWeight:700, color: s.pct>=80?'#2ecc71':s.pct>=60?'#C9A84C':'#e74c3c' }}>{s.score}/{s.total}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ QUIZ ══ */}
      {phase === 'quiz' && (
        <div>
          {aiLoading ? (
            <div style={{ textAlign:'center', padding:60 }}>
              <Loader size={28} color="#C9A84C" style={{ animation:'spin 1s linear infinite', marginBottom:14 }}/>
              <div style={{ color:'rgba(242,237,228,0.4)', fontSize:13 }}>🤖 Generating today's AI questions...</div>
            </div>
          ) : q ? (
            <div style={{ animation:'fadeUp 0.4s ease' }}>
              {/* Progress + Timer */}
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <div style={{ display:'flex', gap:4 }}>
                  {questions.map((_,i) => (
                    <div key={i} style={{ width:28, height:5, borderRadius:3, background: i<qIdx?'#C9A84C':i===qIdx?'rgba(201,168,76,0.5)':'rgba(255,255,255,0.06)' }}/>
                  ))}
                </div>
                {/* Timer circle */}
                <div style={{ position:'relative', width:44, height:44 }}>
                  <svg viewBox="0 0 44 44" style={{ position:'absolute', inset:0, transform:'rotate(-90deg)' }}>
                    <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4"/>
                    <circle cx="22" cy="22" r="18" fill="none"
                      stroke={timer<=5?'#e74c3c':timer<=10?'#E8C97A':'#C9A84C'} strokeWidth="4"
                      strokeDasharray="113" strokeDashoffset={113*(1-timerPct/100)}
                      style={{ transition:'stroke-dashoffset 1s linear, stroke 0.3s' }}/>
                  </svg>
                  <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cinzel,serif', fontSize:13, fontWeight:700, color:timer<=5?'#e74c3c':'#C9A84C' }}>{timer}</div>
                </div>
              </div>

              {/* Question */}
              <div className="mc-card" style={{ padding:'24px', marginBottom:16 }}>
                <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:12 }}>
                  {category?.name.toUpperCase()} · Q{qIdx+1} OF {questions.length}
                </div>
                <div style={{ fontSize:16, fontWeight:600, color:'rgba(242,237,228,0.9)', lineHeight:1.6 }}>{q.q}</div>
              </div>

              {/* Options */}
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {q.opts.map((opt, i) => {
                  const cls = selected !== null
                    ? i===q.ans ? 'correct' : i===selected&&i!==q.ans ? 'wrong' : ''
                    : '';
                  return (
                    <button key={i} className={`opt-btn ${cls}`}
                      disabled={selected !== null}
                      onClick={() => handleAnswer(i)}
                      style={{ animation:`fadeUp 0.3s ${i*0.07}s ease both` }}>
                      <span style={{ display:'inline-flex', width:24, height:24, borderRadius:6, background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#C9A84C', marginRight:10, flexShrink:0, fontFamily:'Cinzel,serif' }}>
                        {['A','B','C','D'][i]}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {selected !== null && q.exp && (
                <div style={{ marginTop:14, padding:'14px 18px', background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:12, animation:'fadeUp 0.3s ease' }}>
                  <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:1, marginBottom:6 }}>💡 EXPLANATION</div>
                  <div style={{ fontSize:13, color:'rgba(242,237,228,0.65)', lineHeight:1.7 }}>{q.exp}</div>
                </div>
              )}

              {/* Score */}
              <div style={{ textAlign:'right', marginTop:12, fontSize:12, color:'rgba(242,237,228,0.3)' }}>
                Score: <span style={{ color:'#C9A84C', fontWeight:700 }}>{score}/{qIdx}</span>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ══ RESULT ══ */}
      {phase === 'result' && (
        <div style={{ animation:'fadeUp 0.5s ease', textAlign:'center' }}>
          <div className="mc-card" style={{ padding:'36px 28px', marginBottom:16 }}>
            <div style={{ fontSize:52, marginBottom:12 }}>
              {score/questions.length >= 0.8 ? '🏆' : score/questions.length >= 0.6 ? '⭐' : '📚'}
            </div>
            <h2 className="gold-shimmer" style={{ fontFamily:'Cinzel,serif', fontSize:24, fontWeight:700, marginBottom:6 }}>
              {score/questions.length >= 0.8 ? 'Excellent!' : score/questions.length >= 0.6 ? 'Good Job!' : 'Keep Learning!'}
            </h2>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:48, fontWeight:900, color:'#C9A84C', margin:'12px 0' }}>
              {score}<span style={{ fontSize:24, color:'rgba(201,168,76,0.5)' }}>/{questions.length}</span>
            </div>
            <div style={{ fontSize:14, color:'rgba(242,237,228,0.5)', marginBottom:24 }}>
              {Math.round((score/questions.length)*100)}% correct · {category?.name}
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button onClick={() => startQuiz(category)}
                style={{ padding:'12px 24px', background:'linear-gradient(135deg,#C9A84C,#E8C97A)', border:'none', borderRadius:10, color:'#050505', fontFamily:'Cinzel,serif', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                <RefreshCw size={14}/> Try Again
              </button>
              <button onClick={() => setPhase('select')}
                style={{ padding:'12px 24px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:10, color:'#C9A84C', fontFamily:'Cinzel,serif', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                Categories <ChevronRight size={14}/>
              </button>
            </div>
          </div>

          {/* Review answers */}
          <div className="mc-card" style={{ padding:'20px', textAlign:'left' }}>
            <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:14 }}>REVIEW ANSWERS</div>
            {answers.map((a, i) => (
              <div key={i} style={{ padding:'12px 14px', background: a.isRight?'rgba(46,204,113,0.06)':'rgba(231,76,60,0.06)', border:`1px solid ${a.isRight?'rgba(46,204,113,0.2)':'rgba(231,76,60,0.15)'}`, borderRadius:10, marginBottom:10 }}>
                <div style={{ fontSize:13, color:'rgba(242,237,228,0.8)', marginBottom:6 }}><b>{i+1}.</b> {a.q.q}</div>
                <div style={{ fontSize:12, color: a.isRight?'#2ecc71':'#e74c3c' }}>
                  {a.isRight ? '✅' : '❌'} Your answer: {a.q.opts[a.selected] || 'Time out'}
                </div>
                {!a.isRight && <div style={{ fontSize:12, color:'#2ecc71' }}>✓ Correct: {a.q.opts[a.correct]}</div>}
                {a.q.exp && <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)', marginTop:4, fontStyle:'italic' }}>{a.q.exp}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}