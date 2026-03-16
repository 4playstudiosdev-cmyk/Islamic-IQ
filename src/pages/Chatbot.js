import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader, Trash2, Copy, ThumbsUp, Volume2, RefreshCw } from 'lucide-react';
import { sendMessage, SUGGESTED_QUESTIONS } from '../services/chatApi';

const GREET = `Assalamu Alaikum wa Rahmatullahi wa Barakatuh! 🌙

I am **IslamIQ Assistant** — your Islamic knowledge companion.

I can help you with:
📖 Quran meaning & Tafsir
📚 Hadith explanations
🕌 Prayer, Fasting, Zakat & Hajj
🌟 Prophet's life (Seerah)
🤲 Daily Duas & Islamic etiquette
⚖️ Halal/Haram questions

Ask me anything about Islam in **English or Urdu**! 

*Note: For complex religious rulings, always consult a qualified Islamic scholar.*`;

function MessageBubble({ msg, onCopy, onSpeak }) {
  const isBot = msg.role === 'assistant';
  const [liked, setLiked] = useState(false);

  // Render basic markdown: **bold**, *italic*, bullet points
  const renderText = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Bold
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
      // Bullet point
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 3 }}>
          <span style={{ color: '#D4AF37', flexShrink: 0 }}>•</span>
          <span dangerouslySetInnerHTML={{ __html: line.replace(/^[-•]\s*/, '') }} />
        </div>;
      }
      // Emoji lines (headings)
      if (line.trim() === '') return <div key={i} style={{ height: 6 }} />;
      return <div key={i} dangerouslySetInnerHTML={{ __html: line }} style={{ marginBottom: 2 }} />;
    });
  };

  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 18, justifyContent: isBot ? 'flex-start' : 'flex-end' }}>
      {isBot && (
        <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #148F77, #1abc9c)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, alignSelf: 'flex-end' }}>🤖</div>
      )}
      <div style={{ maxWidth: '78%' }}>
        <div style={{
          padding: '13px 16px',
          background: isBot ? 'var(--dark-card)' : 'linear-gradient(135deg, #1B6B3A, #2E8B57)',
          border: isBot ? '1px solid rgba(46,139,87,0.12)' : 'none',
          borderRadius: isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
          fontSize: 13, color: 'white', lineHeight: 1.75,
        }}>
          {msg.loading ? (
            <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '2px 0' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#3aad6e', animation: `pulse 1.2s ease ${i*0.2}s infinite` }} />
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 13, lineHeight: 1.8 }}>
              {renderText(msg.content)}
            </div>
          )}
        </div>
        {/* Action buttons for bot messages */}
        {isBot && !msg.loading && (
          <div style={{ display: 'flex', gap: 6, marginTop: 6, paddingLeft: 4 }}>
            <button onClick={() => onCopy(msg.content)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a6355', padding: '3px 6px', borderRadius: 5, fontSize: 11, display: 'flex', alignItems: 'center', gap: 3, transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#7a9585'}
              onMouseLeave={e => e.currentTarget.style.color = '#4a6355'}
            >
              <Copy size={11}/> Copy
            </button>
            <button onClick={() => onSpeak(msg.content)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a6355', padding: '3px 6px', borderRadius: 5, fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}
              onMouseEnter={e => e.currentTarget.style.color = '#7a9585'}
              onMouseLeave={e => e.currentTarget.style.color = '#4a6355'}
            >
              <Volume2 size={11}/> Listen
            </button>
            <button onClick={() => setLiked(!liked)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: liked ? '#D4AF37' : '#4a6355', padding: '3px 6px', borderRadius: 5, fontSize: 11, display: 'flex', alignItems: 'center', gap: 3 }}>
              <ThumbsUp size={11}/> {liked ? 'Liked!' : 'Like'}
            </button>
          </div>
        )}
        {/* Timestamp */}
        {msg.time && (
          <div style={{ fontSize: 10, color: '#4a6355', marginTop: 3, paddingLeft: isBot ? 4 : 0, textAlign: isBot ? 'left' : 'right' }}>
            {msg.time}
          </div>
        )}
      </div>
      {!isBot && (
        <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #1B6B3A, #2E8B57)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'flex-end' }}>
          <User size={16} color="white"/>
        </div>
      )}
    </div>
  );
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: GREET, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [copied, setCopied]     = useState(false);
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getTime = () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg   = { role: 'user',      content: msg,       time: getTime() };
    const loadingMsg= { role: 'assistant', content: '',        loading: true   };
    setMessages(prev => [...prev, userMsg, loadingMsg]);
    setLoading(true);

    // Build history for API (exclude greeting and loading)
    const history = [...messages, userMsg]
      .filter(m => !m.loading && m.content !== GREET)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const reply = await sendMessage(history);
      setMessages(prev => [
        ...prev.slice(0, -1), // remove loading
        { role: 'assistant', content: reply, time: getTime() }
      ]);
    } catch (e) {
      const errMsg = e?.response?.status === 401
        ? '❌ Invalid API key. Please add your Groq API key in chatApi.js'
        : e?.response?.status === 429
        ? '⏳ Rate limit reached. Please wait a moment and try again.'
        : '❌ Failed to get response. Check your internet and API key.';
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: errMsg, time: getTime() }
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: GREET,
      time: getTime()
    }]);
  };

  const copyText = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const clean = text.replace(/\*\*/g,'').replace(/\*/g,'').replace(/#{1,6}\s/g,'');
    const utter = new SpeechSynthesisUtterance(clean);
    const voices = window.speechSynthesis.getVoices();
    const best = voices.find(v => v.name.includes('Google UK') || v.name.includes('Zira') || v.lang === 'en-GB');
    if (best) utter.voice = best;
    utter.rate = 0.85; utter.pitch = 1.05;
    window.speechSynthesis.speak(utter);
  };

  const showSuggestions = messages.length <= 2;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>

      {/* ── Header ── */}
      <div style={{ background: 'linear-gradient(135deg, #0a1a0f, #0f3d22)', padding: '16px 24px', borderBottom: '1px solid rgba(46,139,87,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #148F77, #1abc9c)', borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, position: 'relative' }}>
            🤖
            <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, background: '#3aad6e', borderRadius: '50%', border: '2px solid #0a1a0f' }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>IslamIQ Assistant</div>
            <div style={{ fontSize: 11, color: '#3aad6e', display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, background: '#3aad6e', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              Online · Powered by Groq AI
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => window.speechSynthesis.cancel()} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, padding: '7px 12px', cursor: 'pointer', color: '#7a9585', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
            🔇 Stop
          </button>
          <button onClick={clearChat} style={{ background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.2)', borderRadius: 9, padding: '7px 12px', cursor: 'pointer', color: '#e74c3c', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Trash2 size={12}/> Clear
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} onCopy={copyText} onSpeak={speakText} />
        ))}

        {/* Suggested questions */}
        {showSuggestions && (
          <div style={{ marginTop: 8, marginBottom: 16 }}>
            <p style={{ fontSize: 11, color: '#4a6355', marginBottom: 10 }}>💡 Try asking:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button key={i} onClick={() => send(q.text)} style={{ background: 'var(--dark-card)', border: '1px solid rgba(46,139,87,0.2)', borderRadius: 20, padding: '7px 14px', cursor: 'pointer', color: '#7a9585', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(46,139,87,0.5)'; e.currentTarget.style.color = '#c0d4c8'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(46,139,87,0.2)'; e.currentTarget.style.color = '#7a9585'; }}
                >
                  <span style={{ fontSize: 14 }}>{q.icon}</span> {q.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {copied && (
          <div style={{ position: 'fixed', top: 80, right: 24, background: 'rgba(46,139,87,0.9)', color: 'white', padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, zIndex: 999 }}>
            ✅ Copied!
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div style={{ padding: '14px 24px 20px', borderTop: '1px solid rgba(46,139,87,0.12)', background: 'rgba(8,15,10,0.95)', flexShrink: 0 }}>
        {/* Quick topic chips */}
        <div style={{ display: 'flex', gap: 7, marginBottom: 12, overflowX: 'auto', paddingBottom: 2 }}>
          {['🕌 Salah', '📿 Dhikr', '📖 Quran', '🌙 Ramadan', '💍 Marriage', '💰 Zakat', '✈️ Hajj', '🍖 Halal'].map(t => (
            <button key={t} onClick={() => { setInput(prev => prev ? prev + ' ' + t.split(' ')[1] : 'Tell me about ' + t.split(' ').slice(1).join(' ')); inputRef.current?.focus(); }} style={{ background: 'rgba(46,139,87,0.08)', border: '1px solid rgba(46,139,87,0.18)', borderRadius: 16, padding: '4px 12px', cursor: 'pointer', color: '#4a6355', fontSize: 11, whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(46,139,87,0.18)'; e.currentTarget.style.color = '#7a9585'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(46,139,87,0.08)'; e.currentTarget.style.color = '#4a6355'; }}
            >{t}</button>
          ))}
        </div>

        {/* Input box */}
        <div style={{ display: 'flex', gap: 10, background: 'var(--dark-card)', border: '1px solid rgba(46,139,87,0.2)', borderRadius: 16, padding: '8px 8px 8px 18px', transition: 'border-color 0.2s' }}
          onFocus={e => e.currentTarget.style.borderColor = 'rgba(46,139,87,0.5)'}
          onBlur={e => e.currentTarget.style.borderColor = 'rgba(46,139,87,0.2)'}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask anything about Islam... (English or Urdu)"
            rows={1}
            style={{ flex: 1, background: 'none', border: 'none', color: 'white', fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'none', lineHeight: 1.6, paddingTop: 6, maxHeight: 120, overflowY: 'auto' }}
            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{ width: 42, height: 42, background: input.trim() && !loading ? 'linear-gradient(135deg, #1B6B3A, #2E8B57)' : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 12, cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}
          </button>
        </div>
        <p style={{ fontSize: 10, color: '#2a3a2f', textAlign: 'center', marginTop: 8 }}>
          Press Enter to send · Shift+Enter for new line · IslamIQ AI may make mistakes
        </p>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}