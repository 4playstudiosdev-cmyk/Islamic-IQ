/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .nm-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; min-height:100vh; }
  
  /* Base animations */
  @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer   { to{background-position:200% center} }
  @keyframes slideIn   { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes figureIn  { from{opacity:0;transform:scale(0.85)} to{opacity:1;transform:scale(1)} }
  @keyframes glow      { 0%,100%{filter:drop-shadow(0 0 8px rgba(201,168,76,0.3))} 50%{filter:drop-shadow(0 0 20px rgba(201,168,76,0.7))} }

  /* Position-specific animations */
  @keyframes stand     { 0%{transform:scaleY(0.95) translateY(4px)} 100%{transform:scaleY(1) translateY(0)} }
  @keyframes raiseHands{ 0%{transform:rotate(0deg)} 50%{transform:rotate(-70deg)} 100%{transform:rotate(-70deg)} }
  @keyframes foldHands { 0%{transform:rotate(-70deg)} 100%{transform:rotate(0deg)} }
  @keyframes bowDown   { 0%{transform:rotate(0deg)} 100%{transform:rotate(85deg)} }
  @keyframes riseUp    { 0%{transform:rotate(85deg)} 100%{transform:rotate(0deg)} }
  @keyframes prostrate { 0%{transform:scaleY(1) translateY(0)} 100%{transform:scaleY(0.3) translateY(40px)} }
  @keyframes sitDown   { 0%{transform:scaleY(1)} 100%{transform:scaleY(0.6) translateY(20px)} }
  @keyframes salaaam   { 0%{transform:rotate(0deg)} 40%{transform:rotate(25deg)} 60%{transform:rotate(-25deg)} 100%{transform:rotate(0deg)} }
  @keyframes breathe   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
  @keyframes matGlow   { 0%,100%{opacity:0.3} 50%{opacity:0.7} }

  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .nm-tab { background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.1); border-radius:10px; color:rgba(242,237,228,0.5); cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:12px; transition:all 0.25s; padding:9px 18px; }
  .nm-tab.active { background:rgba(201,168,76,0.15); border-color:rgba(201,168,76,0.4); color:#C9A84C; font-weight:700; }
  .nm-tab:hover { border-color:rgba(201,168,76,0.25); color:#C9A84C; }
  .step-card { background:#0F0F0D; border:1px solid rgba(201,168,76,0.1); border-radius:14px; transition:all 0.3s; cursor:pointer; }
  .step-card:hover { border-color:rgba(201,168,76,0.3); }
  .step-card.active { border-color:#C9A84C; background:rgba(201,168,76,0.06); box-shadow:0 0 20px rgba(201,168,76,0.1); }
  
  /* Figure wrapper */
  .figure-wrap { animation: figureIn 0.5s ease, glow 3s ease-in-out infinite; }
  
  /* Body parts */
  .fig-body   { transition: all 0.8s cubic-bezier(0.4,0,0.2,1); transform-origin: center bottom; }
  .fig-head   { transition: all 0.8s cubic-bezier(0.4,0,0.2,1); }
  .fig-arm-l  { transition: all 0.8s cubic-bezier(0.4,0,0.2,1); transform-origin: top center; }
  .fig-arm-r  { transition: all 0.8s cubic-bezier(0.4,0,0.2,1); transform-origin: top center; }
  .fig-leg-l  { transition: all 0.8s cubic-bezier(0.4,0,0.2,1); transform-origin: top center; }
  .fig-leg-r  { transition: all 0.8s cubic-bezier(0.4,0,0.2,1); transform-origin: top center; }
  .fig-mat    { animation: matGlow 3s ease-in-out infinite; }
`;

// ── Namaz prayers with complete rakaat info ──────────────────
const PRAYERS = [
  {
    id:'fajr', name:'Fajr', arabic:'الفجر', time:'Dawn', emoji:'🌙',
    color:'#4A6FA5', total:4,
    rakaats:[
      { type:'sunnah', count:2, label:'2 Sunnah Muakkadah', desc:'Before Fard — Highly recommended', color:'rgba(232,201,122,0.15)', border:'rgba(232,201,122,0.3)', text:'#E8C97A' },
      { type:'fard',   count:2, label:'2 Fard',             desc:'Obligatory — Must perform',      color:'rgba(201,168,76,0.15)', border:'rgba(201,168,76,0.4)',  text:'#C9A84C' },
    ],
  },
  {
    id:'dhuhr', name:'Dhuhr', arabic:'الظهر', time:'Midday', emoji:'☀️',
    color:'#C9A84C', total:12,
    rakaats:[
      { type:'sunnah', count:4, label:'4 Sunnah Muakkadah', desc:'Before Fard — Highly recommended', color:'rgba(232,201,122,0.15)', border:'rgba(232,201,122,0.3)', text:'#E8C97A' },
      { type:'fard',   count:4, label:'4 Fard',             desc:'Obligatory — Must perform',        color:'rgba(201,168,76,0.15)', border:'rgba(201,168,76,0.4)',  text:'#C9A84C' },
      { type:'sunnah', count:2, label:'2 Sunnah Muakkadah', desc:'After Fard — Highly recommended',  color:'rgba(232,201,122,0.15)', border:'rgba(232,201,122,0.3)', text:'#E8C97A' },
      { type:'nafl',   count:2, label:'2 Nafl',             desc:'After Sunnah — Optional reward',   color:'rgba(255,255,255,0.05)', border:'rgba(255,255,255,0.1)', text:'rgba(242,237,228,0.5)' },
    ],
  },
  {
    id:'asr', name:'Asr', arabic:'العصر', time:'Afternoon', emoji:'🌤️',
    color:'#E8A838', total:8,
    rakaats:[
      { type:'sunnah', count:4, label:'4 Sunnah Ghair Muakkadah', desc:'Before Fard — Optional but rewarding', color:'rgba(232,201,122,0.1)', border:'rgba(232,201,122,0.2)', text:'rgba(232,201,122,0.7)' },
      { type:'fard',   count:4, label:'4 Fard',                   desc:'Obligatory — Must perform',            color:'rgba(201,168,76,0.15)', border:'rgba(201,168,76,0.4)',  text:'#C9A84C' },
    ],
  },
  {
    id:'maghrib', name:'Maghrib', arabic:'المغرب', time:'Sunset', emoji:'🌅',
    color:'#E05C2A', total:7,
    rakaats:[
      { type:'fard',   count:3, label:'3 Fard',             desc:'Obligatory — Must perform',       color:'rgba(201,168,76,0.15)', border:'rgba(201,168,76,0.4)',  text:'#C9A84C' },
      { type:'sunnah', count:2, label:'2 Sunnah Muakkadah', desc:'After Fard — Highly recommended', color:'rgba(232,201,122,0.15)', border:'rgba(232,201,122,0.3)', text:'#E8C97A' },
      { type:'nafl',   count:2, label:'2 Nafl',             desc:'After Sunnah — Optional reward',  color:'rgba(255,255,255,0.05)', border:'rgba(255,255,255,0.1)', text:'rgba(242,237,228,0.5)' },
    ],
  },
  {
    id:'isha', name:'Isha', arabic:'العشاء', time:'Night', emoji:'🌙',
    color:'#6B48C4', total:17,
    rakaats:[
      { type:'sunnah', count:4, label:'4 Sunnah Ghair Muakkadah', desc:'Before Fard — Optional but rewarding', color:'rgba(232,201,122,0.1)', border:'rgba(232,201,122,0.2)', text:'rgba(232,201,122,0.7)' },
      { type:'fard',   count:4, label:'4 Fard',                   desc:'Obligatory — Must perform',            color:'rgba(201,168,76,0.15)', border:'rgba(201,168,76,0.4)',  text:'#C9A84C' },
      { type:'sunnah', count:2, label:'2 Sunnah Muakkadah',       desc:'After Fard — Highly recommended',      color:'rgba(232,201,122,0.15)', border:'rgba(232,201,122,0.3)', text:'#E8C97A' },
      { type:'nafl',   count:2, label:'2 Nafl',                   desc:'Optional reward',                      color:'rgba(255,255,255,0.05)', border:'rgba(255,255,255,0.1)', text:'rgba(242,237,228,0.5)' },
      { type:'witr',   count:3, label:'3 Witr (Wajib)',           desc:'Wajib — Strongly obligatory',          color:'rgba(107,72,196,0.15)', border:'rgba(107,72,196,0.4)',  text:'#9B7FE8' },
      { type:'nafl',   count:2, label:'2 Nafl',                   desc:'After Witr — Optional reward',         color:'rgba(255,255,255,0.05)', border:'rgba(255,255,255,0.1)', text:'rgba(242,237,228,0.5)' },
    ],
  },
  {
    id:'jummah', name:"Jumu'ah", arabic:'الجمعة', time:'Friday Midday', emoji:'🕌',
    color:'#2E7D32', total:14,
    rakaats:[
      { type:'sunnah', count:4, label:'4 Sunnah Muakkadah', desc:'Before Fard Khutbah',             color:'rgba(232,201,122,0.15)', border:'rgba(232,201,122,0.3)', text:'#E8C97A' },
      { type:'fard',   count:2, label:'2 Fard (Jummah)',    desc:'After Khutbah — Obligatory',       color:'rgba(201,168,76,0.15)', border:'rgba(201,168,76,0.4)',  text:'#C9A84C' },
      { type:'sunnah', count:4, label:'4 Sunnah Muakkadah', desc:'After Fard — Highly recommended',  color:'rgba(232,201,122,0.15)', border:'rgba(232,201,122,0.3)', text:'#E8C97A' },
      { type:'sunnah', count:2, label:'2 Sunnah Muakkadah', desc:'After 4 Sunnah',                   color:'rgba(232,201,122,0.15)', border:'rgba(232,201,122,0.3)', text:'#E8C97A' },
      { type:'nafl',   count:2, label:'2 Nafl',             desc:'Optional reward',                  color:'rgba(255,255,255,0.05)', border:'rgba(255,255,255,0.1)', text:'rgba(242,237,228,0.5)' },
    ],
  },
];

// ── Prayer positions steps ────────────────────────────────────
const STEPS = [
  { id:1, name:'Niyyah',        arabic:'النية',           desc:'Make intention in your heart for the specific prayer. Face the Qibla and stand upright.',                               action:'Stand straight, facing Qibla' },
  { id:2, name:'Takbir-e-Tahreema', arabic:'تكبيرة التحريمة', desc:'Raise both hands to earlobes and say "Allahu Akbar". This begins the prayer.',                                      action:'Raise hands to ears, say Allahu Akbar' },
  { id:3, name:'Qiyam',         arabic:'القيام',          desc:'Stand with hands folded. Right hand over left on chest. Recite Surah Al-Fatiha then another Surah (in first 2 rakaats).', action:'Stand, recite Fatiha + Surah' },
  { id:4, name:'Ruku',          arabic:'الركوع',          desc:'Say "Allahu Akbar" and bow down. Keep back straight, horizontal. Place hands on knees. Say "Subhana Rabbiyal Azeem" 3x.', action:'Bow, hands on knees' },
  { id:5, name:'Qawmah',        arabic:'القومة',          desc:'Rise from Ruku saying "Sami Allahu liman Hamidah". Stand straight and say "Rabbana lakal Hamd".',                         action:'Rise from Ruku, stand straight' },
  { id:6, name:'Sujood',        arabic:'السجود',          desc:'Say "Allahu Akbar" and go into prostration. 7 body parts touch ground. Say "Subhana Rabbiyal Ala" 3x.',                  action:'Prostrate — 7 body parts on ground' },
  { id:7, name:'Jalsah',        arabic:'الجلسة',          desc:'Rise from Sujood saying "Allahu Akbar". Sit on left foot, right foot upright. Say "Rabbighfirli".',                        action:'Sit between prostrations' },
  { id:8, name:'Second Sujood', arabic:'السجود الثاني',   desc:'Go into second prostration saying "Allahu Akbar". Say "Subhana Rabbiyal Ala" 3x.',                                        action:'Second prostration' },
  { id:9, name:'Qa\'dah',       arabic:'القعدة',          desc:'After 2nd rakaat, sit and recite Tashahhud (At-Tahiyyat). In last rakaat also recite Durood Ibrahim and Dua.',             action:'Sit, recite Tashahhud' },
  { id:10,name:'Salaam',        arabic:'السلام',          desc:'Turn head right and say "As-salamu Alaykum wa Rahmatullah", then left. Prayer is complete.',                               action:'Turn right then left — prayer complete' },
];

// ── Animated Prayer Figure Component ─────────────────────────
function AnimatedFigure({ step }) {
  // Step configs: body transform, head tilt, arm angles, leg positions
  const configs = {
    1:  { bodyR:0,    bodyY:0,   headR:0,   armL:-8,   armR:8,    legL:3,   legR:-3,  label:'Standing' },
    2:  { bodyR:0,    bodyY:0,   headR:0,   armL:-75,  armR:75,   legL:3,   legR:-3,  label:'Takbir' },
    3:  { bodyR:0,    bodyY:0,   headR:0,   armL:-5,   armR:5,    legL:3,   legR:-3,  label:'Qiyam' },
    4:  { bodyR:85,   bodyY:0,   headR:-85, armL:-30,  armR:30,   legL:0,   legR:0,   label:'Ruku' },
    5:  { bodyR:0,    bodyY:0,   headR:0,   armL:-15,  armR:15,   legL:3,   legR:-3,  label:'Rising' },
    6:  { bodyR:0,    bodyY:60,  headR:0,   armL:-10,  armR:10,   legL:-40, legR:40,  label:'Sujood', prostrate:true },
    7:  { bodyR:0,    bodyY:30,  headR:0,   armL:-5,   armR:5,    legL:-30, legR:20,  label:'Sitting', sitting:true },
    8:  { bodyR:0,    bodyY:60,  headR:0,   armL:-10,  armR:10,   legL:-40, legR:40,  label:'Sujood 2', prostrate:true },
    9:  { bodyR:0,    bodyY:30,  headR:0,   armL:-5,   armR:5,    legL:-30, legR:20,  label:'Qadah', sitting:true },
    10: { bodyR:0,    bodyY:0,   headR:25,  armL:-8,   armR:8,    legL:3,   legR:-3,  label:'Salaam' },
  };

  const c = configs[step] || configs[1];
  const G = '#C9A84C';   // gold
  const G2= '#E8C97A';   // light gold
  const W = 160, H = 220;
  const cx = W/2;

  // Prostrate position — full body horizontal
  if (c.prostrate) return (
    <svg viewBox={`0 0 ${W} 130`} className="figure-wrap" style={{width:'100%',maxWidth:240,height:130}}>
      {/* Prayer mat */}
      <ellipse cx={cx} cy={115} rx={68} ry={10} fill="rgba(201,168,76,0.15)" className="fig-mat"/>
      <ellipse cx={cx} cy={112} rx={62} ry={7}  fill="rgba(201,168,76,0.08)"/>
      {/* Body horizontal */}
      <g style={{transformOrigin:`${cx}px 60px`,transition:'all 0.8s cubic-bezier(0.4,0,0.2,1)'}}>
        {/* Head down */}
        <circle cx={cx-45} cy={60} r={12} fill={G} opacity={0.9}/>
        {/* Torso */}
        <rect x={cx-40} y={55} width={55} height={12} rx={6} fill={G2}/>
        {/* Arms up */}
        <rect x={cx+10} y={45} width={10} height={28} rx={5} fill={G2} transform={`rotate(-20,${cx+15},50)`}/>
        <rect x={cx+10} y={45} width={10} height={28} rx={5} fill={G2} transform={`rotate(20,${cx+15},50)`}/>
        {/* Legs bent */}
        <rect x={cx+15} y={58} width={10} height={30} rx={5} fill={G2} transform={`rotate(80,${cx+20},62)`}/>
        <rect x={cx+18} y={58} width={10} height={30} rx={5} fill={G2} transform={`rotate(75,${cx+23},62)`}/>
      </g>
      {/* Forehead on mat */}
      <circle cx={cx-45} cy={100} r={7} fill={G} opacity={0.6}/>
      {/* Glow */}
      <ellipse cx={cx-45} cy={104} rx={14} ry={4} fill="rgba(201,168,76,0.2)"/>
    </svg>
  );

  // Sitting position
  if (c.sitting) return (
    <svg viewBox={`0 0 ${W} 180`} className="figure-wrap" style={{width:'100%',maxWidth:200,height:180}}>
      <ellipse cx={cx} cy={168} rx={55} ry={8} fill="rgba(201,168,76,0.15)" className="fig-mat"/>
      {/* Head */}
      <circle cx={cx} cy={40} r={14} fill={G} opacity={0.9}/>
      {/* Torso sitting */}
      <rect x={cx-8} y={56} width={16} height={40} rx={7} fill={G2}/>
      {/* Arms folded */}
      <rect x={cx-28} y={65} width={10} height={25} rx={5} fill={G2} transform={`rotate(${c.armL},${cx-23},68)`}/>
      <rect x={cx+18} y={65} width={10} height={25} rx={5} fill={G2} transform={`rotate(${c.armR},${cx+23},68)`}/>
      {/* Legs sitting — bent forward */}
      <rect x={cx-18} y={96} width={12} height={38} rx={5} fill={G2} transform={`rotate(-45,${cx-12},100)`}/>
      <rect x={cx+6}  y={96} width={12} height={38} rx={5} fill={G2} transform={`rotate(45,${cx+12},100)`}/>
      {/* Feet */}
      <rect x={cx-38} y={118} width={14} height={10} rx={4} fill={G} opacity={0.7}/>
      <rect x={cx+24} y={118} width={14} height={10} rx={4} fill={G} opacity={0.7}/>
    </svg>
  );

  // Ruku position
  if (c.bodyR >= 80) return (
    <svg viewBox={`0 0 ${W} 180`} className="figure-wrap" style={{width:'100%',maxWidth:200,height:180}}>
      <ellipse cx={cx} cy={168} rx={55} ry={8} fill="rgba(201,168,76,0.15)" className="fig-mat"/>
      {/* Head forward */}
      <circle cx={cx-10} cy={65} r={13} fill={G} opacity={0.9}/>
      {/* Torso horizontal */}
      <rect x={cx-12} y={72} width={50} height={13} rx={6} fill={G2} transform={`rotate(0,${cx},78)`}/>
      {/* Back flat */}
      <rect x={cx-12} y={72} width={52} height={10} rx={5} fill={G2}/>
      {/* Hands on knees */}
      <rect x={cx+35} y={85} width={10} height={22} rx={5} fill={G2}/>
      <rect x={cx+28} y={85} width={10} height={22} rx={5} fill={G2}/>
      {/* Legs vertical */}
      <rect x={cx+14} y={98} width={12} height={52} rx={5} fill={G2}/>
      <rect x={cx+28} y={98} width={12} height={52} rx={5} fill={G2}/>
      {/* Feet */}
      <rect x={cx+12} y={148} width={16} height={10} rx={4} fill={G} opacity={0.8}/>
      <rect x={cx+26} y={148} width={16} height={10} rx={4} fill={G} opacity={0.8}/>
    </svg>
  );

  // Normal standing positions (steps 1,2,3,5,10)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="figure-wrap" style={{width:'100%',maxWidth:180,height:220}}>
      {/* Prayer mat */}
      <ellipse cx={cx} cy={208} rx={58} ry={9} fill="rgba(201,168,76,0.15)" className="fig-mat"/>
      <ellipse cx={cx} cy={205} rx={52} ry={6} fill="rgba(201,168,76,0.08)"/>

      {/* Head — tilts for salaam */}
      <g style={{transformOrigin:`${cx}px 25px`, transform:`rotate(${c.headR}deg)`, transition:'all 0.8s cubic-bezier(0.4,0,0.2,1)'}}>
        <circle cx={cx} cy={22} r={16} fill={G} opacity={0.95}/>
        {/* Face dots */}
        <circle cx={cx-5} cy={20} r={2} fill="#050505" opacity={0.5}/>
        <circle cx={cx+5} cy={20} r={2} fill="#050505" opacity={0.5}/>
        {/* Kufi */}
        <ellipse cx={cx} cy={10} rx={12} ry={5} fill={G2} opacity={0.8}/>
      </g>

      {/* Body */}
      <g className="fig-body" style={{transformOrigin:`${cx}px 100px`,transform:`translateY(${c.bodyY*0.3}px)`}}>
        {/* Torso */}
        <rect x={cx-10} y={40} width={20} height={58} rx={9} fill={G2} opacity={0.95}/>

        {/* Left arm */}
        <g style={{transformOrigin:`${cx-10}px 48px`, transform:`rotate(${c.armL}deg)`, transition:'all 0.8s cubic-bezier(0.4,0,0.2,1)'}}>
          <rect x={cx-22} y={44} width={11} height={40} rx={5} fill={G2}/>
          <rect x={cx-24} y={82} width={13} height={14} rx={5} fill={G} opacity={0.8}/>
        </g>

        {/* Right arm */}
        <g style={{transformOrigin:`${cx+10}px 48px`, transform:`rotate(${c.armR}deg)`, transition:'all 0.8s cubic-bezier(0.4,0,0.2,1)'}}>
          <rect x={cx+11} y={44} width={11} height={40} rx={5} fill={G2}/>
          <rect x={cx+11} y={82} width={13} height={14} rx={5} fill={G} opacity={0.8}/>
        </g>

        {/* Thobe/Robe */}
        <path d={`M ${cx-14} 90 L ${cx-18} 160 L ${cx+18} 160 L ${cx+14} 90 Z`} fill={G2} opacity={0.6}/>

        {/* Left leg */}
        <g style={{transformOrigin:`${cx-6}px 100px`, transform:`rotate(${c.legL}deg)`, transition:'all 0.8s cubic-bezier(0.4,0,0.2,1)'}}>
          <rect x={cx-14} y={100} width={13} height={75} rx={6} fill={G2}/>
          <rect x={cx-16} y={170} width={17} height={12} rx={5} fill={G} opacity={0.8}/>
        </g>

        {/* Right leg */}
        <g style={{transformOrigin:`${cx+6}px 100px`, transform:`rotate(${c.legR}deg)`, transition:'all 0.8s cubic-bezier(0.4,0,0.2,1)'}}>
          <rect x={cx+1}  y={100} width={13} height={75} rx={6} fill={G2}/>
          <rect x={cx-1}  y={170} width={17} height={12} rx={5} fill={G} opacity={0.8}/>
        </g>
      </g>

      {/* Hands folded overlay for step 3 (Qiyam) */}
      {step === 3 && (
        <rect x={cx-12} y={68} width={24} height={14} rx={6} fill={G} opacity={0.6}/>
      )}

      {/* Gold aura glow */}
      <ellipse cx={cx} cy={200} rx={40} ry={6} fill="rgba(201,168,76,0.12)" style={{animation:'matGlow 3s ease-in-out infinite'}}/>
    </svg>
  );
}

export default function Namaz() {
  const [tab, setTab]           = useState('guide');      // 'guide' | 'prayers'
  const [selPrayer, setSelPrayer] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [autoPlay, setAutoPlay]   = useState(false);
  const autoRef = useRef(null);

  useEffect(() => {
    if (autoPlay) {
      autoRef.current = setInterval(() => {
        setActiveStep(s => {
          if (s >= STEPS.length - 1) { setAutoPlay(false); return s; }
          return s + 1;
        });
      }, 3000);
    }
    return () => clearInterval(autoRef.current);
  }, [autoPlay]);

  const TYPE_COLORS = {
    fard:    { bg:'rgba(201,168,76,0.15)', border:'rgba(201,168,76,0.4)',  text:'#C9A84C',  label:'FARD' },
    sunnah:  { bg:'rgba(232,201,122,0.1)', border:'rgba(232,201,122,0.3)', text:'#E8C97A',  label:'SUNNAH' },
    nafl:    { bg:'rgba(255,255,255,0.04)',border:'rgba(255,255,255,0.1)',  text:'rgba(242,237,228,0.45)', label:'NAFL' },
    witr:    { bg:'rgba(155,127,232,0.12)',border:'rgba(155,127,232,0.35)', text:'#9B7FE8',  label:'WITR' },
  };

  return (
    <div className="nm-root" style={{ padding:'24px 28px', maxWidth:1100, margin:'0 auto' }}>
      <style>{CSS}</style>

      {/* ── Header ────────────────────────────────────────── */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:20, padding:'26px 30px', marginBottom:24, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-50, right:-50, width:220, height:220, background:'radial-gradient(ellipse,rgba(201,168,76,0.07),transparent)', borderRadius:'50%', pointerEvents:'none' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:14, position:'relative' }}>
          <div style={{ width:52, height:52, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>🕌</div>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:10, letterSpacing:3, color:'rgba(201,168,76,0.6)', marginBottom:4 }}>SALAH GUIDE</div>
            <h1 className="gold-shimmer" style={{ fontSize:24, fontWeight:800, fontFamily:'Cinzel,serif' }}>Namaz Guide</h1>
            <p style={{ fontSize:12, color:'rgba(242,237,228,0.4)', marginTop:2 }}>Complete guide to Islamic prayer</p>
          </div>
        </div>
      </div>

      {/* ── Tabs ──────────────────────────────────────────── */}
      <div style={{ display:'flex', gap:8, marginBottom:24 }}>
        {[['guide','📋 Prayer Guide'],['prayers','🕐 5 Daily Prayers']].map(([id,label]) => (
          <button key={id} className={`nm-tab ${tab===id?'active':''}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          TAB 1: PRAYER GUIDE (Steps)
      ════════════════════════════════════════════════════ */}
      {tab === 'guide' && (
        <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
          {/* Steps list */}
          <div style={{ flex:'0 0 280px', minWidth:0 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif' }}>STEPS ({STEPS.length})</div>
              <button onClick={() => { setAutoPlay(p => !p); setActiveStep(0); }}
                style={{ padding:'6px 14px', background: autoPlay ? 'rgba(201,168,76,0.2)' : 'rgba(201,168,76,0.08)', border:`1px solid ${autoPlay?'rgba(201,168,76,0.5)':'rgba(201,168,76,0.2)'}`, borderRadius:8, color:'#C9A84C', fontSize:11, cursor:'pointer', fontFamily:'inherit' }}>
                {autoPlay ? '⏸ Stop' : '▶ Auto Play'}
              </button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {STEPS.map((s, i) => (
                <div key={s.id} className={`step-card ${activeStep===i?'active':''}`}
                  onClick={() => { setActiveStep(i); setAutoPlay(false); }}
                  style={{ padding:'12px 14px', display:'flex', alignItems:'center', gap:12, animation:`fadeUp 0.3s ${i*0.04}s ease both` }}>
                  <div style={{ width:30, height:30, flexShrink:0, borderRadius:8, background: activeStep===i ? 'rgba(201,168,76,0.25)' : 'rgba(201,168,76,0.08)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cinzel,serif', fontSize:11, fontWeight:700, color:'#C9A84C' }}>
                    {s.id}
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color: activeStep===i ? '#E8C97A' : 'rgba(242,237,228,0.8)' }}>{s.name}</div>
                    <div className="arabic" style={{ fontSize:12, color:'rgba(201,168,76,0.5)', marginTop:1 }}>{s.arabic}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step detail */}
          <div style={{ flex:1, minWidth:260 }}>
            <div style={{ background:'#0F0F0D', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'28px', position:'sticky', top:20, animation:'slideIn 0.3s ease' }}>
              {/* Animated Figure */}
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center', marginBottom:20, minHeight:180, background:'rgba(201,168,76,0.03)', borderRadius:16, border:'1px solid rgba(201,168,76,0.08)', padding:'16px' }}>
                <AnimatedFigure step={STEPS[activeStep].id} />
              </div>

              {/* Step info */}
              <div style={{ textAlign:'center', marginBottom:18 }}>
                <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:20, padding:'4px 14px', marginBottom:10 }}>
                  <span style={{ fontSize:11, color:'rgba(201,168,76,0.6)', fontFamily:'Cinzel,serif' }}>STEP {STEPS[activeStep].id} OF {STEPS.length}</span>
                </div>
                <h2 style={{ fontFamily:'Cinzel,serif', fontSize:20, fontWeight:700, color:'#C9A84C', marginBottom:4 }}>{STEPS[activeStep].name}</h2>
                <div className="arabic" style={{ fontSize:18, color:'rgba(201,168,76,0.6)', marginBottom:16 }}>{STEPS[activeStep].arabic}</div>
              </div>

              {/* Action badge */}
              <div style={{ background:'rgba(201,168,76,0.06)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:10, padding:'10px 16px', marginBottom:14, textAlign:'center' }}>
                <div style={{ fontSize:12, color:'#E8C97A', fontWeight:600 }}>🤲 {STEPS[activeStep].action}</div>
              </div>

              {/* Description */}
              <p style={{ fontSize:13, color:'rgba(242,237,228,0.6)', lineHeight:1.8, marginBottom:20, textAlign:'center' }}>
                {STEPS[activeStep].desc}
              </p>

              {/* Navigation */}
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={() => setActiveStep(s => Math.max(0, s-1))} disabled={activeStep===0}
                  style={{ flex:1, padding:'11px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:10, color: activeStep===0 ? 'rgba(242,237,228,0.2)' : '#C9A84C', cursor: activeStep===0 ? 'not-allowed' : 'pointer', fontSize:13, fontFamily:'inherit' }}>
                  ← Previous
                </button>
                <button onClick={() => setActiveStep(s => Math.min(STEPS.length-1, s+1))} disabled={activeStep===STEPS.length-1}
                  style={{ flex:1, padding:'11px', background: activeStep===STEPS.length-1 ? 'rgba(201,168,76,0.08)' : 'linear-gradient(135deg,#C9A84C,#E8C97A)', border:'none', borderRadius:10, color: activeStep===STEPS.length-1 ? 'rgba(242,237,228,0.2)' : '#050505', cursor: activeStep===STEPS.length-1 ? 'not-allowed' : 'pointer', fontSize:13, fontWeight:700, fontFamily:'Cinzel,serif' }}>
                  Next →
                </button>
              </div>

              {/* Progress dots */}
              <div style={{ display:'flex', justifyContent:'center', gap:5, marginTop:16 }}>
                {STEPS.map((_, i) => (
                  <div key={i} onClick={() => setActiveStep(i)} style={{ width: activeStep===i ? 16 : 6, height:6, borderRadius:3, background: activeStep===i ? '#C9A84C' : 'rgba(201,168,76,0.2)', cursor:'pointer', transition:'all 0.3s' }}/>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          TAB 2: 5 DAILY PRAYERS
      ════════════════════════════════════════════════════ */}
      {tab === 'prayers' && (
        <div>
          {!selPrayer ? (
            // ── Prayer selection grid ──
            <div>
              <p style={{ fontSize:13, color:'rgba(242,237,228,0.4)', marginBottom:18, lineHeight:1.7 }}>
                Select a prayer to see its complete rakaat breakdown — Sunnah, Fard, Nafl and Witr.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
                {PRAYERS.map((p, i) => (
                  <div key={p.id} onClick={() => setSelPrayer(p)}
                    style={{ background:'#0F0F0D', border:'1px solid rgba(201,168,76,0.1)', borderRadius:18, padding:'22px 20px', cursor:'pointer', transition:'all 0.3s', animation:`fadeUp 0.4s ${i*0.07}s ease both` }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.35)'; e.currentTarget.style.transform='translateY(-3px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(201,168,76,0.1)'; e.currentTarget.style.transform='translateY(0)'; }}
                  >
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                      <div style={{ fontSize:32 }}>{p.emoji}</div>
                      <div style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:8, padding:'4px 10px', fontFamily:'Cinzel,serif', fontSize:11, color:'#C9A84C' }}>
                        {p.total} Rakaats
                      </div>
                    </div>
                    <div className="arabic" style={{ fontSize:18, color:'rgba(201,168,76,0.6)', marginBottom:4 }}>{p.arabic}</div>
                    <div style={{ fontFamily:'Cinzel,serif', fontSize:15, fontWeight:700, color:'#E8C97A', marginBottom:3 }}>{p.name}</div>
                    <div style={{ fontSize:11, color:'rgba(242,237,228,0.35)', marginBottom:14 }}>{p.time}</div>

                    {/* Mini rakaat pills */}
                    <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                      {p.rakaats.map((r, ri) => {
                        const tc = TYPE_COLORS[r.type];
                        return (
                          <div key={ri} style={{ background:tc.bg, border:`1px solid ${tc.border}`, borderRadius:6, padding:'3px 8px', fontSize:10, color:tc.text, fontWeight:600 }}>
                            {r.count} {r.type.charAt(0).toUpperCase()+r.type.slice(1)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // ── Prayer detail view ──
            <div>
              <button onClick={() => setSelPrayer(null)}
                style={{ padding:'8px 16px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:10, color:'#C9A84C', fontSize:12, cursor:'pointer', fontFamily:'inherit', marginBottom:20, display:'flex', alignItems:'center', gap:6 }}>
                ← All Prayers
              </button>

              {/* Prayer header */}
              <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', border:'1px solid rgba(201,168,76,0.2)', borderRadius:18, padding:'24px 28px', marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  <div style={{ fontSize:40 }}>{selPrayer.emoji}</div>
                  <div>
                    <div className="arabic" style={{ fontSize:22, color:'#C9A84C', marginBottom:4 }}>{selPrayer.arabic}</div>
                    <div style={{ fontFamily:'Cinzel,serif', fontSize:20, fontWeight:700, color:'#E8C97A' }}>{selPrayer.name}</div>
                    <div style={{ fontSize:12, color:'rgba(242,237,228,0.4)', marginTop:2 }}>{selPrayer.time}</div>
                  </div>
                  <div style={{ marginLeft:'auto', textAlign:'center', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.25)', borderRadius:14, padding:'14px 20px' }}>
                    <div style={{ fontFamily:'Cinzel,serif', fontSize:32, fontWeight:700, color:'#C9A84C' }}>{selPrayer.total}</div>
                    <div style={{ fontSize:11, color:'rgba(201,168,76,0.6)', letterSpacing:1 }}>TOTAL RAKAATS</div>
                  </div>
                </div>
              </div>

              {/* Rakaat breakdown */}
              <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:14 }}>RAKAAT BREAKDOWN</div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {selPrayer.rakaats.map((r, i) => {
                  const tc = TYPE_COLORS[r.type];
                  return (
                    <div key={i} style={{ background:tc.bg, border:`1px solid ${tc.border}`, borderRadius:16, padding:'18px 22px', display:'flex', alignItems:'center', gap:18, animation:`fadeUp 0.3s ${i*0.08}s ease both` }}>
                      {/* Rakaat count */}
                      <div style={{ width:60, height:60, flexShrink:0, borderRadius:14, background:'rgba(0,0,0,0.3)', border:`1px solid ${tc.border}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                        <div style={{ fontFamily:'Cinzel,serif', fontSize:24, fontWeight:900, color:tc.text, lineHeight:1 }}>{r.count}</div>
                        <div style={{ fontSize:8, color:tc.text, opacity:0.7, letterSpacing:1 }}>RAKAAT{r.count>1?'S':''}</div>
                      </div>

                      {/* Info */}
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                          <div style={{ fontSize:14, fontWeight:700, color:tc.text }}>{r.label}</div>
                          <div style={{ background:'rgba(0,0,0,0.3)', border:`1px solid ${tc.border}`, borderRadius:5, padding:'2px 7px', fontSize:9, color:tc.text, fontFamily:'Cinzel,serif', letterSpacing:1 }}>{tc.label}</div>
                        </div>
                        <div style={{ fontSize:12, color:'rgba(242,237,228,0.45)', lineHeight:1.5 }}>{r.desc}</div>
                      </div>

                      {/* Rakaat circles */}
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap', maxWidth:80, justifyContent:'flex-end' }}>
                        {Array.from({length:r.count}).map((_,ci) => (
                          <div key={ci} style={{ width:14, height:14, borderRadius:'50%', background:tc.text, opacity:0.7 }}/>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div style={{ marginTop:24, background:'#0F0F0D', border:'1px solid rgba(201,168,76,0.08)', borderRadius:14, padding:'18px 20px' }}>
                <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:12 }}>LEGEND</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:10 }}>
                  {[
                    { type:'fard',   label:'Fard',   desc:'Obligatory — Missing is a sin' },
                    { type:'sunnah', label:'Sunnah', desc:'Strongly recommended' },
                    { type:'witr',   label:'Witr',   desc:'Wajib — Nearly obligatory' },
                    { type:'nafl',   label:'Nafl',   desc:'Optional — Extra reward' },
                  ].map(l => {
                    const tc = TYPE_COLORS[l.type];
                    return (
                      <div key={l.type} style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:10, height:10, borderRadius:'50%', background:tc.text, flexShrink:0 }}/>
                        <div>
                          <div style={{ fontSize:12, fontWeight:600, color:tc.text }}>{l.label}</div>
                          <div style={{ fontSize:10, color:'rgba(242,237,228,0.3)' }}>{l.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}