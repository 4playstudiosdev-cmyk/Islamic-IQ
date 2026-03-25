/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Share2, Trash2, Bot, User, Loader } from 'lucide-react';

const GROQ_KEY  = process.env.REACT_APP_GROQ_KEY || '';
const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
  .cb-root { background:#030303; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; display:flex; flex-direction:column; height:100vh; }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { to{background-position:200% center} }
  @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes dots    { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
  .gold-shimmer { background:linear-gradient(100deg,#C9A84C,#E8C97A,#F5DFA0,#C9A84C); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shimmer 4s linear infinite; }
  .msg-user { background:linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.08)); border:1px solid rgba(201,168,76,0.2); border-radius:18px 18px 4px 18px; }
  .msg-ai   { background:#0F0F0D; border:1px solid rgba(201,168,76,0.08); border-radius:18px 18px 18px 4px; }
  .cb-input { background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.2); border-radius:14px; color:#F2EDE4; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; outline:none; resize:none; }
  .cb-input:focus { border-color:rgba(201,168,76,0.4); }
  .cb-input::placeholder { color:rgba(242,237,228,0.25); }
  .quick-btn { background:rgba(201,168,76,0.06); border:1px solid rgba(201,168,76,0.15); border-radius:20px; color:rgba(242,237,228,0.6); cursor:pointer; font-family:'Plus Jakarta Sans',sans-serif; font-size:11px; padding:7px 14px; transition:all 0.2s; white-space:nowrap; }
  .quick-btn:hover { background:rgba(201,168,76,0.15); color:#C9A84C; border-color:rgba(201,168,76,0.35); }
`;

const QUICK_QS = [
  'What are the 5 pillars of Islam?',
  'How to perform Wudu?',
  'What is the meaning of Surah Al-Fatiha?',
  'Benefits of Salah',
  'What is Zakat and who should pay?',
  'Tell me about Prophet Muhammad ﷺ',
  'What is Ramadan?',
  'How to make Dua properly?',
];

const SYSTEM_PROMPT = `You are IslamIQ, a knowledgeable and compassionate Islamic AI assistant. You provide accurate Islamic knowledge based on Quran and authentic Hadith.

Guidelines:
- Answer all Islamic questions with knowledge from Quran, Sunnah and authentic scholarly sources
- Be respectful, compassionate and educational
- For matters of fiqh, mention different scholarly opinions when relevant
- Always recommend consulting qualified scholars for personal religious matters
- Keep answers clear, structured and easy to understand
- Use relevant Quran verses and Hadith when appropriate
- Start important Quranic quotes with "Allah says in the Quran:"
- Format responses clearly with paragraphs`;

export default function Chatbot() {
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cb_history') || '[]'); } catch { return []; }
  });
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError]     = useState('');
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const recogRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, loading]);

  const saveHistory = (msgs) => {
    try { localStorage.setItem('cb_history', JSON.stringify(msgs.slice(-50))); } catch {}
  };

  const sendMessage = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput(''); setError('');

    const timestamp = new Date().toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
    const userMsg   = { role:'user', content:q, time:timestamp };
    const newMsgs   = [...messages, userMsg];
    setMessages(newMsgs);
    setLoading(true);

    try {
      const res = await fetch(GROQ_BASE, {
        method:'POST',
        headers: { 'Authorization':`Bearer ${GROQ_KEY}`, 'Content-Type':'application/json' },
        body: JSON.stringify({
          model:    'llama-3.3-70b-versatile',
          messages: [
            { role:'system', content:SYSTEM_PROMPT },
            ...newMsgs.slice(-20).map(m => ({ role:m.role, content:m.content })),
          ],
          max_tokens:  1200,
          temperature: 0.7,
        }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
      const aiTime = new Date().toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
      const finalMsgs = [...newMsgs, { role:'assistant', content:reply, time:aiTime }];
      setMessages(finalMsgs);
      saveHistory(finalMsgs);
    } catch (e) {
      setError(e.message || 'Failed to get response. Check your API key.');
    }
    setLoading(false);
  };

  const clearHistory = () => {
    setMessages([]);
    try { localStorage.removeItem('cb_history'); } catch {}
  };

  const shareConvo = () => {
    const text = messages.map(m => `${m.role === 'user' ? 'You' : 'IslamIQ'} (${m.time}):\n${m.content}`).join('\n\n---\n\n');
    if (navigator.share) navigator.share({ title:'IslamIQ Conversation', text });
    else { navigator.clipboard?.writeText(text); alert('Conversation copied!'); }
  };

  const toggleMic = () => {
    if (listening) { recogRef.current?.stop(); setListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice input not supported in this browser'); return; }
    const r = new SR();
    r.lang = 'en-US'; r.interimResults = false;
    r.onresult = (e) => { setInput(e.results[0][0].transcript); setListening(false); };
    r.onerror  = () => setListening(false);
    r.onend    = () => setListening(false);
    recogRef.current = r;
    r.start(); setListening(true);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="cb-root">
      <style>{CSS}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#050505,#0F0F0D)', borderBottom:'1px solid rgba(201,168,76,0.1)', padding:'14px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, background:'linear-gradient(135deg,#C9A84C,#E8C97A)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🤖</div>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontSize:14, fontWeight:700 }} className="gold-shimmer">IslamIQ AI</div>
            <div style={{ fontSize:11, color:'rgba(46,204,113,0.7)', display:'flex', alignItems:'center', gap:4 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#2ecc71' }}/>
              Online · Powered by Groq AI
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {messages.length > 0 && (
            <>
              <button onClick={shareConvo} style={{ padding:'7px 10px', background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:8, color:'#C9A84C', cursor:'pointer', display:'flex', alignItems:'center', gap:5, fontSize:11 }}>
                <Share2 size={12}/> Share
              </button>
              <button onClick={clearHistory} style={{ padding:'7px 10px', background:'rgba(231,76,60,0.08)', border:'1px solid rgba(231,76,60,0.15)', borderRadius:8, color:'#e74c3c', cursor:'pointer', display:'flex', alignItems:'center', gap:5, fontSize:11 }}>
                <Trash2 size={12}/> Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'18px 20px', display:'flex', flexDirection:'column', gap:14 }}>

        {/* Welcome */}
        {isEmpty && (
          <div style={{ textAlign:'center', padding:'40px 20px', animation:'fadeUp 0.5s ease' }}>
            <div style={{ fontSize:48, marginBottom:14 }}>🤖</div>
            <h2 style={{ fontFamily:'Cinzel,serif', fontSize:18, fontWeight:700, marginBottom:8 }} className="gold-shimmer">As-salamu Alaykum!</h2>
            <p style={{ fontSize:13, color:'rgba(242,237,228,0.45)', lineHeight:1.7, maxWidth:400, margin:'0 auto 24px' }}>
              I'm your Islamic AI companion. Ask me anything about Islam — Quran, Hadith, Prayer, Islamic history and more.
            </p>
            {/* Quick questions */}
            <div style={{ fontSize:11, color:'rgba(201,168,76,0.5)', letterSpacing:2, fontFamily:'Cinzel,serif', marginBottom:12 }}>QUICK QUESTIONS</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
              {QUICK_QS.map(q => (
                <button key={q} className="quick-btn" onClick={() => sendMessage(q)}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, i) => (
          <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', flexDirection: msg.role==='user'?'row-reverse':'row', animation:'fadeUp 0.3s ease' }}>
            {/* Avatar */}
            <div style={{ width:34, height:34, flexShrink:0, borderRadius:10, background: msg.role==='user'?'rgba(201,168,76,0.15)':'rgba(46,204,113,0.1)', border:`1px solid ${msg.role==='user'?'rgba(201,168,76,0.25)':'rgba(46,204,113,0.2)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>
              {msg.role === 'user' ? <User size={16} color="#C9A84C"/> : <Bot size={16} color="#2ecc71"/>}
            </div>
            {/* Bubble */}
            <div style={{ maxWidth:'75%' }}>
              <div className={msg.role==='user'?'msg-user':'msg-ai'} style={{ padding:'12px 16px' }}>
                <div style={{ fontSize:13, lineHeight:1.75, color: msg.role==='user'?'rgba(242,237,228,0.9)':'rgba(242,237,228,0.85)', whiteSpace:'pre-wrap' }}>
                  {msg.content}
                </div>
              </div>
              {/* Timestamp */}
              {msg.time && (
                <div style={{ fontSize:10, color:'rgba(242,237,228,0.2)', marginTop:4, textAlign: msg.role==='user'?'right':'left', paddingLeft: msg.role==='user'?0:4, paddingRight: msg.role==='user'?4:0 }}>
                  {msg.time}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div style={{ display:'flex', gap:10, alignItems:'flex-start', animation:'fadeUp 0.3s ease' }}>
            <div style={{ width:34, height:34, flexShrink:0, borderRadius:10, background:'rgba(46,204,113,0.1)', border:'1px solid rgba(46,204,113,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Bot size={16} color="#2ecc71"/>
            </div>
            <div className="msg-ai" style={{ padding:'14px 18px', display:'flex', gap:5, alignItems:'center' }}>
              {[0,0.2,0.4].map((d,i) => (
                <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'rgba(201,168,76,0.6)', animation:`dots 1.4s ${d}s ease-in-out infinite` }}/>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{ background:'rgba(231,76,60,0.08)', border:'1px solid rgba(231,76,60,0.2)', borderRadius:12, padding:'12px 16px', fontSize:12, color:'#e74c3c' }}>
            ⚠️ {error}
          </div>
        )}

        <div ref={bottomRef}/>
      </div>

      {/* Quick questions bar (when has messages) */}
      {!isEmpty && (
        <div style={{ padding:'8px 16px 0', overflowX:'auto', display:'flex', gap:6, flexShrink:0 }}>
          {QUICK_QS.slice(0,4).map(q => (
            <button key={q} className="quick-btn" onClick={() => sendMessage(q)} style={{ flexShrink:0 }}>{q}</button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div style={{ padding:'12px 16px 16px', borderTop:'1px solid rgba(201,168,76,0.08)', flexShrink:0, background:'#030303' }}>
        <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
          <textarea
            ref={inputRef}
            className="cb-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }}}
            placeholder="Ask anything about Islam..."
            rows={1}
            style={{ flex:1, padding:'12px 14px', maxHeight:120, overflowY:'auto' }}
          />
          {/* Mic */}
          <button onClick={toggleMic}
            style={{ padding:'12px', background: listening?'rgba(231,76,60,0.15)':'rgba(201,168,76,0.08)', border:`1px solid ${listening?'rgba(231,76,60,0.3)':'rgba(201,168,76,0.2)'}`, borderRadius:12, color: listening?'#e74c3c':'#C9A84C', cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center' }}>
            {listening ? <MicOff size={18}/> : <Mic size={18}/>}
          </button>
          {/* Send */}
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            style={{ padding:'12px 16px', background: input.trim()&&!loading?'linear-gradient(135deg,#C9A84C,#E8C97A)':'rgba(255,255,255,0.05)', border:'none', borderRadius:12, color: input.trim()&&!loading?'#050505':'rgba(242,237,228,0.2)', cursor: input.trim()&&!loading?'pointer':'not-allowed', flexShrink:0, display:'flex', alignItems:'center', gap:6, fontSize:13, fontWeight:700, fontFamily:'Cinzel,serif', transition:'all 0.2s' }}>
            {loading ? <Loader size={16} style={{ animation:'spin 1s linear infinite' }}/> : <Send size={16}/>}
          </button>
        </div>
        <div style={{ fontSize:10, color:'rgba(242,237,228,0.18)', textAlign:'center', marginTop:8 }}>
          Shift+Enter for new line · History saved locally · {messages.length} messages
        </div>
      </div>
    </div>
  );
}