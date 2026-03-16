/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Clock, ChevronRight, RotateCcw, Star, Home, Zap, Target, Award, Loader, Sparkles } from 'lucide-react';
import { CATEGORIES, QUESTIONS } from '../data/mcqData';
import { getDailyQuestions, clearOldCache } from '../services/mcqApi';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const today = () => new Date().toISOString().split('T')[0];

export default function MCQ() {
  const [screen, setScreen]           = useState('home');
  const [selectedCat, setSelectedCat] = useState(null);
  const [questions, setQuestions]     = useState([]);
  const [current, setCurrent]         = useState(0);
  const [selected, setSelected]       = useState(null);
  const [answered, setAnswered]       = useState([]);
  const [score, setScore]             = useState(0);
  const [timer, setTimer]             = useState(30);
  const [loadingAI, setLoadingAI]     = useState(false);
  const [aiError, setAiError]         = useState(null);
  const [quizMode, setQuizMode]       = useState('ai'); // 'ai' | 'static'
  const [dailyStatus, setDailyStatus] = useState({}); // {catId: 'cached'|'fresh'|null}
  const [scores, setScores]           = useState(() => {
    try { return JSON.parse(localStorage.getItem('mcq_scores') || '{}'); } catch { return {}; }
  });
  const timerRef = useRef(null);

  useEffect(() => { clearOldCache(); checkCacheStatus(); }, []);

  const checkCacheStatus = () => {
    const status = {};
    CATEGORIES.forEach(cat => {
      const key = `mcq_daily_${cat.id}_${today()}`;
      try {
        const cached = localStorage.getItem(key);
        status[cat.id] = cached ? 'cached' : null;
      } catch { status[cat.id] = null; }
    });
    setDailyStatus(status);
  };

  // Timer
  useEffect(() => {
    if (screen !== 'quiz') return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { handleNext(true); return 30; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, screen]);

  const startQuiz = async (cat, mode = 'ai') => {
    setSelectedCat(cat);
    setQuizMode(mode);
    setAiError(null);

    if (mode === 'ai') {
      setLoadingAI(true);
      try {
        const aiQs = await getDailyQuestions(cat);
        setQuestions(shuffle(aiQs).slice(0, 10));
        setDailyStatus(prev => ({ ...prev, [cat.id]: 'cached' }));
      } catch (e) {
        setAiError(e.message || 'Failed to generate AI questions');
        // Fallback to static questions
        const staticQs = shuffle(QUESTIONS[cat.id] || []).slice(0, 10);
        setQuestions(staticQs);
        setQuizMode('static');
      } finally {
        setLoadingAI(false);
      }
    } else {
      const staticQs = shuffle(QUESTIONS[cat.id] || []).slice(0, 10);
      setQuestions(staticQs);
    }

    setCurrent(0); setSelected(null);
    setAnswered([]); setScore(0); setTimer(30);
    setScreen('quiz');
  };

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === questions[current].answer;
    if (correct) setScore(s => s + 1);
    setAnswered(prev => [...prev, { selected: idx, correct, time: 30 - timer }]);
    clearInterval(timerRef.current);
  };

  const handleNext = (timeout = false) => {
    if (timeout && selected === null) {
      setAnswered(prev => [...prev, { selected: -1, correct: false, time: 30 }]);
    }
    if (current < questions.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setTimer(30);
    } else {
      const finalScore = answered.filter(a => a.correct).length + (selected === questions[current]?.answer ? 1 : 0);
      const best = scores[selectedCat.id] || 0;
      const updated = { ...scores, [selectedCat.id]: Math.max(best, finalScore) };
      setScores(updated);
      try { localStorage.setItem('mcq_scores', JSON.stringify(updated)); } catch {}
      setScreen('result');
      clearInterval(timerRef.current);
    }
  };

  const resetQuiz = () => {
    setScreen('home'); setSelectedCat(null);
    setQuestions([]); setCurrent(0); setSelected(null);
    setAnswered([]); setScore(0); setTimer(30);
    setAiError(null);
  };

  // ── LOADING SCREEN ────────────────────────────────────────────
  if (loadingAI) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div style={{ width: 70, height: 70, background: 'linear-gradient(135deg, #1B6B3A, #2E8B57)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'pulse 1.5s ease infinite' }}>
        <Sparkles size={32} color="#D4AF37" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>🤖 AI is generating questions...</h2>
        <p style={{ fontSize: 13, color: '#4a6355' }}>Creating fresh {selectedCat?.name} questions just for you!</p>
      </div>
      <Loader size={22} color="#2E8B57" style={{ animation: 'spin 1s linear infinite' }} />
      <p style={{ fontSize: 11, color: '#2a3a2f' }}>Powered by Groq AI · Takes ~5 seconds</p>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── HOME ──────────────────────────────────────────────────────
  if (screen === 'home') return (
    <div style={{ padding: '24px 28px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 44, marginBottom: 8 }}>📝</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Islamic MCQ Quiz</h1>
        <p style={{ fontSize: 12, color: '#4a6355' }}>8 categories · AI-generated daily questions · 30 sec per Q</p>

        {/* Daily AI badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 20, padding: '6px 14px', marginTop: 10 }}>
          <Sparkles size={13} color="#D4AF37" />
          <span style={{ fontSize: 11, color: '#D4AF37', fontWeight: 600 }}>🤖 Fresh AI questions generated daily by Groq</span>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, background: 'var(--dark-card)', border: '1px solid rgba(46,139,87,0.15)', borderRadius: 16, padding: '14px 18px' }}>
        {[
          { icon: <Trophy size={16} color="#D4AF37"/>,  label: 'Best Score',    value: Math.max(0, ...Object.values(scores), 0) + '/10' },
          { icon: <Target size={16} color="#3aad6e"/>,  label: 'Categories',    value: `${Object.keys(scores).length}/${CATEGORIES.length}` },
          { icon: <Zap size={16} color="#e74c3c"/>,     label: 'Cached Today',  value: Object.values(dailyStatus).filter(v => v === 'cached').length + '/' + CATEGORIES.length },
          { icon: <Award size={16} color="#8E44AD"/>,   label: 'Total Points',  value: Object.values(scores).reduce((a,b) => a+b, 0) * 100 },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 5 }}>{s.icon}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>{s.value}</div>
            <div style={{ fontSize: 9, color: '#4a6355' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 12, marginBottom: 24 }}>
        {CATEGORIES.map(cat => {
          const best      = scores[cat.id] || 0;
          const pct       = (best / 10) * 100;
          const stars     = best >= 9 ? 3 : best >= 7 ? 2 : best >= 5 ? 1 : 0;
          const isCached  = dailyStatus[cat.id] === 'cached';
          return (
            <div key={cat.id} style={{ background: 'var(--dark-card)', border: `1px solid ${cat.color}22`, borderRadius: 18, padding: '18px 16px', borderLeft: `4px solid ${cat.color}`, transition: 'all 0.25s', position: 'relative', overflow: 'hidden' }}>
              {/* AI daily badge */}
              {isCached && (
                <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 5, padding: '2px 6px', fontSize: 9, color: '#D4AF37', fontWeight: 600 }}>
                  ✓ AI Ready
                </div>
              )}

              <div style={{ fontSize: 26, marginBottom: 8 }}>{cat.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 2 }}>{cat.name}</div>
              <div className="arabic" style={{ fontSize: 12, color: cat.color, marginBottom: 6 }}>{cat.arabic}</div>

              {/* Progress */}
              <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginBottom: 6 }}>
                <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${cat.color}, ${cat.color}88)`, borderRadius: 2 }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[0,1,2].map(i => <Star key={i} size={11} color={i < stars ? '#D4AF37' : '#2a3a2f'} fill={i < stars ? '#D4AF37' : 'none'} />)}
                </div>
                {best > 0 && <span style={{ fontSize: 10, color: cat.color, fontWeight: 600 }}>Best: {best}/10</span>}
              </div>

              {/* Two buttons: AI Daily + Static */}
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => startQuiz(cat, 'ai')} style={{ flex: 1, background: `linear-gradient(135deg, ${cat.color}, ${cat.color}88)`, color: 'white', border: 'none', borderRadius: 9, padding: '8px 4px', cursor: 'pointer', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <Sparkles size={10}/> {isCached ? 'Today\'s AI' : 'AI Quiz'}
                </button>
                <button onClick={() => startQuiz(cat, 'static')} style={{ background: 'rgba(255,255,255,0.06)', color: '#7a9585', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 9, padding: '8px 8px', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Classic questions">
                  📚
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#4a6355' }}>
          <Sparkles size={12} color="#D4AF37"/> AI Quiz — Fresh daily questions from Groq
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#4a6355' }}>
          📚 Classic — Static question bank
        </div>
      </div>

      {/* Leaderboard */}
      {Object.keys(scores).length > 0 && (
        <div style={{ background: 'var(--dark-card)', border: '1px solid rgba(46,139,87,0.15)', borderRadius: 18, padding: '18px 20px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Trophy size={15} color="#D4AF37"/> Your Progress
          </h3>
          {CATEGORIES.filter(c => scores[c.id]).sort((a,b) => (scores[b.id]||0)-(scores[a.id]||0)).map((cat, i) => {
            const s = scores[cat.id] || 0;
            const stars = s >= 9 ? 3 : s >= 7 ? 2 : s >= 5 ? 1 : 0;
            return (
              <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid rgba(46,139,87,0.06)' }}>
                <span style={{ fontSize: 15 }}>{['🥇','🥈','🥉'][i] || `${i+1}.`}</span>
                <span>{cat.icon}</span>
                <span style={{ fontSize: 12, color: '#c0d4c8', flex: 1 }}>{cat.name}</span>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[0,1,2].map(si => <Star key={si} size={11} color={si < stars ? '#D4AF37' : '#2a3a2f'} fill={si < stars ? '#D4AF37' : 'none'} />)}
                </div>
                <span style={{ fontSize: 12, color: cat.color, fontWeight: 700, minWidth: 32, textAlign: 'right' }}>{s}/10</span>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── QUIZ ──────────────────────────────────────────────────────
  if (screen === 'quiz') {
    const q = questions[current];
    if (!q) return null;
    return (
      <div style={{ padding: '24px 28px', maxWidth: 680, margin: '0 auto' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={resetQuiz} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a6355', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
              <Home size={13}/> Home
            </button>
            <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: 12, color: selectedCat.color }}>{selectedCat.icon} {selectedCat.name}</span>
            {quizMode === 'ai' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 5, padding: '2px 7px', fontSize: 9, color: '#D4AF37' }}>
                <Sparkles size={9}/> AI Daily
              </div>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#4a6355' }}>{current+1}/{questions.length}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: timer <= 10 ? 'rgba(231,76,60,0.15)' : 'rgba(46,139,87,0.15)', border: `1px solid ${timer <= 10 ? 'rgba(231,76,60,0.3)' : 'rgba(46,139,87,0.3)'}`, borderRadius: 8, padding: '4px 10px' }}>
              <Clock size={12} color={timer <= 10 ? '#e74c3c' : '#3aad6e'} />
              <span style={{ fontSize: 13, fontWeight: 700, color: timer <= 10 ? '#e74c3c' : '#3aad6e', minWidth: 20 }}>{timer}</span>
            </div>
          </div>
        </div>

        {/* AI error notice */}
        {aiError && (
          <div style={{ background: 'rgba(231,76,60,0.08)', border: '1px solid rgba(231,76,60,0.2)', borderRadius: 10, padding: '8px 14px', marginBottom: 14, fontSize: 11, color: '#e74c3c' }}>
            ⚠️ AI failed, using classic questions. {aiError}
          </div>
        )}

        {/* Progress bar */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 20 }}>
          <div style={{ width: `${(current/questions.length)*100}%`, height: '100%', background: `linear-gradient(90deg, ${selectedCat.color}, ${selectedCat.color}88)`, borderRadius: 2, transition: 'width 0.4s' }} />
        </div>

        {/* Score */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <div style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 8, padding: '4px 12px', fontSize: 12, color: '#D4AF37', fontWeight: 600 }}>⭐ {score}/{current}</div>
        </div>

        {/* Question */}
        <div style={{ background: 'var(--dark-card)', border: `1px solid ${selectedCat.color}22`, borderRadius: 18, padding: '22px', marginBottom: 14, borderLeft: `4px solid ${selectedCat.color}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>{selectedCat.icon}</span>
            <span style={{ fontSize: 11, color: selectedCat.color, fontWeight: 600 }}>{selectedCat.name}</span>
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.6 }}>{q.q}</h2>
        </div>

        {/* Options */}
        {q.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect  = i === q.answer;
          const show       = selected !== null;
          let bg = 'var(--dark-card)', border = 'rgba(46,139,87,0.1)', color = '#c0d4c8';
          if (show) {
            if (isCorrect) { bg = 'rgba(46,139,87,0.2)'; border = 'rgba(46,139,87,0.5)'; color = '#3aad6e'; }
            else if (isSelected) { bg = 'rgba(231,76,60,0.2)'; border = 'rgba(231,76,60,0.5)'; color = '#e74c3c'; }
          }
          return (
            <button key={i} onClick={() => handleSelect(i)} style={{ width: '100%', padding: '13px 16px', marginBottom: 8, background: bg, border: `1px solid ${border}`, borderRadius: 12, cursor: show ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color, flexShrink: 0 }}>{String.fromCharCode(65+i)}</div>
                <span style={{ fontSize: 13, color, fontWeight: show && (isCorrect||isSelected) ? 600 : 400 }}>{opt}</span>
              </div>
              {show && isCorrect  && <span>✅</span>}
              {show && isSelected && !isCorrect && <span>❌</span>}
            </button>
          );
        })}

        {/* Explanation */}
        {selected !== null && (
          <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#D4AF37', fontWeight: 600, marginBottom: 4 }}>💡 Explanation</div>
            <div style={{ fontSize: 12, color: '#7a9585', lineHeight: 1.7 }}>{q.explanation}</div>
          </div>
        )}

        {selected !== null && (
          <button onClick={() => handleNext()} style={{ width: '100%', background: `linear-gradient(135deg, ${selectedCat.color}, ${selectedCat.color}88)`, color: 'white', border: 'none', padding: '13px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
            {current < questions.length-1 ? 'Next Question' : 'See Results'} <ChevronRight size={15}/>
          </button>
        )}
        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────
  if (screen === 'result') {
    const finalScore = answered.filter(a => a.correct).length;
    const pct        = Math.round((finalScore/questions.length)*100);
    const stars      = finalScore >= 9 ? 3 : finalScore >= 7 ? 2 : finalScore >= 5 ? 1 : 0;
    const msg        = finalScore === 10 ? 'Perfect! MashAllah! 🎉' : finalScore >= 8 ? 'Excellent! Alhamdulillah! 🌟' : finalScore >= 6 ? 'Good job! Keep learning! 💪' : 'Keep practicing! 🤲';

    return (
      <div style={{ padding: '24px 28px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 10 }}>{finalScore === 10 ? '🎉' : finalScore >= 7 ? '🌟' : '📚'}</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{msg}</h1>
        <p style={{ color: '#7a9585', marginBottom: 6 }}>{selectedCat.icon} {selectedCat.name}</p>
        {quizMode === 'ai' && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 14, padding: '4px 12px', marginBottom: 20, fontSize: 10, color: '#D4AF37' }}><Sparkles size={10}/> AI Generated Questions</div>}
        {quizMode === 'static' && <div style={{ marginBottom: 20 }} />}

        {/* Score card */}
        <div style={{ background: `linear-gradient(135deg, ${selectedCat.color}33, ${selectedCat.color}11)`, border: `1px solid ${selectedCat.color}44`, borderRadius: 20, padding: '24px', marginBottom: 18 }}>
          <div style={{ fontSize: 52, fontWeight: 800, color: 'white', marginBottom: 4 }}>{finalScore}<span style={{ fontSize: 24, color: '#7a9585' }}>/{questions.length}</span></div>
          <div style={{ fontSize: 13, color: selectedCat.color, marginBottom: 14, fontWeight: 600 }}>{pct}% Correct</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 14 }}>
            {[0,1,2].map(i => <Star key={i} size={22} color={i < stars ? '#D4AF37' : '#2a3a2f'} fill={i < stars ? '#D4AF37' : 'none'} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[['✅','Correct',finalScore],['❌','Wrong',questions.length-finalScore],['⏱️','Avg',Math.round(answered.reduce((a,b)=>a+b.time,0)/answered.length)+'s']].map(([icon,label,val]) => (
              <div key={label} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 10, padding: '10px 6px' }}>
                <div style={{ fontSize: 16 }}>{icon}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'white' }}>{val}</div>
                <div style={{ fontSize: 9, color: '#4a6355' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Review */}
        <div style={{ textAlign: 'left', marginBottom: 18 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#7a9585' }}>Review</h3>
          {answered.map((a, i) => (
            <div key={i} style={{ background: a.correct ? 'rgba(46,139,87,0.08)' : 'rgba(231,76,60,0.08)', border: `1px solid ${a.correct ? 'rgba(46,139,87,0.2)' : 'rgba(231,76,60,0.2)'}`, borderRadius: 10, padding: '10px 14px', marginBottom: 7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: a.correct ? '#3aad6e' : '#e74c3c' }}>{a.correct ? '✅' : '❌'} Q{i+1}</span>
                <span style={{ fontSize: 9, color: '#4a6355' }}>⏱ {a.time}s</span>
              </div>
              <div style={{ fontSize: 11, color: '#7a9585', lineHeight: 1.5 }}>{questions[i]?.explanation}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => startQuiz(selectedCat, quizMode)} style={{ flex: 1, background: `linear-gradient(135deg, ${selectedCat.color}, ${selectedCat.color}88)`, color: 'white', border: 'none', padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <RotateCcw size={14}/> Try Again
          </button>
          <button onClick={resetQuiz} style={{ flex: 1, background: 'var(--dark-card)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Home size={14}/> All Categories
          </button>
        </div>
      </div>
    );
  }
  return null;
}