/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Pause, RotateCcw, Play } from 'lucide-react';

const CSS_ANIMATIONS = `
  @keyframes waterFlow   { 0%{transform:translateY(-8px);opacity:0} 100%{transform:translateY(12px);opacity:0.8} }
  @keyframes waterDrop   { 0%,100%{transform:translateY(0) scaleY(1)} 50%{transform:translateY(4px) scaleY(1.2)} }
  @keyframes handWash    { 0%,100%{transform:rotate(-15deg)} 50%{transform:rotate(15deg)} }
  @keyndef ripple        { 0%{transform:scale(0);opacity:0.6} 100%{transform:scale(2.5);opacity:0} }
  @keyframes ripple      { 0%{transform:scale(0);opacity:0.6} 100%{transform:scale(2.5);opacity:0} }
  @keyframes breathe     { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.03)} }
  @keyframes float       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes pulse_glow  { 0%,100%{opacity:0.3} 50%{opacity:1} }
  @keyframes shimmer     { 0%,100%{opacity:0.4;transform:scaleX(1)} 50%{opacity:1;transform:scaleX(1.05)} }
  @keyframes mouthWash   { 0%,100%{transform:rotate(0deg)} 30%{transform:rotate(-20deg)} 70%{transform:rotate(20deg)} }
  @keyframes noseWash    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
  @keyframes earWipe     { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-10deg)} }
  @keyframes footWash    { 0%,100%{transform:rotate(0deg) translateY(0)} 50%{transform:rotate(5deg) translateY(-6px)} }
  @keyframes headWipe    { 0%,100%{transform:translateX(0)} 50%{transform:translateX(8px)} }
  @keyframes blink       { 0%,90%,100%{transform:scaleY(1)} 95%{transform:scaleY(0.1)} }
  @keyframes shadowPulse { 0%,100%{transform:scaleX(1);opacity:0.3} 50%{transform:scaleX(0.85);opacity:0.5} }
  @keyframes waterSplash { 0%{transform:scale(0) translateY(0);opacity:1} 100%{transform:scale(2) translateY(8px);opacity:0} }
`;

const gold  = '#D4AF37';
const skin  = '#C4956A';
const water = '#5dade2';
const waterLight = '#aed6f1';
const robe  = '#1B6B3A';

// ── Water drops component ──────────────────────────────────────
const WaterDrops = ({ x, y, count = 5, animated = true }) => (
  <g>
    {Array.from({length: count}).map((_,i) => (
      <ellipse key={i}
        cx={x + (i-count/2)*5}
        cy={y}
        rx="2.5" ry="4"
        fill={water} opacity="0.7"
        style={{ animation: animated ? `waterFlow ${0.8 + i*0.15}s ${i*0.1}s linear infinite` : 'none' }}
      />
    ))}
  </g>
);

// ── Ripple effect ──────────────────────────────────────────────
const Ripple = ({ cx, cy, color = water, animated = true }) => (
  <g>
    {[0,0.3,0.6].map((d,i) => (
      <circle key={i} cx={cx} cy={cy} r="8" fill="none"
        stroke={color} strokeWidth="1.5" opacity="0.5"
        style={{ animation: animated ? `ripple 1.5s ${d}s ease-out infinite` : 'none' }}
      />
    ))}
  </g>
);

// ── WUDU FIGURE COMPONENT ─────────────────────────────────────
const WuduFigure = ({ step, animated }) => {

  const anim = (name, dur = '2s', delay = '0s') =>
    animated ? `${name} ${dur} ${delay} ease-in-out infinite` : 'none';

  const steps = {

    // ── NIYYAH - Standing ─────────────────────────────────────
    niyyah: (
      <g transform="translate(110, 8)">
        <ellipse cx="0" cy="185" rx="30" ry="6" fill="rgba(0,0,0,0.2)" style={{animation:anim('shadowPulse','3s')}}/>
        <g style={{animation:anim('float','3s')}}>
          {/* Robe */}
          <path d="M-20,58 L-24,168 L24,168 L20,58 Z" fill={robe}/>
          <path d="M-20,58 L-24,168 L0,163 L24,168 L20,58 Z" fill="#145228" opacity="0.35"/>
          {/* Arms - hands cupped for niyyah */}
          <path d="M-20,68 L-38,110 L-24,114 L-12,72" fill={robe}/>
          <path d="M20,68 L38,110 L24,114 L12,72" fill={robe}/>
          {/* Cupped hands */}
          <path d="M-36,112 Q-30,122 -20,120 Q-10,118 -6,112" fill={skin} stroke={skin} strokeWidth="1"/>
          <path d="M36,112 Q30,122 20,120 Q10,118 6,112" fill={skin} stroke={skin} strokeWidth="1"/>
          {/* Heart glow for intention */}
          <path d="M-6,85 Q0,78 6,85 Q12,92 0,100 Q-12,92 -6,85" fill={gold} opacity="0.25" style={{animation:anim('pulse_glow','2s')}}/>
          <path d="M-4,87 Q0,82 4,87 Q8,92 0,98 Q-8,92 -4,87" fill={gold} opacity="0.5" style={{animation:anim('pulse_glow','2s','0.3s')}}/>
          {/* Feet */}
          <ellipse cx="-10" cy="170" rx="11" ry="5" fill="#1a0a00" opacity="0.8"/>
          <ellipse cx="10"  cy="170" rx="11" ry="5" fill="#1a0a00" opacity="0.8"/>
        </g>
        {/* Neck */}
        <rect x="-5" y="48" width="10" height="14" rx="4" fill={skin}/>
        {/* Head */}
        <g style={{animation:anim('breathe','4s')}}>
          <circle cx="0" cy="28" r="22" fill={skin}/>
          <circle cx="-7" cy="24" r="3" fill="#3a2010" opacity="0.8" style={{animation:anim('blink','4s')}}/>
          <circle cx="7"  cy="24" r="3" fill="#3a2010" opacity="0.8" style={{animation:anim('blink','4s','0.1s')}}/>
          <path d="M-5,34 Q0,38 5,34" fill="none" stroke="#3a2010" strokeWidth="1.5" opacity="0.6"/>
          <ellipse cx="0" cy="9"  rx="19" ry="8" fill={gold} opacity="0.85"/>
          <rect x="-19"  y="7"  width="38" height="5" rx="2" fill={gold} opacity="0.7"/>
          <path d="M-10,38 Q0,48 10,38 Q5,52 0,54 Q-5,52 -10,38" fill="#2a1a0a" opacity="0.5"/>
        </g>
        {/* Intention text */}
        <text x="0" y="-5" textAnchor="middle" fontSize="10" fill={gold} fontFamily="serif" opacity="0.8" style={{animation:anim('pulse_glow','2.5s')}}>نِيَّة</text>
        <circle cx="0" cy="28" r="28" fill="none" stroke={gold} strokeWidth="1" opacity="0.15" style={{animation:anim('pulse_glow','3s')}}/>
      </g>
    ),

    // ── HANDS - Washing hands ────────────────────────────────
    hands: (
      <g transform="translate(110, 30)">
        <ellipse cx="0" cy="160" rx="30" ry="6" fill="rgba(0,0,0,0.2)"/>
        {/* Water tap / flow */}
        <rect x="-4" y="-10" width="8" height="18" rx="3" fill="#7f8c8d"/>
        <rect x="-12" y="-12" width="24" height="6" rx="3" fill="#95a5a6"/>
        <WaterDrops x="0" y="12" count={6} animated={animated}/>

        <g style={{animation:anim('float','2.5s')}}>
          <path d="M-20,55 L-22,148 L22,148 L20,55 Z" fill={robe}/>
          {/* Left hand washing */}
          <g style={{animation:anim('handWash','1.2s')}}>
            <path d="M-20,65 L-38,105 L-22,110 L-10,68" fill={robe}/>
            <ellipse cx="-30" cy="113" rx="14" ry="8" fill={skin}/>
            {/* Fingers */}
            {[-38,-33,-28,-23,-18].map((fx,i) => (
              <rect key={i} x={fx} y="100" width="4" height="15" rx="2" fill={skin}/>
            ))}
            <Ripple cx="-30" cy="118" animated={animated}/>
          </g>
          {/* Right hand being washed */}
          <g style={{animation:anim('handWash','1.2s','0.2s')}}>
            <path d="M20,65 L38,105 L22,110 L10,68" fill={robe}/>
            <ellipse cx="30" cy="113" rx="14" ry="8" fill={skin}/>
            {[18,23,28,33,38].map((fx,i) => (
              <rect key={i} x={fx} y="100" width="4" height="15" rx="2" fill={skin}/>
            ))}
            <Ripple cx="30" cy="118" animated={animated}/>
          </g>
          <ellipse cx="-10" cy="150" rx="10" ry="5" fill="#1a0a00" opacity="0.8"/>
          <ellipse cx="10"  cy="150" rx="10" ry="5" fill="#1a0a00" opacity="0.8"/>
        </g>
        <rect x="-5" y="46" width="10" height="12" rx="4" fill={skin}/>
        <g>
          <circle cx="0" cy="28" r="20" fill={skin}/>
          <circle cx="-6" cy="24" r="2.5" fill="#3a2010" opacity="0.8"/>
          <circle cx="6"  cy="24" r="2.5" fill="#3a2010" opacity="0.8"/>
          <ellipse cx="0" cy="9" rx="17" ry="7" fill={gold} opacity="0.85"/>
          <rect x="-17"  y="7" width="34" height="5" rx="2" fill={gold} opacity="0.7"/>
        </g>
        <text x="0" y="-22" textAnchor="middle" fontSize="10" fill={waterLight} opacity="0.9" style={{animation:anim('pulse_glow','2s')}}>3 times each hand</text>
      </g>
    ),

    // ── MOUTH - Rinse mouth ───────────────────────────────────
    mouth: (
      <g transform="translate(110, 12)">
        <ellipse cx="0" cy="185" rx="28" ry="6" fill="rgba(0,0,0,0.2)"/>
        <g style={{animation:anim('float','3s')}}>
          <path d="M-20,58 L-22,172 L22,172 L20,58 Z" fill={robe}/>
          {/* Right arm bringing water to mouth */}
          <g style={{animation:anim('mouthWash','2s')}}>
            <path d="M20,65 L42,40 L32,34 L12,62" fill={robe}/>
            <ellipse cx="38" cy="30" rx="12" ry="8" fill={skin}/>
            {/* Cupped hand with water */}
            <path d="M28,32 Q38,38 48,32 Q46,42 38,44 Q30,42 28,32" fill={waterLight} opacity="0.7"/>
          </g>
          {/* Water drops near mouth */}
          {animated && [0,1,2].map(i => (
            <ellipse key={i} cx={-4+i*4} cy={42} rx="1.5" ry="2.5" fill={water} opacity="0.6"
              style={{animation:`waterFlow ${0.7+i*0.1}s ${i*0.12}s linear infinite`}}/>
          ))}
          <path d="M-20,65 L-26,105 L-16,108 L-10,68" fill={robe}/>
          <ellipse cx="-22" cy="110" rx="8" ry="6" fill={skin}/>
          <ellipse cx="-10" cy="174" rx="10" ry="5" fill="#1a0a00" opacity="0.8"/>
          <ellipse cx="10"  cy="174" rx="10" ry="5" fill="#1a0a00" opacity="0.8"/>
        </g>
        <rect x="-5" y="48" width="10" height="14" rx="4" fill={skin}/>
        <g>
          <circle cx="0" cy="28" r="22" fill={skin}/>
          <circle cx="-7" cy="23" r="3" fill="#3a2010" opacity="0.8"/>
          <circle cx="7"  cy="23" r="3" fill="#3a2010" opacity="0.8"/>
          {/* Open mouth */}
          <path d="M-6,34 Q0,40 6,34 Q4,42 0,44 Q-4,42 -6,34" fill="#8B4513" opacity="0.7" style={{animation:anim('mouthWash','2s')}}/>
          <ellipse cx="0" cy="9"  rx="19" ry="8" fill={gold} opacity="0.85"/>
          <rect x="-19"  y="7"  width="38" height="5" rx="2" fill={gold} opacity="0.7"/>
          <Ripple cx="0" cy="36" color={waterLight} animated={animated}/>
        </g>
        <text x="0" y="-5" textAnchor="middle" fontSize="10" fill={waterLight} opacity="0.9" style={{animation:anim('pulse_glow','2s')}}>3 times</text>
      </g>
    ),

    // ── NOSE - Clean nose ─────────────────────────────────────
    nose: (
      <g transform="translate(110, 12)">
        <ellipse cx="0" cy="185" rx="28" ry="6" fill="rgba(0,0,0,0.2)"/>
        <g style={{animation:anim('float','3s')}}>
          <path d="M-20,58 L-22,172 L22,172 L20,58 Z" fill={robe}/>
          <g style={{animation:anim('noseWash','1.5s')}}>
            <path d="M20,65 L42,35 L32,30 L12,62" fill={robe}/>
            <ellipse cx="38" cy="26" rx="12" ry="8" fill={skin}/>
            <path d="M28,28 Q38,34 48,28 Q46,38 38,40 Q30,38 28,28" fill={waterLight} opacity="0.7"/>
          </g>
          <path d="M-20,65 L-26,105 L-16,108 L-10,68" fill={robe}/>
          <ellipse cx="-22" cy="110" rx="8" ry="6" fill={skin}/>
          <ellipse cx="-10" cy="174" rx="10" ry="5" fill="#1a0a00" opacity="0.8"/>
          <ellipse cx="10"  cy="174" rx="10" ry="5" fill="#1a0a00" opacity="0.8"/>
        </g>
        <rect x="-5" y="48" width="10" height="14" rx="4" fill={skin}/>
        <g>
          <circle cx="0" cy="28" r="22" fill={skin}/>
          <circle cx="-7" cy="23" r="3" fill="#3a2010" opacity="0.8"/>
          <circle cx="7"  cy="23" r="3" fill="#3a2010" opacity="0.8"/>
          <path d="M-5,34 Q0,38 5,34" fill="none" stroke="#3a2010" strokeWidth="1.5" opacity="0.6"/>
          {/* Nose highlighted */}
          <ellipse cx="0" cy="32" rx="5" ry="4" fill={waterLight} opacity="0.4" style={{animation:anim('pulse_glow','1.5s')}}/>
          <ellipse cx="0" cy="9"  rx="19" ry="8" fill={gold} opacity="0.85"/>
          <rect x="-19"  y="7"  width="38" height="5" rx="2" fill={gold} opacity="0.7"/>
          {animated && [0,1,2].map(i => (
            <ellipse key={i} cx={-3+i*3} cy={38} rx="1.5" ry="2.5" fill={water} opacity="0.5"
              style={{animation:`waterFlow ${0.6+i*0.1}s ${i*0.1}s linear infinite`}}/>
          ))}
        </g>
        <text x="0" y="-5" textAnchor="middle" fontSize="10" fill={waterLight} opacity="0.9" style={{animation:anim('pulse_glow','2s')}}>Sniff in + blow out 3x</text>
      </g>
    ),

    // ── FACE - Wash face ──────────────────────────────────────
    face: (
      <g transform="translate(110, 12)">
        <ellipse cx="0" cy="185" rx="28" ry="6" fill="rgba(0,0,0,0.2)"/>
        <g style={{animation:anim('float','3s')}}>
          <path d="M-20,58 L-22,172 L22,172 L20,58 Z" fill={robe}/>
          {/* Both arms raised washing face */}
          <g>
            <path d="M-20,65 L-42,35 L-30,28 L-12,62" fill={robe}/>
            <ellipse cx="-37" cy="24" rx="13" ry="8" fill={skin}/>
            <path d="M-48,26 Q-37,32 -26,26 Q-28,36 -37,38 Q-46,36 -48,26" fill={waterLight} opacity="0.7"/>
          </g>
          <g>
            <path d="M20,65 L42,35 L30,28 L12,62" fill={robe}/>
            <ellipse cx="37" cy="24" rx="13" ry="8" fill={skin}/>
            <path d="M26,26 Q37,32 48,26 Q46,36 37,38 Q28,36 26,26" fill={waterLight} opacity="0.7"/>
          </g>
          <ellipse cx="-10" cy="174" rx="10" ry="5" fill="#1a0a00" opacity="0.8"/>
          <ellipse cx="10"  cy="174" rx="10" ry="5" fill="#1a0a00" opacity="0.8"/>
        </g>
        <rect x="-5" y="48" width="10" height="14" rx="4" fill={skin}/>
        {/* Face with water flowing over it */}
        <g>
          <circle cx="0" cy="28" r="22" fill={skin}/>
          {/* Water flowing over face */}
          {animated && [-10,-4,2,8,14].map((x,i) => (
            <line key={i} x1={x} y1="8" x2={x+2} y2="48"
              stroke={waterLight} strokeWidth="2" opacity="0.4"
              style={{animation:`waterFlow ${0.6+i*0.08}s ${i*0.08}s linear infinite`}}/>
          ))}
          <circle cx="-7" cy="24" r="3" fill="#3a2010" opacity="0.7"/>
          <circle cx="7"  cy="24" r="3" fill="#3a2010" opacity="0.7"/>
          <path d="M-5,34 Q0,38 5,34" fill="none" stroke="#3a2010" strokeWidth="1.5" opacity="0.5"/>
          <ellipse cx="0" cy="9"  rx="19" ry="8" fill={gold} opacity="0.85"/>
          <rect x="-19"  y="7"  width="38" height="5" rx="2" fill={gold} opacity="0.7"/>
          {/* Water ripples on face */}
          <Ripple cx="0" cy="28" color={waterLight} animated={animated}/>
        </g>
        <text x="0" y="-5" textAnchor="middle" fontSize="10" fill={waterLight} opacity="0.9" style={{animation:anim('pulse_glow','2s')}}>Hairline to chin, ear to ear · 3x</text>
      </g>
    ),

    // ── ARMS - Wash arms ──────────────────────────────────────
    arms: (
      <g transform="translate(110, 12)">
        <ellipse cx="0" cy="185" rx="30" ry="6" fill="rgba(0,0,0,0.2)"/>
        <g style={{animation:anim('float','3s')}}>
          <path d="M-20,58 L-22,172 L22,172 L20,58 Z" fill={robe}/>
          {/* Right arm extended being washed */}
          <g>
            <path d="M20,65 L65,75 L65,90 L18,82" fill={skin}/>
            {/* Left hand washing right arm */}
            <path d="M-18,68 L-5,85 L8,80 L-8,65" fill={robe}/>
            <ellipse cx="-2" cy="88" rx="12" ry="8" fill={skin} style={{animation:anim('handWash','1.5s')}}/>
            {animated && [55,60,65].map((x,i) => (
              <ellipse key={i} cx={x} cy={88+i*3} rx="2" ry="3" fill={water} opacity="0.6"
                style={{animation:`waterFlow ${0.7+i*0.1}s ${i*0.1}s linear infinite`}}/>
            ))}
            <Ripple cx="45" cy="88" animated={animated}/>
          </g>
          <ellipse cx="-10" cy="174" rx="10" ry="5" fill="#1a0a00" opacity="0.8"/>
          <ellipse cx="10"  cy="174" rx="10" ry="5" fill="#1a0a00" opacity="0.8"/>
          {/* Elbow label */}
          {animated && <ellipse cx="64" cy="80" rx="8" ry="8" fill={gold} opacity="0.12" style={{animation:anim('pulse_glow','1.5s')}}/>}
        </g>
        <rect x="-5" y="48" width="10" height="14" rx="4" fill={skin}/>
        <g>
          <circle cx="0" cy="28" r="22" fill={skin}/>
          <circle cx="-7" cy="24" r="3" fill="#3a2010" opacity="0.8"/>
          <circle cx="7"  cy="24" r="3" fill="#3a2010" opacity="0.8"/>
          <path d="M-5,34 Q0,38 5,34" fill="none" stroke="#3a2010" strokeWidth="1.5" opacity="0.6"/>
          <ellipse cx="0" cy="9"  rx="19" ry="8" fill={gold} opacity="0.85"/>
          <rect x="-19"  y="7"  width="38" height="5" rx="2" fill={gold} opacity="0.7"/>
        </g>
        <text x="0" y="-5" textAnchor="middle" fontSize="10" fill={waterLight} opacity="0.9" style={{animation:anim('pulse_glow','2s')}}>Fingertips to elbows · 3x each</text>
      </g>
    ),

    // ── HEAD - Wipe head ──────────────────────────────────────
    head: (
      <g transform="translate(110, 12)">
        <ellipse cx="0" cy="185" rx="28" ry="6" fill="rgba(0,0,0,0.2)"/>
        <g style={{animation:anim('float','3s')}}>
          <path d="M-20,58 L-22,172 L22,172 L20,58 Z" fill={robe}/>
          {/* Both hands on head wiping */}
          <g style={{animation:anim('headWipe','2s')}}>
            <path d="M-20,65 L-32,30 L-20,24 L-10,60" fill={robe}/>
            <ellipse cx="-27" cy="20" rx="12" ry="7" fill={skin}/>
            <path d="M20,65 L32,30 L20,24 L10,60" fill={robe}/>
            <ellipse cx="27" cy="20" rx="12" ry="7" fill={skin}/>
          </g>
          <ellipse cx="-10" cy="174" rx="10" ry="5" fill="#1a0a00" opacity="0.8"/>
          <ellipse cx="10"  cy="174" rx="10" ry="5" fill="#1a0a00" opacity="0.8"/>
        </g>
        <rect x="-5" y="48" width="10" height="14" rx="4" fill={skin}/>
        <g>
          <circle cx="0" cy="28" r="22" fill={skin}/>
          <circle cx="-7" cy="24" r="3" fill="#3a2010" opacity="0.8"/>
          <circle cx="7"  cy="24" r="3" fill="#3a2010" opacity="0.8"/>
          <path d="M-5,34 Q0,38 5,34" fill="none" stroke="#3a2010" strokeWidth="1.5" opacity="0.6"/>
          {/* Wet hair highlight */}
          <ellipse cx="0" cy="9" rx="19" ry="8" fill={waterLight} opacity="0.35" style={{animation:anim('shimmer','2s')}}/>
          <ellipse cx="0" cy="9" rx="19" ry="8" fill={gold} opacity="0.75"/>
          <rect x="-19" y="7" width="38" height="5" rx="2" fill={gold} opacity="0.65"/>
          {/* Arrow showing front to back */}
          {animated && <path d="M-15,5 L15,5" stroke={waterLight} strokeWidth="2" strokeDasharray="3,2" markerEnd="url(#arr)" opacity="0.7" style={{animation:anim('headWipe','2s')}}/>}
        </g>
        <text x="0" y="-5" textAnchor="middle" fontSize="10" fill={waterLight} opacity="0.9" style={{animation:anim('pulse_glow','2s')}}>Front to back · once (Fard)</text>
      </g>
    ),

    // ── EARS - Wipe ears ──────────────────────────────────────
    ears: (
      <g transform="translate(110, 12)">
        <ellipse cx="0" cy="185" rx="28" ry="6" fill="rgba(0,0,0,0.2)"/>
        <g style={{animation:anim('float','3s')}}>
          <path d="M-20,58 L-22,172 L22,172 L20,58 Z" fill={robe}/>
          <g style={{animation:anim('earWipe','1.5s')}}>
            <path d="M-20,65 L-36,28 L-24,22 L-10,62" fill={robe}/>
            <ellipse cx="-31" cy="18" rx="11" ry="7" fill={skin}/>
            <path d="M20,65 L36,28 L24,22 L10,62" fill={robe}/>
            <ellipse cx="31" cy="18" rx="11" ry="7" fill={skin}/>
          </g>
          <ellipse cx="-10" cy="174" rx="10" ry="5" fill="#1a0a00" opacity="0.8"/>
          <ellipse cx="10"  cy="174" rx="10" ry="5" fill="#1a0a00" opacity="0.8"/>
        </g>
        <rect x="-5" y="48" width="10" height="14" rx="4" fill={skin}/>
        <g>
          <circle cx="0" cy="28" r="22" fill={skin}/>
          <circle cx="-7" cy="24" r="3" fill="#3a2010" opacity="0.8"/>
          <circle cx="7"  cy="24" r="3" fill="#3a2010" opacity="0.8"/>
          <path d="M-5,34 Q0,38 5,34" fill="none" stroke="#3a2010" strokeWidth="1.5" opacity="0.6"/>
          {/* Ears highlighted */}
          <ellipse cx="-22" cy="28" rx="5" ry="8" fill={waterLight} opacity="0.4" style={{animation:anim('pulse_glow','1.5s')}}/>
          <ellipse cx="22"  cy="28" rx="5" ry="8" fill={waterLight} opacity="0.4" style={{animation:anim('pulse_glow','1.5s','0.3s')}}/>
          <ellipse cx="0" cy="9" rx="19" ry="8" fill={gold} opacity="0.85"/>
          <rect x="-19" y="7" width="38" height="5" rx="2" fill={gold} opacity="0.7"/>
        </g>
        <text x="0" y="-5" textAnchor="middle" fontSize="10" fill={waterLight} opacity="0.9" style={{animation:anim('pulse_glow','2s')}}>Index inside, thumb outside · once</text>
      </g>
    ),

    // ── FEET - Wash feet ──────────────────────────────────────
    feet: (
      <g transform="translate(110, 10)">
        <ellipse cx="0" cy="188" rx="38" ry="7" fill="rgba(0,0,0,0.25)"/>
        {/* Water puddle */}
        <ellipse cx="0" cy="185" rx="35" ry="6" fill={water} opacity="0.12" style={{animation:anim('shimmer','2s')}}/>

        <g>
          <path d="M-20,55 L-22,165 L22,165 L20,55 Z" fill={robe}/>
          <path d="M-18,68 L-28,108 L-16,112 L-8,70" fill={robe}/>
          <ellipse cx="-22" cy="114" rx="9" ry="7" fill={skin}/>
          {/* Right foot raised being washed */}
          <g style={{transformOrigin:'15px 150px', animation:anim('footWash','2s')}}>
            <path d="M15,140 L28,125 L38,130 L22,148" fill={skin}/>
            {/* Foot shape */}
            <path d="M14,148 Q28,142 42,150 Q44,162 28,164 Q14,162 14,148" fill={skin}/>
            {/* Toes */}
            {[18,23,28,33,38].map((tx,i) => (
              <circle key={i} cx={tx} cy="147" r="3" fill={skin} stroke="#C4956A" strokeWidth="0.5"/>
            ))}
            {/* Water drops on foot */}
            {animated && [20,27,34].map((fx,i) => (
              <ellipse key={i} cx={fx} cy={155+i*3} rx="2" ry="3" fill={water} opacity="0.6"
                style={{animation:`waterFlow ${0.7+i*0.12}s ${i*0.1}s linear infinite`}}/>
            ))}
            <Ripple cx="28" cy="162" animated={animated}/>
          </g>
          {/* Left foot on ground */}
          <path d="M-22,150 Q-10,144 2,152 Q4,164 -10,166 Q-24,164 -22,150" fill={skin}/>
          {[-18,-13,-8,-3,2].map((tx,i) => (
            <circle key={i} cx={tx} cy="149" r="3" fill={skin} stroke="#C4956A" strokeWidth="0.5"/>
          ))}
        </g>
        <rect x="-5" y="46" width="10" height="14" rx="4" fill={skin}/>
        <g style={{animation:anim('breathe','3s')}}>
          <circle cx="0" cy="28" r="22" fill={skin}/>
          <circle cx="-7" cy="24" r="3" fill="#3a2010" opacity="0.8"/>
          <circle cx="7"  cy="24" r="3" fill="#3a2010" opacity="0.8"/>
          <path d="M-5,34 Q0,38 5,34" fill="none" stroke="#3a2010" strokeWidth="1.5" opacity="0.6"/>
          <ellipse cx="0" cy="9"  rx="19" ry="8" fill={gold} opacity="0.85"/>
          <rect x="-19"  y="7"  width="38" height="5" rx="2" fill={gold} opacity="0.7"/>
        </g>
        <text x="0" y="-5" textAnchor="middle" fontSize="10" fill={waterLight} opacity="0.9" style={{animation:anim('pulse_glow','2s')}}>Up to ankles · 3x · start right</text>
      </g>
    ),

    // ── COMPLETE ──────────────────────────────────────────────
    complete: (
      <g transform="translate(110, 8)">
        <ellipse cx="0" cy="185" rx="30" ry="7" fill="rgba(0,0,0,0.2)" style={{animation:anim('shadowPulse','3s')}}/>
        <g style={{animation:anim('float','2.5s')}}>
          <path d="M-20,58 L-24,168 L24,168 L20,58 Z" fill={robe}/>
          {/* Arms raised in thanks */}
          <path d="M-20,68 L-40,48 L-30,40 L-12,65" fill={robe}/>
          <ellipse cx="-36" cy="36" rx="10" ry="8" fill={skin}/>
          <path d="M20,68 L40,48 L30,40 L12,65" fill={robe}/>
          <ellipse cx="36" cy="36" rx="10" ry="8" fill={skin}/>
          <ellipse cx="-10" cy="170" rx="11" ry="5" fill="#1a0a00" opacity="0.8"/>
          <ellipse cx="10"  cy="170" rx="11" ry="5" fill="#1a0a00" opacity="0.8"/>
        </g>
        <rect x="-5" y="48" width="10" height="14" rx="4" fill={skin}/>
        <g style={{animation:anim('breathe','3s')}}>
          <circle cx="0" cy="28" r="22" fill={skin}/>
          <circle cx="-7" cy="24" r="3" fill="#3a2010" opacity="0.9"/>
          <circle cx="7"  cy="24" r="3" fill="#3a2010" opacity="0.9"/>
          {/* Big smile */}
          <path d="M-8,33 Q0,42 8,33" fill="none" stroke="#3a2010" strokeWidth="2" opacity="0.8"/>
          <ellipse cx="0" cy="9"  rx="19" ry="8" fill={gold} opacity="0.9"/>
          <rect x="-19"  y="7"  width="38" height="5" rx="2" fill={gold} opacity="0.8"/>
          <path d="M-10,38 Q0,48 10,38 Q5,52 0,54 Q-5,52 -10,38" fill="#2a1a0a" opacity="0.5"/>
        </g>
        {/* Stars around */}
        {animated && [0,60,120,180,240,300].map((angle,i) => {
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * 48;
          const y = Math.sin(rad) * 48 - 30;
          return <text key={i} x={x} y={y} fontSize="14" textAnchor="middle" style={{animation:`pulse_glow ${1+i*0.2}s ${i*0.15}s ease-in-out infinite`}}>✨</text>;
        })}
        <text x="0" y="-12" textAnchor="middle" fontSize="13" fill={gold} fontWeight="bold" style={{animation:anim('pulse_glow','1.5s')}}>Wudu Complete!</text>
        <text x="0" y="3" textAnchor="middle" fontSize="10" fill={waterLight} opacity="0.9">اَلْحَمْدُ لِلَّهِ</text>
      </g>
    ),
  };

  return (
    <div style={{ width:'100%', height:230, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{CSS_ANIMATIONS}</style>
      <svg viewBox="0 0 220 200" style={{ width:'100%', maxWidth:280, height:230 }}>
        <defs>
          <radialGradient id={`wuduGlow_${step}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={water} stopOpacity="0.1"/>
            <stop offset="100%" stopColor={water} stopOpacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="110" cy="100" rx="105" ry="95" fill={`url(#wuduGlow_${step})`}/>
        {steps[step] || steps.niyyah}
      </svg>
    </div>
  );
};

// ── STEPS DATA ─────────────────────────────────────────────────
const WUDU_STEPS = [
  { id:'niyyah',   num:1, title:'Niyyah (Intention)',     arabic:'نِيَّة',              color:'#1B6B3A',
    fard: false,
    description: 'Make the intention in your heart to perform Wudu for the purpose of prayer and worship. Say Bismillah before starting.',
    dua: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n"Bismillahir Rahmanir Raheem"\n(In the name of Allah, the Most Gracious, the Most Merciful)',
    tips: ['Intention is in the heart', 'Say Bismillah aloud', 'Use clean running water', 'Face Qibla if possible'],
    audio: 'Make the intention in your heart to perform Wudu for Allah. Say Bismillah before beginning.' },

  { id:'hands',    num:2, title:'Wash Both Hands',        arabic:'غَسْلُ الْيَدَيْن',  color:'#1A5276',
    fard: false, sunnah: true,
    description: 'Wash both hands up to and including the wrists 3 times. Start with the right hand. Rub between the fingers to ensure water reaches everywhere.',
    dua: 'Wash right hand 3 times, then left hand 3 times\nRub between fingers thoroughly\nMake sure water reaches the wrists',
    tips: ['Start with RIGHT hand', 'Wash up to wrists', 'Rub between fingers', 'Ensure no dry spots', '3 times each hand'],
    audio: 'Wash your right hand three times up to the wrist, rubbing between the fingers. Then wash the left hand three times.' },

  { id:'mouth',    num:3, title:'Rinse Mouth (Madhmadhah)', arabic:'الْمَضْمَضَة',     color:'#8E44AD',
    fard: false, sunnah: true,
    description: 'Take water into your mouth with your right hand and rinse it thoroughly 3 times. Move the water around to clean all areas of the mouth.',
    dua: 'Rinse mouth 3 times thoroughly\nUse miswak (toothstick) if available\nClean teeth and gums',
    tips: ['Use right hand to take water', 'Rinse vigorously', 'Move water all around', '3 times', 'Miswak is recommended'],
    audio: 'Take water with your right hand and rinse your mouth thoroughly three times, moving the water around all parts of the mouth.' },

  { id:'nose',     num:4, title:'Clean Nose (Istinshaaq)', arabic:'الاسْتِنْشَاق',     color:'#B7950B',
    fard: false, sunnah: true,
    description: 'Take water with your right hand, sniff it into your nose, then blow it out with your left hand. Do this 3 times. This cleans the nasal passages.',
    dua: 'Sniff water into the nose with right hand\nBlow out with left hand 3 times\nClean nostrils thoroughly',
    tips: ['Sniff with RIGHT hand', 'Blow out with LEFT hand', '3 times', 'Clean both nostrils', 'Not during fasting (lightly)'],
    audio: 'Sniff water into your nose with your right hand, then blow it out with your left hand. Do this three times.' },

  { id:'face',     num:5, title:'Wash Face (FARD)',        arabic:'غَسْلُ الْوَجْه',   color:'#D35400',
    fard: true,
    description: '⭐ FARD (Obligatory): Wash the entire face 3 times — from the hairline to the chin in length, and from ear to ear in width. Include the beard.',
    dua: 'Wash face 3 times\nFrom hairline → chin\nFrom right ear → left ear\nInclude the beard',
    tips: ['⭐ This is FARD (obligatory)', 'Entire face must be wet', 'Hairline to chin', 'Ear to ear width', 'Include beard & eyebrows', '3 times'],
    audio: 'Wash your entire face three times, from the hairline down to the chin, and from ear to ear. This is obligatory — Fard.' },

  { id:'arms',     num:6, title:'Wash Arms (FARD)',         arabic:'غَسْلُ الْيَدَيْن', color:'#148F77',
    fard: true,
    description: '⭐ FARD: Wash both arms from the fingertips to and including the elbows, 3 times each. Start with the right arm. Ensure water reaches all parts.',
    dua: 'Wash RIGHT arm first\nFingertips to elbow inclusive\n3 times each arm\nThen LEFT arm',
    tips: ['⭐ This is FARD', 'Start with RIGHT arm', 'Fingertips to elbows', 'Elbows MUST be included', '3 times each arm', 'No dry spots allowed'],
    audio: 'Wash your right arm three times from the fingertips to the elbow, including the elbow. Then wash the left arm three times. This is obligatory.' },

  { id:'head',     num:7, title:'Wipe Head - Masah (FARD)', arabic:'مَسْحُ الرَّأْس',  color:'#1B6B3A',
    fard: true,
    description: '⭐ FARD: Wipe the head once with wet hands from the front hairline to the back of the neck, and then back to the front. Use both hands together.',
    dua: 'Wet both hands\nWipe from front hairline → back of neck\nThen back → front (once)\nThis is Masah — 1 time only',
    tips: ['⭐ This is FARD', 'Only ONCE (not 3 times)', 'Wet hands from wudu water', 'Front to back to front', 'Full head width'],
    audio: 'Wet your hands and wipe over your head once from the front hairline to the back of the neck and return. This is Masah and is obligatory.' },

  { id:'ears',     num:8, title:'Wipe Ears (Sunnah)',       arabic:'مَسْحُ الأُذُنَيْن', color:'#8E44AD',
    fard: false, sunnah: true,
    description: 'After Masah of the head, wipe both ears once with the same water. Use the index fingers inside the ears and thumbs on the outside/back of ears.',
    dua: 'Same water as head Masah\nIndex fingers inside the ears\nThumbs on outside\nWipe once only',
    tips: ['Use same water as head', 'Index finger inside ear canal', 'Thumb wipes outside/back', 'Once only', 'Do not put finger deep inside'],
    audio: 'Wipe your ears with the same water used for the head. Use your index fingers inside the ears and thumbs on the outside, once each.' },

  { id:'feet',     num:9, title:'Wash Feet (FARD)',          arabic:'غَسْلُ الْقَدَمَيْن', color:'#D4AF37',
    fard: true,
    description: '⭐ FARD: Wash both feet up to and including the ankles, 3 times each. Start with the right foot. Use the little finger of the left hand to wash between the toes.',
    dua: 'Wash RIGHT foot first\nFingertips to ankle inclusive\n3 times each foot\nWash between each toe\nThen wash LEFT foot',
    tips: ['⭐ This is FARD', 'Start with RIGHT foot', 'Up to and including ankles', '3 times each foot', 'Wash between ALL toes', 'Little finger of left hand between toes'],
    audio: 'Wash your right foot three times up to the ankle, washing between the toes. Then wash the left foot three times. This is obligatory.' },

  { id:'complete', num:10, title:'Dua After Wudu',           arabic:'دُعَاء',            color:'#1B6B3A',
    fard: false,
    description: 'After completing Wudu, raise your index finger and recite the Shahada dua. Your Wudu is now complete. MashAllah! You are now ready to pray! 🌟',
    dua: 'أَشْهَدُ أَنْ لَّا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ\n\n"Ashhadu an la ilaha illallah wahdahu la sharika lahu wa ashhadu anna Muhammadan abduhu wa rasuluh"\n\nWhoever says this after Wudu, all 8 gates of Paradise are opened for them! (Muslim)',
    tips: ['Raise index finger', 'Face Qibla for dua', 'All 8 gates of Paradise open!', 'Wudu stays until broken', 'Now you can pray!'],
    audio: 'After completing Wudu, recite the Shahada. Ashhadu an la ilaha illallah wahdahu la sharika lahu. Your Wudu is complete. Now you are ready to pray!' },
];

// ── MAIN COMPONENT ─────────────────────────────────────────────
export default function Wudu() {
  const [screen, setScreen]     = useState('home');
  const [step, setStep]         = useState(0);
  const [animated, setAnimated] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoRef                 = useRef(null);
  const cur                     = WUDU_STEPS[step];

  useEffect(() => {
    if (!autoPlay) { clearInterval(autoRef.current); return; }
    autoRef.current = setInterval(() => {
      setStep(s => { if (s < WUDU_STEPS.length-1) return s+1; setAutoPlay(false); return s; });
    }, 7000);
    return () => clearInterval(autoRef.current);
  }, [autoPlay]);

  const speakStep = () => {
    window.speechSynthesis.cancel();
    if (speaking) { setSpeaking(false); return; }
    setSpeaking(true);
    const voices = window.speechSynthesis.getVoices();
    const utter  = new SpeechSynthesisUtterance(cur.audio);
    const best   = voices.find(v => v.name.includes('Google UK') || v.name.includes('Zira') || v.lang === 'en-GB')
                || voices.find(v => v.lang.startsWith('en'));
    if (best) utter.voice = best;
    utter.lang = 'en-US'; utter.rate = 0.78; utter.pitch = 1.05;
    utter.onend = utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const goTo = (i) => { window.speechSynthesis.cancel(); setSpeaking(false); setStep(i); };

  // ── HOME ──────────────────────────────────────────────────────
  if (screen === 'home') return (
    <div style={{ padding:'24px 28px', maxWidth:860, margin:'0 auto' }}>
      <style>{CSS_ANIMATIONS}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#0a2040,#1A5276)', borderRadius:22, padding:'28px', marginBottom:24, textAlign:'center', border:'1px solid rgba(93,173,226,0.3)' }}>
        <div style={{ fontSize:52, marginBottom:10 }}>💧</div>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:6 }}>Wudu Guide</h1>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:8 }}>Complete animated step-by-step Wudu guide</p>
        <p style={{ fontSize:11, color:'rgba(93,173,226,0.8)', marginBottom:22 }}>اَلطَّهُورُ شَطْرُ الْإِيمَانِ — Cleanliness is half of faith (Muslim)</p>
        <button onClick={() => { setStep(0); setScreen('guide'); }} style={{ background:'linear-gradient(135deg,#1A5276,#5dade2)', color:'white', border:'none', borderRadius:50, padding:'13px 38px', fontSize:15, fontWeight:800, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:8 }}>
          <Play size={16}/> Start Wudu Guide
        </button>
      </div>

      {/* Fard vs Sunnah */}
      <div style={{ display:'flex', gap:12, marginBottom:24 }}>
        <div style={{ flex:1, background:'rgba(211,84,0,0.12)', border:'1px solid rgba(211,84,0,0.3)', borderRadius:14, padding:'14px 16px' }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#e67e22', marginBottom:6 }}>⭐ Fard (Obligatory) Steps</div>
          <div style={{ fontSize:12, color:'#7a9585', lineHeight:1.8 }}>
            • Wash Face (step 5)<br/>
            • Wash Arms to elbows (step 6)<br/>
            • Masah of head (step 7)<br/>
            • Wash feet to ankles (step 9)
          </div>
        </div>
        <div style={{ flex:1, background:'rgba(93,173,226,0.08)', border:'1px solid rgba(93,173,226,0.2)', borderRadius:14, padding:'14px 16px' }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#5dade2', marginBottom:6 }}>💧 Sunnah Steps</div>
          <div style={{ fontSize:12, color:'#7a9585', lineHeight:1.8 }}>
            • Niyyah (intention)<br/>
            • Wash hands first<br/>
            • Rinse mouth & nose<br/>
            • Wipe ears
          </div>
        </div>
      </div>

      {/* Steps grid */}
      <h2 style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>10 Steps of Wudu</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10 }}>
        {WUDU_STEPS.map((s,i) => (
          <button key={i} onClick={() => { setStep(i); setScreen('guide'); }} style={{ background:'var(--dark-card)', border:`1px solid ${s.color}22`, borderRadius:14, padding:'14px', cursor:'pointer', textAlign:'left', borderLeft:`3px solid ${s.color}`, transition:'all 0.2s', position:'relative' }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.background=`${s.color}12`; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background='var(--dark-card)'; }}
          >
            {s.fard && <div style={{ position:'absolute', top:8, right:8, background:'rgba(211,84,0,0.2)', border:'1px solid rgba(211,84,0,0.4)', borderRadius:5, padding:'1px 6px', fontSize:9, color:'#e67e22', fontWeight:700 }}>FARD</div>}
            <div style={{ width:28, height:28, background:`${s.color}22`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:s.color, marginBottom:8 }}>{i+1}</div>
            <div style={{ fontSize:11, fontWeight:700, color:'white', marginBottom:3, paddingRight: s.fard ? 36 : 0 }}>{s.title.replace(' (FARD)','').replace(' (Sunnah)','')}</div>
            <div className="arabic" style={{ fontSize:13, color:s.color }}>{s.arabic}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // ── GUIDE ─────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth:820, margin:'0 auto', padding:'20px 24px' }}>
      <style>{CSS_ANIMATIONS}</style>

      {/* Top */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <button onClick={() => { window.speechSynthesis.cancel(); setScreen('home'); setAutoPlay(false); }} style={{ background:'none', border:'none', cursor:'pointer', color:'#4a6355', fontSize:13, display:'flex', alignItems:'center', gap:5 }}>
          <ChevronLeft size={16}/> All Steps
        </button>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => setAnimated(!animated)} style={{ background: animated ? 'rgba(93,173,226,0.2)' : 'rgba(255,255,255,0.06)', border:`1px solid ${animated ? 'rgba(93,173,226,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius:8, padding:'5px 12px', cursor:'pointer', color: animated ? water : '#7a9585', fontSize:11 }}>
            {animated ? '💧 Animated' : '⏸ Static'}
          </button>
          <button onClick={() => setAutoPlay(!autoPlay)} style={{ background: autoPlay ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)', border:`1px solid ${autoPlay ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius:8, padding:'5px 12px', cursor:'pointer', color: autoPlay ? gold : '#7a9585', fontSize:11 }}>
            {autoPlay ? '⏸ Pause' : '▶ Auto Play'}
          </button>
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display:'flex', gap:5, justifyContent:'center', marginBottom:18, flexWrap:'wrap' }}>
        {WUDU_STEPS.map((s,i) => (
          <button key={i} onClick={() => goTo(i)} title={s.title} style={{ width: step===i ? 32 : 10, height:10, borderRadius:5, background: i<step ? '#2E8B57' : step===i ? s.color : 'rgba(255,255,255,0.1)', border:'none', cursor:'pointer', transition:'all 0.3s', padding:0 }}/>
        ))}
      </div>

      {/* Card */}
      <div style={{ background:`linear-gradient(135deg,${cur.color}18,rgba(8,15,10,0.95))`, border:`1px solid ${cur.color}44`, borderRadius:22, overflow:'hidden', marginBottom:16, boxShadow:`0 8px 32px ${cur.color}22` }}>
        {/* Header */}
        <div style={{ background:`linear-gradient(135deg,${cur.color}dd,${cur.color}88)`, padding:'16px 22px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>Step {cur.num} of {WUDU_STEPS.length}</div>
              {cur.fard && <div style={{ background:'rgba(211,84,0,0.3)', border:'1px solid rgba(211,84,0,0.5)', borderRadius:5, padding:'1px 8px', fontSize:10, color:'#f0a500', fontWeight:700 }}>⭐ FARD</div>}
              {cur.sunnah && <div style={{ background:'rgba(93,173,226,0.2)', border:'1px solid rgba(93,173,226,0.4)', borderRadius:5, padding:'1px 8px', fontSize:10, color:waterLight, fontWeight:700 }}>💧 Sunnah</div>}
            </div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'white', marginBottom:2 }}>{cur.title}</h2>
          </div>
          <div style={{ textAlign:'right' }}>
            <div className="arabic" style={{ fontSize:22, color:'#f5d060', fontWeight:700 }}>{cur.arabic}</div>
            <button onClick={speakStep} style={{ marginTop:6, background:'rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:8, padding:'5px 12px', cursor:'pointer', color:'white', fontSize:11, display:'flex', alignItems:'center', gap:5, marginLeft:'auto' }}>
              {speaking ? <><Pause size={11}/> Stop</> : <><Volume2 size={11}/> Listen</>}
            </button>
          </div>
        </div>

        {/* Figure + Info */}
        <div style={{ display:'flex', flexWrap:'wrap' }}>
          <div style={{ flex:'0 0 280px', background:`radial-gradient(ellipse at center,rgba(93,173,226,0.12) 0%,transparent 70%)`, display:'flex', alignItems:'center', justifyContent:'center', minHeight:240, borderRight:`1px solid ${cur.color}22` }}>
            <WuduFigure step={cur.id} animated={animated}/>
          </div>
          <div style={{ flex:1, padding:'20px 22px', minWidth:200 }}>
            <p style={{ fontSize:13, color:'#c0d4c8', lineHeight:1.85, marginBottom:16 }}>{cur.description}</p>
            {cur.tips.map((tip,i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:7 }}>
                <div style={{ width:18, height:18, background:`${cur.color}22`, borderRadius:5, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:cur.color, fontWeight:700, flexShrink:0, marginTop:1 }}>
                  {tip.startsWith('⭐') ? '⭐' : tip.startsWith('💧') ? '💧' : '✓'}
                </div>
                <span style={{ fontSize:12, color: tip.startsWith('⭐') ? '#e67e22' : '#7a9585', lineHeight:1.5 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dua box */}
        <div style={{ margin:'0 18px 18px', background:'rgba(93,173,226,0.06)', border:'1px solid rgba(93,173,226,0.2)', borderRadius:14, padding:'14px 18px' }}>
          <div style={{ fontSize:11, color:waterLight, fontWeight:700, marginBottom:8 }}>💧 Instructions</div>
          <div style={{ fontSize:12, color:'#7a9585', lineHeight:1.9, whiteSpace:'pre-line' }}>
            {cur.dua.split('\n')[0].startsWith('أ') || cur.dua.split('\n')[0].startsWith('ب') ? (
              <>
                <div className="arabic" style={{ fontSize:16, color:'#f5d060', lineHeight:2.2, marginBottom:6 }}>{cur.dua.split('\n')[0]}</div>
                <div style={{ fontSize:12, color:'#7a9585', lineHeight:1.8, whiteSpace:'pre-line' }}>{cur.dua.split('\n').slice(1).join('\n')}</div>
              </>
            ) : cur.dua}
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:14 }}>
        <button onClick={() => goTo(Math.max(0,step-1))} disabled={step===0} style={{ background:'var(--dark-card)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'11px 18px', cursor: step===0 ? 'not-allowed' : 'pointer', color: step===0 ? '#2a3a2f' : '#c0d4c8', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
          <ChevronLeft size={15}/> Prev
        </button>
        <div style={{ flex:1, textAlign:'center', fontSize:12, color:'#4a6355' }}>{step+1}/{WUDU_STEPS.length} · {cur.title}</div>
        {step < WUDU_STEPS.length-1 ? (
          <button onClick={() => goTo(step+1)} style={{ background:`linear-gradient(135deg,${cur.color},${cur.color}88)`, border:'none', borderRadius:12, padding:'11px 18px', cursor:'pointer', color:'white', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
            Next <ChevronRight size={15}/>
          </button>
        ) : (
          <button onClick={() => { setStep(0); setScreen('home'); }} style={{ background:'linear-gradient(135deg,#1A5276,#5dade2)', border:'none', borderRadius:12, padding:'11px 18px', cursor:'pointer', color:'white', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
            <RotateCcw size={14}/> Restart
          </button>
        )}
      </div>

      {/* Step strip */}
      <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:4 }}>
        {WUDU_STEPS.map((s,i) => (
          <button key={i} onClick={() => goTo(i)} style={{ flex:'0 0 auto', background: step===i ? `${s.color}22` : 'var(--dark-card)', border:`1px solid ${step===i ? s.color+'55' : 'rgba(255,255,255,0.06)'}`, borderRadius:10, padding:'7px 10px', cursor:'pointer', textAlign:'center', minWidth:65, transition:'all 0.2s', position:'relative' }}>
            {s.fard && <div style={{ position:'absolute', top:2, right:2, width:6, height:6, borderRadius:'50%', background:'#e67e22' }}/>}
            <div style={{ fontSize:10, fontWeight:700, color: step===i ? s.color : '#4a6355', marginBottom:1 }}>{i+1}</div>
            <div style={{ fontSize:9, color: step===i ? 'white' : '#4a6355', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:60 }}>{s.title.split(' ')[0]}</div>
            <div className="arabic" style={{ fontSize:10, color: step===i ? gold : '#2a3a2f', marginTop:1 }}>{s.arabic.split(' ')[0]}</div>
          </button>
        ))}
      </div>
    </div>
  );
}