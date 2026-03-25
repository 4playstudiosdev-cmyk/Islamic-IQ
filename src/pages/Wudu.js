/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .wu-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  @keyframes fadeUp    { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer   { to{background-position:200% center} }
  @keyframes waterFlow { 0%{transform:translateY(-10px);opacity:0} 100%{transform:translateY(15px);opacity:0.8} }
  @keyframes ripple    { 0%{transform:scale(0);opacity:0.7} 100%{transform:scale(3);opacity:0} }
  @keyframes handWash  { 0%,100%{transform:rotate(-20deg)} 50%{transform:rotate(20deg)} }
  @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes pulse     { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }
  @keyframes headWipe  { 0%,100%{transform:translateX(-4px)} 50%{transform:translateX(4px)} }
  @keyframes footWash  { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(8deg)} }
  @keyframes mouthWash { 0%,100%{transform:rotate(0deg)} 40%{transform:rotate(-15deg)} 70%{transform:rotate(15deg)} }
  @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes glow      { 0%,100%{filter:drop-shadow(0 0 6px rgba(93,173,226,0.4))} 50%{filter:drop-shadow(0 0 16px rgba(93,173,226,0.8))} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .wu-step { background:#0F0F0D; border:1px solid rgba(201,168,76,0.08); border-radius:12px; cursor:pointer; transition:all 0.25s; }
  .wu-step:hover { border-color:rgba(201,168,76,0.25); }
  .wu-step.active { border-color:#C9A84C; background:rgba(201,168,76,0.06); }
  .wu-step.done { border-color:rgba(46,204,113,0.3); background:rgba(46,204,113,0.04); }
  .wu-btn { background:rgba(201,168,76,0.08); border:1px solid rgba(201,168,76,0.2); border-radius:10px; color:#C9A84C; cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; transition:all 0.2s; }
  .wu-btn:hover { background:rgba(201,168,76,0.15); }
  .wu-btn:disabled { opacity:0.3; cursor:not-allowed; }
`;

const W = '#5dade2';
const WL = '#aed6f1';
const SK = '#C4956A';
const G  = '#C9A84C';
const G2 = '#E8C97A';

// ── Water drops ───────────────────────────────────────────────
const Drops = ({ x, y, n=5 }) => (
  <g style={{ animation:'glow 2s ease-in-out infinite' }}>
    {Array.from({length:n}).map((_,i) => (
      <ellipse key={i} cx={x+(i-n/2)*6} cy={y} rx="2.5" ry="4" fill={W} opacity="0.75"
        style={{ animation:`waterFlow ${0.7+i*0.18}s ${i*0.12}s linear infinite` }}/>
    ))}
  </g>
);

// ── Ripples ────────────────────────────────────────────────────
const Ripples = ({ cx, cy }) => (
  <g>
    {[0,0.35,0.7].map((d,i) => (
      <circle key={i} cx={cx} cy={cy} r="10" fill="none" stroke={W} strokeWidth="1.5" opacity="0.5"
        style={{ animation:`ripple 1.4s ${d}s ease-out infinite` }}/>
    ))}
  </g>
);

// ── 10 Wudu steps with animations ─────────────────────────────
const STEPS = [
  {
    num:1, name:'Niyyah', arabic:'النية', type:'Sunnah',
    desc:'Make intention in your heart. Say: "Bismillah Ar-Rahman Ar-Raheem" before beginning Wudu.',
    dua:'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    duaEn:'In the name of Allah, the Most Gracious, the Most Merciful.',
    svg: (
      <svg viewBox="0 0 200 200">
        <circle cx="100" cy="70" r="30" fill={SK} opacity="0.9"/>
        <rect x="82" y="98" width="36" height="55" rx="16" fill="#2E5E4E"/>
        {/* Hands raised in dua */}
        <rect x="44" y="85" width="10" height="32" rx="5" fill={SK} transform="rotate(-25,49,90)"/>
        <rect x="146" y="85" width="10" height="32" rx="5" fill={SK} transform="rotate(25,151,90)"/>
        {/* Gold glow */}
        <circle cx="100" cy="70" r="38" fill="none" stroke={G} strokeWidth="1.5" opacity="0.3"
          style={{ animation:'pulse 2s ease-in-out infinite' }}/>
        {/* Stars */}
        {[30,70,130,165].map((x,i) => (
          <text key={i} x={x} y={[40,150,35,145][i]} fontSize="12" fill={G} opacity="0.5"
            style={{ animation:`pulse ${1+i*0.3}s ease-in-out infinite` }}>✦</text>
        ))}
      </svg>
    ),
  },
  {
    num:2, name:'Washing Hands', arabic:'غسل اليدين', type:'Sunnah',
    desc:'Wash both hands up to the wrists 3 times. Make sure water reaches between fingers.',
    dua:'اللَّهُمَّ احْفَظْ يَدَيَّ',
    duaEn:'O Allah, protect my hands.',
    svg: (
      <svg viewBox="0 0 200 200">
        <Drops x="100" y="30" n={6}/>
        {/* Left hand */}
        <g style={{ animation:'handWash 1.2s ease-in-out infinite' }}>
          <rect x="60" y="80" width="28" height="55" rx="12" fill={SK}/>
          {[72,80,88,96].map((x,i) => <rect key={i} x={x} y="70" width="7" height="20" rx="3.5" fill={SK}/>)}
        </g>
        {/* Right hand */}
        <g style={{ animation:'handWash 1.2s 0.6s ease-in-out infinite' }}>
          <rect x="112" y="80" width="28" height="55" rx="12" fill={SK}/>
          {[112,120,128,136].map((x,i) => <rect key={i} x={x} y="70" width="7" height="20" rx="3.5" fill={SK}/>)}
        </g>
        <Ripples cx="100" cy="160"/>
        {/* Water stream */}
        <rect x="95" y="20" width="10" height="55" rx="5" fill={WL} opacity="0.5"
          style={{ animation:'waterFlow 0.8s linear infinite' }}/>
      </svg>
    ),
  },
  {
    num:3, name:'Rinsing Mouth', arabic:'المضمضة', type:'Sunnah',
    desc:'Rinse your mouth 3 times. Take water in your right hand, swish it around and spit it out.',
    dua:'اللَّهُمَّ أَعِنِّي عَلَى تِلَاوَةِ الْقُرْآنِ',
    duaEn:'O Allah, help me in reciting the Quran.',
    svg: (
      <svg viewBox="0 0 200 200">
        <g style={{ animation:'mouthWash 1.5s ease-in-out infinite', transformOrigin:'100px 80px' }}>
          <circle cx="100" cy="60" r="34" fill={SK}/>
          <ellipse cx="100" cy="75" rx="18" ry="8" fill="#8B4513" opacity="0.5"/>
        </g>
        {/* Water cup */}
        <rect x="130" y="90" width="30" height="38" rx="8" fill={W} opacity="0.6"/>
        <rect x="128" y="88" width="34" height="6" rx="3" fill={WL} opacity="0.8"/>
        <Drops x="105" y="80" n={3}/>
        <Ripples cx="100" cy="170"/>
      </svg>
    ),
  },
  {
    num:4, name:'Sniffing Water', arabic:'الاستنشاق', type:'Sunnah',
    desc:'Sniff water into your nose 3 times with the right hand and blow it out with the left.',
    dua:'اللَّهُمَّ أَرِحْنِي رَائِحَةَ الْجَنَّةِ',
    duaEn:'O Allah, let me smell the fragrance of Paradise.',
    svg: (
      <svg viewBox="0 0 200 200">
        <circle cx="100" cy="70" r="34" fill={SK}/>
        {/* Nose highlight */}
        <ellipse cx="100" cy="75" rx="10" ry="14" fill={SK} stroke={W} strokeWidth="2" opacity="0.8"
          style={{ animation:'pulse 1.2s ease-in-out infinite' }}/>
        <Drops x="100" y="55" n={3}/>
        {/* Right hand */}
        <rect x="55" y="90" width="26" height="42" rx="10" fill={SK}/>
        <rect x="55" y="82" width="8" height="16" rx="4" fill={SK}/>
        <rect x="64" y="80" width="8" height="16" rx="4" fill={SK}/>
        <Ripples cx="80" cy="165"/>
      </svg>
    ),
  },
  {
    num:5, name:'Washing Face', arabic:'غسل الوجه', type:'Fard',
    desc:'Wash your entire face 3 times — from the hairline to the chin and ear to ear.',
    dua:'اللَّهُمَّ بَيِّضْ وَجْهِي يَوْمَ تَبْيَضُّ الْوُجُوهُ',
    duaEn:'O Allah, brighten my face on the Day when faces become bright.',
    svg: (
      <svg viewBox="0 0 200 200">
        <Drops x="100" y="18" n={8}/>
        <g style={{ animation:'float 2s ease-in-out infinite' }}>
          <circle cx="100" cy="80" r="40" fill={SK} opacity="0.95"/>
          {/* Eyes */}
          <ellipse cx="86" cy="74" rx="7" ry="5" fill="white"/>
          <ellipse cx="114" cy="74" rx="7" ry="5" fill="white"/>
          <circle cx="87" cy="74" r="3.5" fill="#333"/>
          <circle cx="115" cy="74" r="3.5" fill="#333"/>
        </g>
        {/* Water streams on face */}
        {[70,90,110,130].map((x,i) => (
          <rect key={i} x={x} y="42" width="5" height="70" rx="2.5" fill={WL} opacity="0.4"
            style={{ animation:`waterFlow ${0.6+i*0.1}s ${i*0.15}s linear infinite` }}/>
        ))}
        <Ripples cx="100" cy="170"/>
      </svg>
    ),
  },
  {
    num:6, name:'Washing Right Arm', arabic:'غسل اليد اليمنى', type:'Fard',
    desc:'Wash your right arm 3 times from fingertips to and including the elbow.',
    dua:'اللَّهُمَّ أَعْطِنِي كِتَابِي بِيَمِينِي',
    duaEn:'O Allah, give me my record in my right hand.',
    svg: (
      <svg viewBox="0 0 200 200">
        <Drops x="120" y="25" n={5}/>
        {/* Right arm */}
        <g style={{ animation:'float 1.8s ease-in-out infinite' }}>
          <rect x="75" y="50" width="60" height="100" rx="28" fill={SK}/>
          <rect x="82" y="145" width="12" height="22" rx="6" fill={SK}/>
          <rect x="96" y="145" width="12" height="22" rx="6" fill={SK}/>
          <rect x="110" y="145" width="12" height="22" rx="6" fill={SK}/>
        </g>
        {/* Water flow */}
        {[85,100,115].map((x,i) => (
          <rect key={i} x={x} y="30" width="6" height="90" rx="3" fill={WL} opacity="0.45"
            style={{ animation:`waterFlow ${0.7+i*0.15}s ${i*0.2}s linear infinite` }}/>
        ))}
        <Ripples cx="105" cy="175"/>
      </svg>
    ),
  },
  {
    num:7, name:'Washing Left Arm', arabic:'غسل اليد اليسرى', type:'Fard',
    desc:'Wash your left arm 3 times from fingertips to and including the elbow.',
    dua:'اللَّهُمَّ لَا تُعْطِنِي كِتَابِي بِشِمَالِي',
    duaEn:'O Allah, do not give me my record in my left hand.',
    svg: (
      <svg viewBox="0 0 200 200">
        <Drops x="80" y="25" n={5}/>
        <g style={{ animation:'float 1.8s 0.4s ease-in-out infinite' }}>
          <rect x="65" y="50" width="60" height="100" rx="28" fill={SK}/>
          <rect x="72" y="145" width="12" height="22" rx="6" fill={SK}/>
          <rect x="86" y="145" width="12" height="22" rx="6" fill={SK}/>
          <rect x="100" y="145" width="12" height="22" rx="6" fill={SK}/>
        </g>
        {[72,87,102].map((x,i) => (
          <rect key={i} x={x} y="30" width="6" height="90" rx="3" fill={WL} opacity="0.45"
            style={{ animation:`waterFlow ${0.7+i*0.15}s ${i*0.2}s linear infinite` }}/>
        ))}
        <Ripples cx="95" cy="175"/>
      </svg>
    ),
  },
  {
    num:8, name:'Wiping Head', arabic:'مسح الرأس', type:'Fard',
    desc:'Wipe over your head once with wet hands — from forehead to the back of the head.',
    dua:'اللَّهُمَّ أَظِلَّنِي تَحْتَ عَرْشِكَ',
    duaEn:'O Allah, shade me under Your Throne.',
    svg: (
      <svg viewBox="0 0 200 200">
        <circle cx="100" cy="80" r="40" fill={SK} opacity="0.95"/>
        {/* Kufi */}
        <ellipse cx="100" cy="47" rx="32" ry="14" fill="#2C3E50"/>
        <ellipse cx="100" cy="43" rx="28" ry="10" fill="#34495E"/>
        {/* Wiping hands */}
        <g style={{ animation:'headWipe 1.2s ease-in-out infinite' }}>
          <rect x="38" y="44" width="50" height="12" rx="6" fill={SK} opacity="0.9"/>
          <rect x="112" y="44" width="50" height="12" rx="6" fill={SK} opacity="0.9"/>
        </g>
        {/* Water trail */}
        <rect x="48" y="48" width="104" height="5" rx="2.5" fill={WL} opacity="0.5"
          style={{ animation:'headWipe 1.2s ease-in-out infinite' }}/>
        <Drops x="100" y="35" n={4}/>
      </svg>
    ),
  },
  {
    num:9, name:'Wiping Ears', arabic:'مسح الأذنين', type:'Sunnah',
    desc:'Wipe the inside and outside of both ears with wet index fingers and thumbs.',
    dua:'اللَّهُمَّ اجْعَلْنِي مِنَ الَّذِينَ يَسْتَمِعُونَ الْقَوْلَ',
    duaEn:'O Allah, make me of those who listen to speech and follow the best.',
    svg: (
      <svg viewBox="0 0 200 200">
        <circle cx="100" cy="80" r="36" fill={SK} opacity="0.95"/>
        {/* Left ear */}
        <ellipse cx="62" cy="78" rx="10" ry="16" fill={SK} stroke={W} strokeWidth="2"
          style={{ animation:'pulse 1.5s ease-in-out infinite' }}/>
        {/* Right ear */}
        <ellipse cx="138" cy="78" rx="10" ry="16" fill={SK} stroke={W} strokeWidth="2"
          style={{ animation:'pulse 1.5s 0.5s ease-in-out infinite' }}/>
        {/* Fingers wiping */}
        <rect x="42" y="72" width="20" height="8" rx="4" fill={SK} opacity="0.8"/>
        <rect x="138" y="72" width="20" height="8" rx="4" fill={SK} opacity="0.8"/>
        <Drops x="62" y="55" n={2}/>
        <Drops x="138" y="55" n={2}/>
      </svg>
    ),
  },
  {
    num:10, name:'Washing Feet', arabic:'غسل القدمين', type:'Fard',
    desc:'Wash both feet 3 times up to and including the ankles. Wash right foot first.',
    dua:'اللَّهُمَّ ثَبِّتْ قَدَمَيَّ عَلَى الصِّرَاطِ',
    duaEn:'O Allah, keep my feet firm on the bridge.',
    svg: (
      <svg viewBox="0 0 200 200">
        <Drops x="100" y="20" n={7}/>
        {/* Right foot */}
        <g style={{ animation:'footWash 1.5s ease-in-out infinite', transformOrigin:'80px 130px' }}>
          <ellipse cx="78" cy="140" rx="32" ry="18" fill={SK}/>
          <rect x="60" y="108" width="20" height="42" rx="10" fill={SK}/>
          {[64,72,80,88,94].map((x,i) => <rect key={i} x={x} y="152" width="8" height="16" rx="4" fill={SK}/>)}
        </g>
        {/* Left foot */}
        <g style={{ animation:'footWash 1.5s 0.75s ease-in-out infinite', transformOrigin:'122px 130px' }}>
          <ellipse cx="122" cy="140" rx="32" ry="18" fill={SK}/>
          <rect x="120" y="108" width="20" height="42" rx="10" fill={SK}/>
          {[108,116,124,132,138].map((x,i) => <rect key={i} x={x} y="152" width="8" height="16" rx="4" fill={SK}/>)}
        </g>
        {/* Water */}
        {[70,90,110,130].map((x,i) => (
          <rect key={i} x={x} y="25" width="5" height="100" rx="2.5" fill={WL} opacity="0.4"
            style={{ animation:`waterFlow ${0.6+i*0.1}s ${i*0.18}s linear infinite` }}/>
        ))}
        <Ripples cx="100" cy="180"/>
      </svg>
    ),
  },
];

export default function Wudu() {
  const [step, setStep]         = useState(0);
  const [done, setDone]         = useState(new Set());
  const [autoPlay, setAutoPlay] = useState(false);
  const [view, setView]         = useState('guide'); // 'guide' | 'list'
  const autoRef = useRef(null);

  useEffect(() => {
    if (autoPlay) {
      autoRef.current = setInterval(() => {
        setStep(s => {
          if (s >= STEPS.length - 1) { setAutoPlay(false); return s; }
          return s + 1;
        });
      }, 4000);
    }
    return () => clearInterval(autoRef.current);
  }, [autoPlay]);

  const markDone = () => setDone(prev => new Set([...prev, step]));
  const cur = STEPS[step];

  return (
    <div className="wu-root" style={{ padding:'24px 28px', maxWidth:1000, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* ── Header ──────────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'24px 28px', marginBottom:22, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, background:'radial-gradient(ellipse,rgba(93,173,226,0.06),transparent)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:14, position:'relative' }}>
          <div style={{ width:50, height:50, background:'linear-gradient(135deg,#5dade2,#aed6f1)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>💧</div>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:3, color:'rgba(201,168,76,0.6)', marginBottom:4 }}>PURIFICATION</div>
            <h1 className="gold-shimmer" style={{ fontSize:22, fontWeight:800, fontFamily:'Cinzel,serif' }}>Wudu Guide</h1>
            <p style={{ fontSize:12, color:'rgba(242,237,228,0.4)', marginTop:2 }}>10 Steps to Ritual Purification</p>
          </div>
          {/* Progress */}
          <div style={{ marginLeft:'auto', textAlign:'center', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:12, padding:'10px 18px' }}>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:22, fontWeight:700, color:'#C9A84C' }}>{done.size}<span style={{ fontSize:14, color:'rgba(201,168,76,0.5)' }}>/10</span></div>
            <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:1 }}>COMPLETE</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginTop:16, height:3, background:'rgba(255,255,255,0.06)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${(done.size/10)*100}%`, background:'linear-gradient(90deg,#5dade2,#C9A84C)', borderRadius:2, transition:'width 0.5s' }}/>
        </div>
      </div>

      {/* ── View toggle ─────────────────────────────────── */}
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {[['guide','🎬 Step Guide'],['list','📋 All Steps']].map(([id,label]) => (
          <button key={id} className="wu-btn" onClick={() => setView(id)}
            style={{ padding:'9px 18px', fontSize:12, fontWeight: view===id?700:400, background: view===id?'rgba(201,168,76,0.15)':'rgba(201,168,76,0.08)', borderColor: view===id?'rgba(201,168,76,0.4)':'rgba(201,168,76,0.2)' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ════════════ GUIDE VIEW ════════════ */}
      {view === 'guide' && (
        <div style={{ display:'flex', gap:18, flexWrap:'wrap' }}>

          {/* Steps sidebar */}
          <div style={{ flex:'0 0 240px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif' }}>STEPS</div>
              <button onClick={() => { setAutoPlay(p=>!p); if(!autoPlay) setStep(0); }}
                style={{ padding:'5px 12px', background: autoPlay?'rgba(201,168,76,0.2)':'rgba(201,168,76,0.08)', border:`1px solid ${autoPlay?'rgba(201,168,76,0.5)':'rgba(201,168,76,0.2)'}`, borderRadius:7, color:'#C9A84C', fontSize:11, cursor:'pointer', fontFamily:'inherit' }}>
                {autoPlay ? '⏸ Stop' : '▶ Auto'}
              </button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {STEPS.map((s,i) => (
                <div key={s.num} className={`wu-step ${step===i?'active':''} ${done.has(i)?'done':''}`}
                  onClick={() => setStep(i)}
                  style={{ padding:'10px 12px', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:26, height:26, flexShrink:0, borderRadius:7, background: done.has(i)?'rgba(46,204,113,0.2)': step===i?'rgba(201,168,76,0.2)':'rgba(255,255,255,0.04)', border:`1px solid ${done.has(i)?'rgba(46,204,113,0.4)':step===i?'rgba(201,168,76,0.4)':'rgba(255,255,255,0.08)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color: done.has(i)?'#2ecc71':step===i?'#C9A84C':'rgba(242,237,228,0.4)' }}>
                    {done.has(i) ? '✓' : s.num}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:11, fontWeight:600, color: step===i?'#E8C97A':'rgba(242,237,228,0.7)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.name}</div>
                    <div style={{ display:'inline-block', fontSize:9, padding:'1px 6px', borderRadius:4, marginTop:2, background: s.type==='Fard'?'rgba(201,168,76,0.15)':'rgba(255,255,255,0.05)', color: s.type==='Fard'?'#C9A84C':'rgba(242,237,228,0.3)' }}>{s.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main display */}
          <div style={{ flex:1, minWidth:260 }}>
            <div style={{ background:'#0F0F0D', border:'1px solid rgba(201,168,76,0.15)', borderRadius:20, overflow:'hidden', position:'sticky', top:20 }}>

              {/* Step header */}
              <div style={{ background:'linear-gradient(135deg,rgba(93,173,226,0.1),rgba(201,168,76,0.05))', padding:'18px 22px', borderBottom:'1px solid rgba(201,168,76,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:4 }}>STEP {cur.num} OF 10</div>
                  <div style={{ fontSize:18, fontWeight:700, color:'#E8C97A', fontFamily:'Cinzel,serif' }}>{cur.name}</div>
                  <div className="arabic" style={{ fontSize:14, color:'rgba(201,168,76,0.6)', marginTop:2 }}>{cur.arabic}</div>
                </div>
                <div style={{ background: cur.type==='Fard'?'rgba(201,168,76,0.2)':'rgba(255,255,255,0.06)', border:`1px solid ${cur.type==='Fard'?'rgba(201,168,76,0.4)':'rgba(255,255,255,0.12)'}`, borderRadius:8, padding:'5px 12px', fontSize:11, fontWeight:700, color: cur.type==='Fard'?'#C9A84C':'rgba(242,237,228,0.5)', fontFamily:'Cinzel,serif' }}>
                  {cur.type}
                </div>
              </div>

              {/* Animation */}
              <div style={{ background:'rgba(0,0,0,0.3)', padding:'24px', display:'flex', justifyContent:'center', borderBottom:'1px solid rgba(201,168,76,0.08)' }}>
                <div key={step} style={{ width:200, height:200, animation:'fadeUp 0.4s ease' }}>
                  {cur.svg}
                </div>
              </div>

              {/* Description */}
              <div style={{ padding:'18px 22px' }}>
                <p style={{ fontSize:13, color:'rgba(242,237,228,0.65)', lineHeight:1.8, marginBottom:16 }}>{cur.desc}</p>

                {/* Dua */}
                <div style={{ background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.12)', borderRadius:12, padding:'14px 16px', marginBottom:16 }}>
                  <div style={{ fontSize:10, color:'rgba(201,168,76,0.5)', letterSpacing:1, marginBottom:8 }}>DUA</div>
                  <div className="arabic" style={{ fontSize:16, color:'#E8C97A', lineHeight:2, marginBottom:6, direction:'rtl' }}>{cur.dua}</div>
                  <div style={{ fontSize:11, color:'rgba(242,237,228,0.4)', fontStyle:'italic' }}>{cur.duaEn}</div>
                </div>

                {/* Mark done button */}
                <button onClick={markDone}
                  style={{ width:'100%', padding:'11px', background: done.has(step)?'rgba(46,204,113,0.15)':'linear-gradient(135deg,#C9A84C,#E8C97A)', border: done.has(step)?'1px solid rgba(46,204,113,0.3)':'none', borderRadius:10, color: done.has(step)?'#2ecc71':'#050505', fontFamily:'Cinzel,serif', fontSize:13, fontWeight:700, cursor:'pointer', letterSpacing:1, marginBottom:12 }}>
                  {done.has(step) ? '✓ Completed' : '✓ Mark as Done'}
                </button>

                {/* Nav buttons */}
                <div style={{ display:'flex', gap:8 }}>
                  <button className="wu-btn" onClick={() => setStep(s=>Math.max(0,s-1))} disabled={step===0}
                    style={{ flex:1, padding:'10px', display:'flex', alignItems:'center', justifyContent:'center', gap:6, fontSize:12 }}>
                    <ChevronLeft size={14}/> Prev
                  </button>
                  <button onClick={() => setStep(s=>Math.min(STEPS.length-1,s+1))} disabled={step===STEPS.length-1}
                    style={{ flex:1, padding:'10px', background: step===STEPS.length-1?'rgba(201,168,76,0.08)':'linear-gradient(135deg,#C9A84C,#E8C97A)', border:'none', borderRadius:10, color: step===STEPS.length-1?'rgba(242,237,228,0.3)':'#050505', fontFamily:'Cinzel,serif', fontSize:12, fontWeight:700, cursor: step===STEPS.length-1?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                    Next <ChevronRight size={14}/>
                  </button>
                </div>

                {/* Reset */}
                <button onClick={() => { setDone(new Set()); setStep(0); setAutoPlay(false); }}
                  style={{ width:'100%', marginTop:8, padding:'8px', background:'transparent', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, color:'rgba(242,237,228,0.25)', fontSize:11, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                  <RotateCcw size={11}/> Reset Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ LIST VIEW ════════════ */}
      {view === 'list' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {STEPS.map((s, i) => (
            <div key={s.num} onClick={() => { setStep(i); setView('guide'); }}
              style={{ background:'#0F0F0D', border:`1px solid ${done.has(i)?'rgba(46,204,113,0.25)':'rgba(201,168,76,0.08)'}`, borderRadius:16, padding:'16px 20px', cursor:'pointer', display:'flex', alignItems:'center', gap:16, transition:'all 0.25s', animation:`fadeUp 0.3s ${i*0.05}s ease both` }}
              onMouseEnter={e => e.currentTarget.style.borderColor='rgba(201,168,76,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor=done.has(i)?'rgba(46,204,113,0.25)':'rgba(201,168,76,0.08)'}
            >
              <div style={{ width:40, height:40, flexShrink:0, borderRadius:10, background: done.has(i)?'rgba(46,204,113,0.15)':'rgba(201,168,76,0.08)', border:`1px solid ${done.has(i)?'rgba(46,204,113,0.3)':'rgba(201,168,76,0.2)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cinzel,serif', fontSize:14, fontWeight:700, color: done.has(i)?'#2ecc71':'#C9A84C' }}>
                {done.has(i)?'✓':s.num}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:'rgba(242,237,228,0.85)' }}>{s.name}</span>
                  <div className="arabic" style={{ fontSize:13, color:'rgba(201,168,76,0.5)' }}>{s.arabic}</div>
                  <span style={{ fontSize:10, padding:'2px 7px', borderRadius:5, background: s.type==='Fard'?'rgba(201,168,76,0.15)':'rgba(255,255,255,0.05)', color: s.type==='Fard'?'#C9A84C':'rgba(242,237,228,0.3)', fontWeight:600 }}>{s.type}</span>
                </div>
                <div style={{ fontSize:12, color:'rgba(242,237,228,0.4)', lineHeight:1.6 }}>{s.desc}</div>
              </div>
              <ChevronRight size={16} color="rgba(201,168,76,0.3)"/>
            </div>
          ))}

          {/* Hadith */}
          <div style={{ marginTop:8, background:'rgba(201,168,76,0.04)', border:'1px solid rgba(201,168,76,0.1)', borderRadius:14, padding:'16px 20px', textAlign:'center' }}>
            <div className="arabic" style={{ fontSize:15, color:'rgba(201,168,76,0.7)', marginBottom:6, direction:'rtl' }}>
              الطَّهُورُ شَطْرُ الإِيمَانِ
            </div>
            <div style={{ fontSize:12, color:'rgba(242,237,228,0.3)', fontStyle:'italic' }}>
              "Cleanliness is half of faith." — Prophet Muhammad ﷺ
            </div>
          </div>
        </div>
      )}
    </div>
  );
}