// ✅ Zyphra TTS Service — Smart multi-language handler
const ZYPHRA_KEY  = process.env.REACT_APP_ZYPHRA_KEY || '';
const GROQ_KEY    = process.env.REACT_APP_GROQ_KEY || '';
const ZYPHRA_BASE = 'https://api.zyphra.com/v1';

const audioCache = new Map();

// ── Convert Arabic/Urdu to Roman via Groq ─────────────────────
const romanize = async (text, fromLang) => {
  if (!GROQ_KEY) return text;
  try {
    const prompt = fromLang === 'ar'
      ? `Transliterate this Arabic text into English phonetics only. Return ONLY the phonetic pronunciation, nothing else: "${text}"`
      : `Transliterate this Urdu text into English phonetics. Return ONLY the phonetic pronunciation, nothing else: "${text}"`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200, temperature: 0.1,
      }),
    });
    const d = await res.json();
    return d.choices?.[0]?.message?.content?.trim() || text;
  } catch { return text; }
};

// ── Main Zyphra TTS function ───────────────────────────────────
export const zyphraSpeak = async (text, lang = 'en') => {
  if (!ZYPHRA_KEY || !text?.trim()) return null;

  let speakText = text;

  // For Arabic and Urdu — romanize first via Groq
  if (lang === 'ar' || lang === 'ur') {
    const cached = audioCache.get(`roman:${lang}:${text}`);
    if (cached) {
      speakText = cached;
    } else {
      speakText = await romanize(text, lang);
      audioCache.set(`roman:${lang}:${text}`, speakText);
    }
  }

  const cacheKey = `audio:${lang}:${text.trim()}`;
  if (audioCache.has(cacheKey)) return audioCache.get(cacheKey);

  // Zyphra configs
  const configs = {
    en: {
      language_iso_code: 'en-us',
      speaking_rate: 14,
      default_voice_name: 'british_female',
      emotion: { happiness:0.4, neutral:0.7, sadness:0.05, disgust:0.05, fear:0.05, surprise:0.05, anger:0.05, other:0.4 },
    },
    ar: {
      language_iso_code: 'en-us',
      speaking_rate: 10,  // Slower for Arabic phonetics
      default_voice_name: 'british_male',
      emotion: { happiness:0.2, neutral:0.9, sadness:0.05, disgust:0.05, fear:0.05, surprise:0.05, anger:0.05, other:0.3 },
    },
    ur: {
      language_iso_code: 'en-us',
      speaking_rate: 12,
      default_voice_name: 'british_female',
      emotion: { happiness:0.3, neutral:0.8, sadness:0.05, disgust:0.05, fear:0.05, surprise:0.05, anger:0.05, other:0.4 },
    },
  };

  const config = configs[lang] || configs.en;

  try {
    console.log('🎵 Zyphra calling:', ZYPHRA_BASE, 'text:', speakText.substring(0,40));
    const res = await fetch(`${ZYPHRA_BASE}/audio/text-to-speech`, {
      method:  'POST',
      headers: { 'X-API-Key': ZYPHRA_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: speakText,
        model: 'zonos-v0.1-transformer',
        mime_type: 'audio/mp3',
        ...config,
      }),
    });

    console.log('Zyphra status:', res.status, res.headers.get('content-type'));

    if (!res.ok) {
      const errText = await res.text();
      console.error('❌ Zyphra error:', res.status, errText);
      return null;
    }

    const blob = await res.blob();
    console.log('✅ Zyphra blob size:', blob.size, 'type:', blob.type);

    if (blob.size < 100) {
      console.error('❌ Zyphra returned empty audio blob');
      return null;
    }

    const blobUrl = URL.createObjectURL(blob);
    audioCache.set(cacheKey, blobUrl);
    return blobUrl;
  } catch (e) {
    console.error('❌ Zyphra TTS fetch error:', e.message);
    return null;
  }
};

export const playAudio = (blobUrl, audioEl) => {
  if (!blobUrl || !audioEl) return;
  audioEl.pause();
  audioEl.src = blobUrl;
  audioEl.volume = 1;
  audioEl.play().catch(console.error);
};