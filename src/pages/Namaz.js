/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Pause, RotateCcw, Play } from 'lucide-react';

const PRAYERS = [
  { name: 'Fajr',    icon: '🌙', rakats: '2 Fard',                        color: '#1A3A5C' },
  { name: 'Dhuhr',   icon: '☀️', rakats: '4 Sunnah + 4 Fard + 2 Sunnah', color: '#B7950B' },
  { name: 'Asr',     icon: '🌤', rakats: '4 Fard',                        color: '#1B6B3A' },
  { name: 'Maghrib', icon: '🌆', rakats: '3 Fard + 2 Sunnah',             color: '#8E44AD' },
  { name: 'Isha',    icon: '🌙', rakats: '4 Fard + 2 Sunnah',             color: '#1A3A5C' },
];

// ─── CSS Animations ────────────────────────────────────────────
const CSS_ANIMATIONS = `
  @keyframes breathe    { 0%,100%{transform:scaleY(1)}  50%{transform:scaleY(1.03)} }
  @keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes headNod    { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(8deg)} }
  @keyframes armRaise   { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-60deg)} }
  @keyframes rukuBody   { 0%,100%{transform:rotate(0deg)} 100%{transform:rotate(90deg)} }
  @keyframes pulse_glow { 0%,100%{opacity:0.4} 50%{opacity:1} }
  @keyframes shimmer    { 0%{opacity:0.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} 100%{opacity:0.5;transform:scale(1)} }
  @keyframes sway       { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
  @keyframes headTurn   { 0%{transform:rotate(0deg)} 30%{transform:rotate(35deg)} 60%{transform:rotate(35deg)} 70%{transform:rotate(-35deg)} 100%{transform:rotate(-35deg)} }
  @keyframes fingerPoint{ 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-15deg)} }
  @keyframes shadowPulse{ 0%,100%{transform:scaleX(1);opacity:0.3} 50%{transform:scaleX(0.9);opacity:0.5} }
`;

// ─── Beautiful Person Component ────────────────────────────────
const PrayerFigure = ({ pose, color = '#1B6B3A', animated = true }) => {
  const gold    = '#D4AF37';
  const skin    = '#C4956A';
  const robe    = color;
  const robeDark= `${color}cc`;
    const anim = (name, dur = '2s', delay = '0s', fill = 'none') =>
    animated ? `${name} ${dur} ${delay} ease-in-out infinite ${fill}` : 'none';

  const figures = {

    // ── QIYAM / STANDING ──────────────────────────────────────
    qiyam: (
      <g transform="translate(100,10)">
        {/* Shadow */}
        <ellipse cx="0" cy="175" rx="28" ry="6" fill="rgba(0,0,0,0.25)" style={{animation: anim('shadowPulse','3s')}}/>
        {/* Prayer mat */}
        <rect x="-35" y="165" width="70" height="12" rx="3" fill="#1a4a2a" opacity="0.6"/>
        <line x1="-35" y1="168" x2="35" y2="168" stroke={gold} strokeWidth="0.5" opacity="0.4"/>
        <line x1="-35" y1="174" x2="35" y2="174" stroke={gold} strokeWidth="0.5" opacity="0.4"/>

        {/* Body group with breathe */}
        <g style={{transformOrigin:'0px 110px', animation: anim('breathe','3s')}}>
          {/* Thobe/Robe */}
          <path d="M-18,55 L-22,160 L22,160 L18,55 Z" fill={robe}/>
          <path d="M-18,55 L-22,160 L0,155 L22,160 L18,55 Z" fill={robeDark} opacity="0.3"/>
          {/* Collar */}
          <path d="M-8,55 L0,62 L8,55" fill="none" stroke={gold} strokeWidth="1.5" opacity="0.7"/>

          {/* Left arm - along body */}
          <g style={{transformOrigin:'-18px 70px'}}>
            <path d="M-18,65 L-26,120 L-18,120 L-14,65" fill={robe}/>
            <ellipse cx="-22" cy="122" rx="6" ry="5" fill={skin}/>
          </g>

          {/* Right arm - along body */}
          <g style={{transformOrigin:'18px 70px'}}>
            <path d="M18,65 L26,120 L18,120 L14,65" fill={robe}/>
            <ellipse cx="22" cy="122" rx="6" ry="5" fill={skin}/>
          </g>

          {/* Hands folded on chest */}
          <rect x="-16" y="80" width="32" height="10" rx="5" fill={skin} opacity="0.9"/>
          <rect x="-14" y="86" width="28" height="8" rx="4" fill={skin} opacity="0.7"/>

          {/* Feet */}
          <ellipse cx="-10" cy="162" rx="10" ry="5" fill="#2a1a0a" opacity="0.8"/>
          <ellipse cx="10"  cy="162" rx="10" ry="5" fill="#2a1a0a" opacity="0.8"/>
        </g>

        {/* Neck */}
        <rect x="-5" y="46" width="10" height="14" rx="4" fill={skin}/>

        {/* Head */}
        <g style={{transformOrigin:'0px 30px', animation: anim('breathe','4s','0.5s')}}>
          <circle cx="0" cy="28" r="22" fill={skin}/>
          {/* Face */}
          <circle cx="-7" cy="24" r="3" fill="#3a2010" opacity="0.8"/>
          <circle cx="7"  cy="24" r="3" fill="#3a2010" opacity="0.8"/>
          <path d="M-5,34 Q0,38 5,34" fill="none" stroke="#3a2010" strokeWidth="1.5" opacity="0.6"/>
          {/* Kufi (cap) */}
          <ellipse cx="0" cy="10" rx="19" ry="8" fill={gold} opacity="0.85"/>
          <rect x="-19" y="8" width="38" height="5" rx="2" fill={gold} opacity="0.7"/>
          {/* Beard */}
          <path d="M-10,38 Q0,48 10,38 Q5,52 0,54 Q-5,52 -10,38" fill="#2a1a0a" opacity="0.5"/>
        </g>

        {/* Light glow */}
        <circle cx="0" cy="28" r="28" fill="none" stroke={gold} strokeWidth="1" opacity="0.15" style={{animation: anim('pulse_glow','3s')}}/>
      </g>
    ),

    // ── TAKBIR - HANDS RAISED ────────────────────────────────
    takbir: (
      <g transform="translate(100,10)">
        <ellipse cx="0" cy="175" rx="28" ry="6" fill="rgba(0,0,0,0.25)"/>
        <rect x="-35" y="165" width="70" height="12" rx="3" fill="#1a4a2a" opacity="0.6"/>
        <line x1="-35" y1="168" x2="35" y2="168" stroke={gold} strokeWidth="0.5" opacity="0.4"/>

        <g style={{transformOrigin:'0px 110px', animation: anim('float','2.5s')}}>
          <path d="M-18,55 L-22,160 L22,160 L18,55 Z" fill={robe}/>
          <path d="M-18,55 L-22,160 L0,155 L22,160 L18,55 Z" fill={robeDark} opacity="0.3"/>
          <path d="M-8,55 L0,62 L8,55" fill="none" stroke={gold} strokeWidth="1.5" opacity="0.7"/>

          {/* Left arm raised */}
          <g style={{transformOrigin:'-16px 68px', animation: anim('armRaise','1.5s','0s','none')}}>
            <path d="M-16,68 L-38,30 L-28,26 L-8,68" fill={robe}/>
            <ellipse cx="-34" cy="24" rx="7" ry="6" fill={skin}/>
            {/* Fingers spread */}
            <line x1="-34" y1="20" x2="-38" y2="12" stroke={skin} strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="-33" y1="19" x2="-35" y2="11" stroke={skin} strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="-31" y1="19" x2="-31" y2="11" stroke={skin} strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="-29" y1="20" x2="-27" y2="13" stroke={skin} strokeWidth="2.5" strokeLinecap="round"/>
          </g>

          {/* Right arm raised */}
          <g style={{transformOrigin:'16px 68px', animation: anim('armRaise','1.5s','0.1s','none')}}>
            <path d="M16,68 L38,30 L28,26 L8,68" fill={robe}/>
            <ellipse cx="34" cy="24" rx="7" ry="6" fill={skin}/>
            <line x1="34" y1="20" x2="38" y2="12" stroke={skin} strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="33" y1="19" x2="35" y2="11" stroke={skin} strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="31" y1="19" x2="31" y2="11" stroke={skin} strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="29" y1="20" x2="27" y2="13" stroke={skin} strokeWidth="2.5" strokeLinecap="round"/>
          </g>

          <ellipse cx="-10" cy="162" rx="10" ry="5" fill="#2a1a0a" opacity="0.8"/>
          <ellipse cx="10"  cy="162" rx="10" ry="5" fill="#2a1a0a" opacity="0.8"/>
        </g>

        <rect x="-5" y="46" width="10" height="14" rx="4" fill={skin}/>
        <g>
          <circle cx="0" cy="28" r="22" fill={skin}/>
          <circle cx="-7" cy="24" r="3" fill="#3a2010" opacity="0.8"/>
          <circle cx="7"  cy="24" r="3" fill="#3a2010" opacity="0.8"/>
          <path d="M-5,34 Q0,38 5,34" fill="none" stroke="#3a2010" strokeWidth="1.5" opacity="0.6"/>
          <ellipse cx="0" cy="10" rx="19" ry="8" fill={gold} opacity="0.85"/>
          <rect x="-19" y="8" width="38" height="5" rx="2" fill={gold} opacity="0.7"/>
          <path d="M-10,38 Q0,48 10,38 Q5,52 0,54 Q-5,52 -10,38" fill="#2a1a0a" opacity="0.5"/>
        </g>

        {/* Allahu Akbar text */}
        <text x="0" y="-5" textAnchor="middle" fontSize="11" fill={gold} fontFamily="serif" opacity="0.8" style={{animation: anim('pulse_glow','2s')}}>اللَّهُ أَكْبَرُ</text>
        <circle cx="0" cy="28" r="28" fill="none" stroke={gold} strokeWidth="1" opacity="0.2" style={{animation: anim('pulse_glow','2s')}}/>
      </g>
    ),

    // ── RUKU - BOWING ────────────────────────────────────────
    ruku: (
      <g transform="translate(60,30)">
        <ellipse cx="60" cy="172" rx="40" ry="7" fill="rgba(0,0,0,0.25)"/>
        <rect x="10" y="163" width="90" height="12" rx="3" fill="#1a4a2a" opacity="0.6"/>

        <g style={{animation: anim('sway','3s')}}>
          {/* Head forward */}
          <g transform="translate(130,75)">
            <circle cx="0" cy="0" r="20" fill={skin}/>
            <circle cx="-6" cy="-4" r="2.5" fill="#3a2010" opacity="0.8"/>
            <circle cx="6"  cy="-4" r="2.5" fill="#3a2010" opacity="0.8"/>
            <ellipse cx="0" cy="-16" rx="17" ry="7" fill={gold} opacity="0.85"/>
            <rect x="-17" y="-18" width="34" height="5" rx="2" fill={gold} opacity="0.7"/>
            <path d="M-8,8 Q0,14 8,8 Q4,18 0,20 Q-4,18 -8,8" fill="#2a1a0a" opacity="0.5"/>
          </g>

          {/* Neck */}
          <rect x="107" y="68" width="10" height="18" rx="4" fill={skin} transform="rotate(-5,112,77)"/>

          {/* Body horizontal */}
          <path d="M20,80 L115,72 L115,96 L20,104 Z" fill={robe}/>
          <path d="M20,80 L115,72 L115,84 L20,92 Z" fill={robeDark} opacity="0.4"/>

          {/* Arms hanging down */}
          <path d="M40,88 L35,132 L50,132 L52,88" fill={robe}/>
          <ellipse cx="42" cy="134" rx="8" ry="6" fill={skin}/>
          <path d="M75,86 L70,130 L85,130 L87,86" fill={robe}/>
          <ellipse cx="77" cy="132" rx="8" ry="6" fill={skin}/>

          {/* Hands gripping knees */}
          <rect x="28" y="125" width="22" height="12" rx="5" fill={skin} opacity="0.9"/>
          <rect x="65" y="123" width="22" height="12" rx="5" fill={skin} opacity="0.9"/>

          {/* Legs */}
          <rect x="25" y="100" width="18" height="68" rx="8" fill={robe}/>
          <rect x="55" y="100" width="18" height="68" rx="8" fill={robe}/>

          {/* Feet */}
          <ellipse cx="34" cy="170" rx="12" ry="5" fill="#2a1a0a" opacity="0.8"/>
          <ellipse cx="64" cy="170" rx="12" ry="5" fill="#2a1a0a" opacity="0.8"/>

          {/* Angle guide dashed line */}
          <line x1="20" y1="92" x2="130" y2="84" stroke={gold} strokeWidth="1" strokeDasharray="4,3" opacity="0.3"/>
        </g>

        {/* Ruku label */}
        <text x="80" y="15" textAnchor="middle" fontSize="11" fill={gold} fontFamily="serif" opacity="0.8" style={{animation: anim('pulse_glow','2.5s')}}>رُكُوع</text>
      </g>
    ),

    // ── SUJOOD - PROSTRATION ─────────────────────────────────
    sujood: (
      <g transform="translate(20,20)">
        <ellipse cx="105" cy="175" rx="90" ry="8" fill="rgba(0,0,0,0.3)"/>
        {/* Prayer mat */}
        <rect x="10" y="158" width="190" height="16" rx="4" fill="#1a4a2a" opacity="0.7"/>
        <line x1="10" y1="162" x2="200" y2="162" stroke={gold} strokeWidth="0.6" opacity="0.5"/>
        <line x1="10" y1="170" x2="200" y2="170" stroke={gold} strokeWidth="0.6" opacity="0.5"/>
        {/* Mihrab design on mat */}
        <path d="M90,158 L105,148 L120,158" fill="none" stroke={gold} strokeWidth="1" opacity="0.4"/>

        <g style={{animation: anim('breathe','4s')}}>
          {/* Head on ground */}
          <circle cx="175" cy="138" r="20" fill={skin}/>
          <ellipse cx="0" cy="10" rx="17" ry="7" fill={gold} opacity="0.85" transform="translate(175,128)"/>
          <path d="M-8,8 Q0,14 8,8 Q4,18 0,20 Q-4,18 -8,8" fill="#2a1a0a" opacity="0.5" transform="translate(175,128)"/>
          {/* Forehead/Nose touching ground */}
          <ellipse cx="190" cy="157" rx="12" ry="5" fill={skin} opacity="0.6"/>
          {/* Glow at sujood point */}
          <ellipse cx="190" cy="157" rx="16" ry="7" fill={gold} opacity="0.08" style={{animation: anim('pulse_glow','2s')}}/>

          {/* Body angled */}
          <path d="M60,108 L168,125 L168,145 L60,130 Z" fill={robe}/>
          <path d="M60,108 L168,125 L168,133 L60,117 Z" fill={robeDark} opacity="0.4"/>

          {/* Arms on ground - outstretched */}
          <path d="M130,140 L170,155 L175,148 L138,132" fill={robe}/>
          <path d="M80,135  L120,150 L125,143 L88,128" fill={robe}/>
          <ellipse cx="172" cy="153" rx="9" ry="5" fill={skin}/>
          <ellipse cx="122" cy="148" rx="9" ry="5" fill={skin}/>

          {/* Legs folded */}
          <path d="M20,118 L62,108 L62,130 L20,140 Z" fill={robe}/>
          <path d="M15,138 L25,118 L38,118 L28,138" fill={robe}/>
          <path d="M42,138 L52,118 L65,118 L55,138" fill={robe}/>

          {/* Feet up */}
          <ellipse cx="22" cy="143" rx="10" ry="5" fill="#2a1a0a" opacity="0.8" transform="rotate(-20,22,143)"/>
          <ellipse cx="52" cy="143" rx="10" ry="5" fill="#2a1a0a" opacity="0.8" transform="rotate(-20,52,143)"/>
        </g>

        {/* 7 points label */}
        <text x="105" y="12" textAnchor="middle" fontSize="10" fill={gold} opacity="0.7" style={{animation: anim('pulse_glow','3s')}}>7 body parts on ground</text>
        <text x="105" y="25" textAnchor="middle" fontSize="11" fill={gold} fontFamily="serif" opacity="0.8">سُجُود</text>
      </g>
    ),

    // ── JALSA - SITTING ──────────────────────────────────────
    jalsa: (
      <g transform="translate(75,15)">
        <ellipse cx="40" cy="178" rx="50" ry="7" fill="rgba(0,0,0,0.25)"/>
        <rect x="-15" y="168" width="105" height="14" rx="3" fill="#1a4a2a" opacity="0.6"/>
        <line x1="-15" y1="172" x2="90"  y2="172" stroke={gold} strokeWidth="0.5" opacity="0.4"/>

        <g style={{animation: anim('breathe','3s')}}>
          {/* Torso */}
          <path d="M20,55 L15,130 L65,130 L60,55 Z" fill={robe}/>
          <path d="M20,55 L15,130 L40,125 L65,130 L60,55 Z" fill={robeDark} opacity="0.3"/>
          <path d="M30,55 L40,63 L50,55" fill="none" stroke={gold} strokeWidth="1.5" opacity="0.7"/>

          {/* Left arm on knee */}
          <path d="M18,70 L0,115 L14,118 L28,72" fill={robe}/>
          <ellipse cx="7" cy="120" rx="8" ry="6" fill={skin}/>

          {/* Right arm on knee */}
          <path d="M62,70 L80,115 L66,118 L52,72" fill={robe}/>
          <ellipse cx="73" cy="120" rx="8" ry="6" fill={skin}/>

          {/* Left leg folded flat */}
          <path d="M15,128 L-12,128 L-12,145 L68,150 L65,130" fill={robe}/>
          {/* Right leg folded up */}
          <path d="M65,128 L90,125 L92,155 L70,158 L65,130" fill={robe}/>

          {/* Feet */}
          <ellipse cx="-5"  cy="148" rx="12" ry="5" fill="#2a1a0a" opacity="0.8"/>
          <ellipse cx="82"  cy="157" rx="10" ry="5" fill="#2a1a0a" opacity="0.8" transform="rotate(-15,82,157)"/>
        </g>

        <rect x="35" y="44" width="10" height="16" rx="4" fill={skin}/>
        <g style={{animation: anim('breathe','4s','0.5s')}}>
          <circle cx="40" cy="26" r="22" fill={skin}/>
          <circle cx="33" cy="22" r="3" fill="#3a2010" opacity="0.8"/>
          <circle cx="47" cy="22" r="3" fill="#3a2010" opacity="0.8"/>
          <path d="M35,32 Q40,36 45,32" fill="none" stroke="#3a2010" strokeWidth="1.5" opacity="0.6"/>
          <ellipse cx="40" cy="8"  rx="19" ry="8" fill={gold} opacity="0.85"/>
          <rect x="21"  y="6"  width="38" height="5" rx="2" fill={gold} opacity="0.7"/>
          <path d="M30,38 Q40,48 50,38 Q45,52 40,54 Q35,52 30,38" fill="#2a1a0a" opacity="0.5"/>
        </g>

        <text x="40" y="-5" textAnchor="middle" fontSize="11" fill={gold} fontFamily="serif" opacity="0.8" style={{animation: anim('pulse_glow','3s')}}>جَلْسَة</text>
      </g>
    ),

    // ── TASHAHHUD - FINAL SITTING ────────────────────────────
    tashahhud: (
      <g transform="translate(75,15)">
        <ellipse cx="40" cy="178" rx="50" ry="7" fill="rgba(0,0,0,0.25)"/>
        <rect x="-15" y="168" width="105" height="14" rx="3" fill="#1a4a2a" opacity="0.6"/>
        <line x1="-15" y1="172" x2="90" y2="172" stroke={gold} strokeWidth="0.5" opacity="0.4"/>

        <g style={{animation: anim('breathe','3.5s')}}>
          <path d="M20,55 L15,130 L65,130 L60,55 Z" fill={robe}/>
          <path d="M20,55 L15,130 L40,125 L65,130 L60,55 Z" fill={robeDark} opacity="0.3"/>
          <path d="M30,55 L40,63 L50,55" fill="none" stroke={gold} strokeWidth="1.5" opacity="0.7"/>

          {/* Left hand on left knee */}
          <path d="M18,70 L0,115 L14,118 L28,72" fill={robe}/>
          <ellipse cx="7" cy="120" rx="8" ry="6" fill={skin}/>

          {/* Right arm */}
          <path d="M62,70 L75,112 L62,116 L52,72" fill={robe}/>
          {/* Right hand with INDEX FINGER RAISED! */}
          <ellipse cx="71" cy="118" rx="7" ry="5" fill={skin}/>
          <g style={{transformOrigin:'71px 110px', animation: anim('fingerPoint','2s')}}>
            <rect x="68" y="88" width="7" height="30" rx="3.5" fill={skin}/>
            <ellipse cx="71" cy="86" rx="5" ry="5" fill={skin}/>
            {/* Finger glow */}
            <ellipse cx="71" cy="82" rx="7" ry="7" fill={gold} opacity="0.15" style={{animation: anim('pulse_glow','1.5s')}}/>
          </g>

          <path d="M15,128 L-12,128 L-12,145 L68,150 L65,130" fill={robe}/>
          <path d="M65,128 L90,125 L92,155 L70,158 L65,130" fill={robe}/>
          <ellipse cx="-5" cy="148" rx="12" ry="5" fill="#2a1a0a" opacity="0.8"/>
          <ellipse cx="82" cy="157" rx="10" ry="5" fill="#2a1a0a" opacity="0.8" transform="rotate(-15,82,157)"/>
        </g>

        <rect x="35" y="44" width="10" height="16" rx="4" fill={skin}/>
        <g>
          <circle cx="40" cy="26" r="22" fill={skin}/>
          <circle cx="33" cy="22" r="3" fill="#3a2010" opacity="0.8"/>
          <circle cx="47" cy="22" r="3" fill="#3a2010" opacity="0.8"/>
          <path d="M35,32 Q40,36 45,32" fill="none" stroke="#3a2010" strokeWidth="1.5" opacity="0.6"/>
          <ellipse cx="40" cy="8"  rx="19" ry="8" fill={gold} opacity="0.85"/>
          <rect x="21"  y="6"  width="38" height="5" rx="2" fill={gold} opacity="0.7"/>
          <path d="M30,38 Q40,48 50,38 Q45,52 40,54 Q35,52 30,38" fill="#2a1a0a" opacity="0.5"/>
        </g>

        <text x="40" y="-5" textAnchor="middle" fontSize="10" fill={gold} opacity="0.7" style={{animation: anim('pulse_glow','2s')}}>Index finger raised</text>
        <circle cx="40" cy="26" r="28" fill="none" stroke={gold} strokeWidth="1" opacity="0.15" style={{animation: anim('pulse_glow','3s')}}/>
      </g>
    ),

    // ── SALAAM - HEAD TURN ───────────────────────────────────
    salaam: (
      <g transform="translate(75,15)">
        <ellipse cx="40" cy="178" rx="50" ry="7" fill="rgba(0,0,0,0.25)"/>
        <rect x="-15" y="168" width="105" height="14" rx="3" fill="#1a4a2a" opacity="0.6"/>

        <g>
          <path d="M20,55 L15,130 L65,130 L60,55 Z" fill={robe}/>
          <path d="M18,70 L0,115 L14,118 L28,72" fill={robe}/>
          <ellipse cx="7" cy="120" rx="8" ry="6" fill={skin}/>
          <path d="M62,70 L80,115 L66,118 L52,72" fill={robe}/>
          <ellipse cx="73" cy="120" rx="8" ry="6" fill={skin}/>
          <path d="M15,128 L-12,128 L-12,145 L68,150 L65,130" fill={robe}/>
          <path d="M65,128 L90,125 L92,155 L70,158 L65,130" fill={robe}/>
          <ellipse cx="-5" cy="148" rx="12" ry="5" fill="#2a1a0a" opacity="0.8"/>
          <ellipse cx="82" cy="157" rx="10" ry="5" fill="#2a1a0a" opacity="0.8" transform="rotate(-15,82,157)"/>
        </g>

        <rect x="35" y="44" width="10" height="16" rx="4" fill={skin}/>

        {/* HEAD TURNING ANIMATION */}
        <g style={{transformOrigin:'40px 26px', animation: anim('headTurn','4s','0s','none')}}>
          <circle cx="40" cy="26" r="22" fill={skin}/>
          <circle cx="33" cy="22" r="3" fill="#3a2010" opacity="0.8"/>
          <circle cx="47" cy="22" r="3" fill="#3a2010" opacity="0.8"/>
          <path d="M35,32 Q40,37 45,32" fill="none" stroke="#3a2010" strokeWidth="1.5" opacity="0.7"/>
          <ellipse cx="40" cy="8"  rx="19" ry="8" fill={gold} opacity="0.85"/>
          <rect x="21"  y="6"  width="38" height="5" rx="2" fill={gold} opacity="0.7"/>
          <path d="M30,38 Q40,48 50,38 Q45,52 40,54 Q35,52 30,38" fill="#2a1a0a" opacity="0.5"/>
        </g>

        {/* Direction arrows */}
        <path d="M-20,50 L-5,45 L-5,55 Z" fill={gold} opacity="0.4" style={{animation: anim('pulse_glow','2s')}}/>
        <path d="M100,50 L85,45 L85,55 Z" fill={gold} opacity="0.4" style={{animation: anim('pulse_glow','2s','0.5s')}}/>
        <text x="-28" y="38" fontSize="8" fill={gold} opacity="0.6">Right</text>
        <text x="82"  y="38" fontSize="8" fill={gold} opacity="0.6">Left</text>
        <text x="40"  y="-5" textAnchor="middle" fontSize="11" fill={gold} fontFamily="serif" opacity="0.8" style={{animation: anim('pulse_glow','2s')}}>السَّلَامُ عَلَيْكُمْ</text>
      </g>
    ),

    // ── ITIDAL - RISING ──────────────────────────────────────
    itidal: (
      <g transform="translate(100,10)">
        <ellipse cx="0" cy="175" rx="28" ry="6" fill="rgba(0,0,0,0.25)"/>
        <rect x="-35" y="165" width="70" height="12" rx="3" fill="#1a4a2a" opacity="0.6"/>

        <g style={{animation: anim('float','2s')}}>
          <path d="M-18,55 L-22,160 L22,160 L18,55 Z" fill={robe}/>
          {/* Arms slightly out */}
          <path d="M-18,68 L-36,105 L-24,108 L-10,70" fill={robe}/>
          <ellipse cx="-31" cy="110" rx="7" ry="5" fill={skin}/>
          <path d="M18,68 L36,105 L24,108 L10,70" fill={robe}/>
          <ellipse cx="31" cy="110" rx="7" ry="5" fill={skin}/>
          <ellipse cx="-10" cy="162" rx="10" ry="5" fill="#2a1a0a" opacity="0.8"/>
          <ellipse cx="10"  cy="162" rx="10" ry="5" fill="#2a1a0a" opacity="0.8"/>
        </g>

        <rect x="-5" y="46" width="10" height="14" rx="4" fill={skin}/>
        <g style={{animation: anim('breathe','3s')}}>
          <circle cx="0" cy="28" r="22" fill={skin}/>
          <circle cx="-7" cy="24" r="3" fill="#3a2010" opacity="0.8"/>
          <circle cx="7"  cy="24" r="3" fill="#3a2010" opacity="0.8"/>
          <ellipse cx="0" cy="10" rx="19" ry="8" fill={gold} opacity="0.85"/>
          <rect x="-19" y="8" width="38" height="5" rx="2" fill={gold} opacity="0.7"/>
          <path d="M-8,8 Q0,14 8,8 Q4,18 0,20 Q-4,18 -8,8" fill="#2a1a0a" opacity="0.5" transform="translate(0,30)"/>
        </g>

        <text x="0" y="-5" textAnchor="middle" fontSize="9" fill={gold} opacity="0.7" style={{animation: anim('pulse_glow','2s')}}>Sami Allahu liman Hamidah</text>
      </g>
    ),
  };

  return (
    <div style={{ width: '100%', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <style>{CSS_ANIMATIONS}</style>
      <svg viewBox="0 0 220 200" style={{ width: '100%', maxWidth: 280, height: 220 }}>
        {/* Background glow */}
        <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={color} stopOpacity="0.08"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </radialGradient>
        <ellipse cx="110" cy="100" rx="100" ry="90" fill="url(#bgGlow)"/>
        {figures[pose] || figures.qiyam}
      </svg>
    </div>
  );
};

// ── Steps data ─────────────────────────────────────────────────
const STEPS = [
  { id:'niyyah',    num:1, title:'Niyyah (Intention)',        arabic:'نِيَّة',             transliteration:'Niyyah',           pose:'qiyam',    color:'#1B6B3A',
    description:'Make a sincere intention in your heart to pray for the sake of Allah alone. Face the Qibla direction. Stand upright on a clean surface with full Wudu.',
    dua:'Make intention in your heart:\n"I intend to pray [prayer name] [number] Rakats, Fard/Sunnah, for Allah."',
    tips:['Face the Qibla (Makkah direction)','Ensure you have valid Wudu','Stand on a clean prayer mat','Intention is in the heart only'],
    audio:'Stand straight facing the Qibla with a sincere intention in your heart to pray for Allah alone.' },

  { id:'takbir',    num:2, title:'Takbir-ul-Ihram',           arabic:'اللَّهُ أَكْبَرُ',   transliteration:'Allahu Akbar',     pose:'takbir',   color:'#D4AF37',
    description:'Raise both hands up to the earlobes with palms facing the Qibla and thumbs near the earlobes. Say "Allahu Akbar" — this officially begins your prayer!',
    dua:'اللَّهُ أَكْبَرُ\n"Allahu Akbar"\n(Allah is the Greatest)',
    tips:['Raise both hands simultaneously','Thumbs near earlobes','Palms facing forward','Say clearly: Allahu Akbar','Prayer begins NOW'],
    audio:'Raise both hands to your earlobes, palms facing forward, and say Allahu Akbar. This begins the prayer.' },

  { id:'qiyam',     num:3, title:'Qiyam (Standing & Reciting)', arabic:'قِيَام',           transliteration:'Qiyam',           pose:'qiyam',    color:'#1B6B3A',
    description:'Fold right hand over left on your chest. Look at the place of Sujood. Recite Thana quietly, then Surah Al-Fatiha, then another Surah from the Quran.',
    dua:'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ...\n(Thana — Opening supplication)\n\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nاَلْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ...\n(Surah Al-Fatiha)',
    tips:['Right hand over left on chest','Eyes looking at Sujood spot','Recite Fatiha in every Rakat','Add another Surah in first 2 rakats','Recite aloud in Fajr/Maghrib/Isha'],
    audio:'Place your right hand over your left on your chest. Recite Thana, then Surah Al-Fatiha, then another Surah.' },

  { id:'ruku',      num:4, title:'Ruku (Bowing)',              arabic:'رُكُوع',             transliteration:'Ruku',             pose:'ruku',     color:'#8E44AD',
    description:'Say "Allahu Akbar" while bowing. Place hands firmly on knees. Back must be straight and parallel to the ground. Head level with back. Recite Tasbeeh 3 times.',
    dua:'سُبْحَانَ رَبِّيَ الْعَظِيمِ\n"Subhana Rabbiyal Adheem"\n(Glory be to my Lord the Magnificent)\n— Recite minimum 3 times',
    tips:['Back perfectly horizontal','Hands gripping knees firmly','Head level with back','Elbows slightly bent','Recite Tasbeeh 3 times minimum'],
    audio:'Bow down placing hands firmly on knees, keeping your back straight and parallel to the ground. Say Subhana Rabbiyal Adheem three times.' },

  { id:'itidal',    num:5, title:"I'tidal (Rising from Ruku)", arabic:'اعْتِدَال',          transliteration:"I'tidal",          pose:'itidal',   color:'#148F77',
    description:'Rise from Ruku saying "Sami Allahu liman Hamidah". Stand completely upright. Then say "Rabbana lakal Hamd". Pause briefly before going to Sujood.',
    dua:'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ\n"Sami Allahu liman Hamidah"\n(While rising)\n\nرَبَّنَا وَلَكَ الْحَمْدُ\n"Rabbana lakal Hamd"\n(While standing)',
    tips:['Say Tasmee while rising','Stand completely upright','Brief pause in this position','Then say Tahmid','Proceed to Sujood'],
    audio:'Rise from bowing saying Sami Allahu liman Hamidah, then stand fully straight and say Rabbana lakal Hamd.' },

  { id:'sujood',    num:6, title:'Sujood (Prostration)',       arabic:'سُجُود',             transliteration:'Sujood',           pose:'sujood',   color:'#D35400',
    description:'Say "Allahu Akbar" going down. Place forehead, nose, both palms, knees, and toes on the ground — 7 points total! This is the closest position to Allah SWT!',
    dua:'سُبْحَانَ رَبِّيَ الْأَعْلَى\n"Subhana Rabbiyal Ala"\n(Glory be to my Lord the Most High)\n— Recite minimum 3 times\n\n💚 Make any dua here — this is special!',
    tips:['ALL 7 parts must touch ground','Forehead AND nose on ground','Elbows raised off ground','Fingers together pointing to Qibla','You are CLOSEST to Allah here!','Make personal duas in Sujood'],
    audio:'Prostrate with your forehead, nose, both palms, knees and toes touching the ground. Say Subhana Rabbiyal Ala three times. This is the closest you are to Allah.' },

  { id:'jalsa',     num:7, title:'Jalsa (Sitting Between Sujoods)', arabic:'جَلْسَة',      transliteration:'Jalsa',            pose:'jalsa',    color:'#1A5276',
    description:'Rise from first Sujood saying "Allahu Akbar". Sit on left foot (flat), right foot upright. Place hands on thighs. Say the dua, then do the second Sujood.',
    dua:'رَبِّ اغْفِرْ لِي وَارْحَمْنِي\n"Rabbighfirli warhamni"\n(My Lord forgive me and have mercy on me)\n— Recite 1-3 times',
    tips:['Sit on left foot (flat)','Right foot upright with toes pointing to Qibla','Hands resting on thighs','Ask for forgiveness here','Then do second Sujood'],
    audio:'Sit upright between the two prostrations, left foot flat, right foot upright. Say Rabbighfirli, then perform the second prostration.' },

  { id:'tashahhud', num:8, title:'Tashahhud (Final Sitting)',  arabic:'تَشَهُّد',           transliteration:'Tashahhud',        pose:'tashahhud',color:'#B7950B',
    description:'After the final Sujood, sit for Tashahhud. Raise the index finger of the right hand during "La ilaha illallah". Recite Tashahhud then Durood Ibrahim then Dua.',
    dua:'اَلتَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ...\n(At-Tahiyyatu — full recitation)\n\nاللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ...\n(Durood Ibrahim)\n\nرَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً...\n(Dua Masura)',
    tips:['Sit like Jalsa position','Right index finger raised','Point finger at La ilaha illallah','Recite all 3 parts','Make personal dua before salaam'],
    audio:'Sit for the final tashahhud, raise your right index finger and recite At-Tahiyyatu, then Durood Ibrahim, then Dua Masura.' },

  { id:'salaam',    num:9, title:'Salaam (Completing Prayer)', arabic:'اَلسَّلَامُ عَلَيْكُمْ', transliteration:'As-Salamu Alaykum', pose:'salaam', color:'#1B6B3A',
    description:'Turn your head to the RIGHT saying the Salaam. Then turn your head to the LEFT saying the Salaam again. Your prayer is now complete. Alhamdulillah! 🌟',
    dua:'اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ\n"Assalamu Alaykum wa Rahmatullah"\n(Peace and mercy of Allah be upon you)\n\nTurn RIGHT first, then LEFT\n\n✅ Prayer is COMPLETE!',
    tips:['Turn head RIGHT first','Then turn head LEFT','Say Salaam both sides','Angels record your deeds','Make dua after Salaam','Recite morning/evening adhkar'],
    audio:'Turn your head to the right saying Assalamu Alaykum wa Rahmatullah, then turn left saying the same. Your prayer is complete. Alhamdulillah!' },
];

export default function Namaz() {
  const [screen, setScreen]     = useState('home');
  const [step, setStep]         = useState(0);
  const [animated, setAnimated] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoRef                 = useRef(null);
  const cur                     = STEPS[step];

  useEffect(() => {
    if (!autoPlay) { clearInterval(autoRef.current); return; }
    autoRef.current = setInterval(() => {
      setStep(s => { if (s < STEPS.length-1) return s+1; setAutoPlay(false); return s; });
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

  // HOME
  if (screen === 'home') return (
    <div style={{ padding:'24px 28px', maxWidth:860, margin:'0 auto' }}>
      <style>{CSS_ANIMATIONS}</style>
      <div style={{ background:'linear-gradient(135deg,#0f3d22,#1B6B3A)', borderRadius:22, padding:'30px', marginBottom:24, textAlign:'center', border:'1px solid rgba(212,175,55,0.2)' }}>
        <div style={{ fontSize:52, marginBottom:10 }}>🕌</div>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:6 }}>Namaz Guide</h1>
        <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:22 }}>Animated step-by-step prayer guide with beautiful figures</p>
        <button onClick={() => { setStep(0); setScreen('guide'); }} style={{ background:'linear-gradient(135deg,#D4AF37,#f5d060)', color:'#0a1a0f', border:'none', borderRadius:50, padding:'13px 38px', fontSize:15, fontWeight:800, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:8 }}>
          <Play size={16}/> Start Animated Guide
        </button>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:24, flexWrap:'wrap' }}>
        {PRAYERS.map(p => (
          <div key={p.name} style={{ flex:'1 1 140px', background:'var(--dark-card)', border:`1px solid ${p.color}33`, borderRadius:14, padding:'14px', textAlign:'center', borderTop:`3px solid ${p.color}` }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{p.icon}</div>
            <div style={{ fontSize:13, fontWeight:700 }}>{p.name}</div>
            <div style={{ fontSize:10, color:p.color, marginTop:4 }}>{p.rakats}</div>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize:16, fontWeight:700, marginBottom:14 }}>9 Steps of Prayer</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))', gap:10 }}>
        {STEPS.map((s,i) => (
          <button key={i} onClick={() => { setStep(i); setScreen('guide'); }} style={{ background:'var(--dark-card)', border:`1px solid ${s.color}22`, borderRadius:14, padding:'14px', cursor:'pointer', textAlign:'left', borderLeft:`3px solid ${s.color}`, transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.background=`${s.color}12`; }}
            onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background='var(--dark-card)'; }}
          >
            <div style={{ width:28, height:28, background:`${s.color}22`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:s.color, marginBottom:8 }}>{i+1}</div>
            <div style={{ fontSize:12, fontWeight:700, color:'white', marginBottom:3 }}>{s.title}</div>
            <div className="arabic" style={{ fontSize:13, color:s.color }}>{s.arabic}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // GUIDE
  return (
    <div style={{ maxWidth:820, margin:'0 auto', padding:'20px 24px' }}>
      <style>{CSS_ANIMATIONS}</style>

      {/* Top bar */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
        <button onClick={() => { window.speechSynthesis.cancel(); setScreen('home'); setAutoPlay(false); }} style={{ background:'none', border:'none', cursor:'pointer', color:'#4a6355', fontSize:13, display:'flex', alignItems:'center', gap:5 }}>
          <ChevronLeft size={16}/> All Steps
        </button>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => setAnimated(!animated)} style={{ background: animated ? 'rgba(46,139,87,0.2)' : 'rgba(255,255,255,0.06)', border:`1px solid ${animated ? 'rgba(46,139,87,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius:8, padding:'5px 12px', cursor:'pointer', color: animated ? '#3aad6e' : '#7a9585', fontSize:11 }}>
            {animated ? '✨ Animated' : '⏸ Static'}
          </button>
          <button onClick={() => setAutoPlay(!autoPlay)} style={{ background: autoPlay ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)', border:`1px solid ${autoPlay ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)'}`, borderRadius:8, padding:'5px 12px', cursor:'pointer', color: autoPlay ? '#D4AF37' : '#7a9585', fontSize:11 }}>
            {autoPlay ? '⏸ Pause Auto' : '▶ Auto Play'}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div style={{ display:'flex', gap:5, justifyContent:'center', marginBottom:18, flexWrap:'wrap' }}>
        {STEPS.map((s,i) => (
          <button key={i} onClick={() => goTo(i)} title={s.title} style={{ width: step===i ? 32 : 10, height:10, borderRadius:5, background: i<step ? '#2E8B57' : step===i ? s.color : 'rgba(255,255,255,0.1)', border:'none', cursor:'pointer', transition:'all 0.3s', padding:0 }}/>
        ))}
      </div>

      {/* Main card */}
      <div style={{ background:`linear-gradient(135deg,${cur.color}18,rgba(8,15,10,0.95))`, border:`1px solid ${cur.color}44`, borderRadius:22, overflow:'hidden', marginBottom:16, boxShadow:`0 8px 32px ${cur.color}22` }}>
        {/* Header */}
        <div style={{ background:`linear-gradient(135deg,${cur.color}dd,${cur.color}88)`, padding:'16px 22px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.6)', marginBottom:2 }}>Step {cur.num} of {STEPS.length}</div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'white', marginBottom:2 }}>{cur.title}</h2>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.7)' }}>{cur.transliteration}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div className="arabic" style={{ fontSize:26, color:'#f5d060', fontWeight:700 }}>{cur.arabic}</div>
            <button onClick={speakStep} style={{ marginTop:6, background:'rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:8, padding:'5px 12px', cursor:'pointer', color:'white', fontSize:11, display:'flex', alignItems:'center', gap:5, marginLeft:'auto' }}>
              {speaking ? <><Pause size={11}/> Stop</> : <><Volume2 size={11}/> Listen</>}
            </button>
          </div>
        </div>

        {/* Figure + Info */}
        <div style={{ display:'flex', flexWrap:'wrap' }}>
          {/* Animated figure */}
          <div style={{ flex:'0 0 280px', background:`radial-gradient(ellipse at center, ${cur.color}18 0%, transparent 70%)`, display:'flex', alignItems:'center', justifyContent:'center', minHeight:240, borderRight:`1px solid ${cur.color}22`, padding:'10px' }}>
            <PrayerFigure pose={cur.pose} color={cur.color} animated={animated}/>
          </div>

          {/* Description + Tips */}
          <div style={{ flex:1, padding:'20px 22px', minWidth:200 }}>
            <p style={{ fontSize:13, color:'#c0d4c8', lineHeight:1.85, marginBottom:16 }}>{cur.description}</p>
            <div>
              {cur.tips.map((tip,i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:7 }}>
                  <div style={{ width:18, height:18, background:`${cur.color}22`, borderRadius:5, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:cur.color, fontWeight:700, flexShrink:0, marginTop:1 }}>✓</div>
                  <span style={{ fontSize:12, color:'#7a9585', lineHeight:1.5 }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dua box */}
        <div style={{ margin:'0 18px 18px', background:'rgba(212,175,55,0.08)', border:'1px solid rgba(212,175,55,0.25)', borderRadius:14, padding:'14px 18px' }}>
          <div style={{ fontSize:11, color:'#D4AF37', fontWeight:700, marginBottom:8 }}>📿 Dua / Recitation</div>
          <div className="arabic" style={{ fontSize:16, color:'#f5d060', lineHeight:2.2, marginBottom:6, whiteSpace:'pre-line' }}>
            {cur.dua.split('\n')[0]}
          </div>
          <div style={{ fontSize:12, color:'#7a9585', lineHeight:1.8, whiteSpace:'pre-line' }}>
            {cur.dua.split('\n').slice(1).join('\n')}
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:14 }}>
        <button onClick={() => goTo(Math.max(0,step-1))} disabled={step===0} style={{ background:'var(--dark-card)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'11px 18px', cursor: step===0 ? 'not-allowed' : 'pointer', color: step===0 ? '#2a3a2f' : '#c0d4c8', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
          <ChevronLeft size={15}/> Prev
        </button>
        <div style={{ flex:1, textAlign:'center', fontSize:12, color:'#4a6355' }}>{step+1}/{STEPS.length} · {cur.title}</div>
        {step < STEPS.length-1 ? (
          <button onClick={() => goTo(step+1)} style={{ background:`linear-gradient(135deg,${cur.color},${cur.color}88)`, border:'none', borderRadius:12, padding:'11px 18px', cursor:'pointer', color:'white', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
            Next <ChevronRight size={15}/>
          </button>
        ) : (
          <button onClick={() => { setStep(0); setScreen('home'); }} style={{ background:'linear-gradient(135deg,#D4AF37,#f5d060)', border:'none', borderRadius:12, padding:'11px 18px', cursor:'pointer', color:'#0a1a0f', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
            <RotateCcw size={14}/> Restart
          </button>
        )}
      </div>

      {/* Step strip */}
      <div style={{ display:'flex', gap:7, overflowX:'auto', paddingBottom:4 }}>
        {STEPS.map((s,i) => (
          <button key={i} onClick={() => goTo(i)} style={{ flex:'0 0 auto', background: step===i ? `${s.color}22` : 'var(--dark-card)', border:`1px solid ${step===i ? s.color+'55' : 'rgba(255,255,255,0.06)'}`, borderRadius:10, padding:'7px 10px', cursor:'pointer', textAlign:'center', minWidth:68, transition:'all 0.2s' }}>
            <div style={{ fontSize:10, fontWeight:700, color: step===i ? s.color : '#4a6355', marginBottom:1 }}>{i+1}</div>
            <div style={{ fontSize:9, color: step===i ? 'white' : '#4a6355', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:62 }}>{s.title.split(' ')[0]}</div>
            <div className="arabic" style={{ fontSize:10, color: step===i ? '#D4AF37' : '#2a3a2f', marginTop:1 }}>{s.arabic.split(' ')[0]}</div>
          </button>
        ))}
      </div>
    </div>
  );
}