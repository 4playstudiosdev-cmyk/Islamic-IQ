// ✅ Quran API - with retry + Zyphra TTS for Urdu audio

const BASE        = 'https://api.alquran.cloud/v1';
const ZYPHRA_KEY  = process.env.REACT_APP_ZYPHRA_KEY || '';
const ZYPHRA_BASE = 'http://api.zyphra.com/v1';

// ── Fetch helper with retry ────────────────────────────────────
const fetchJSON = async (url, retries = 3) => {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeout    = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, {
        signal:  controller.signal,
        headers: { 'Accept': 'application/json' },
        mode:    'cors',
        cache:   'default',
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (e) {
      lastErr = e;
      if (i < retries - 1) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw lastErr;
};

// ── Zyphra TTS — Urdu text → Audio blob URL ───────────────────
export const speakUrduTTS = async (urduText) => {
  if (!ZYPHRA_KEY) {
    console.warn('❌ REACT_APP_ZYPHRA_KEY not set in .env');
    return null;
  }
  if (!urduText?.trim()) return null;

  try {
    console.log('🎵 Zyphra TTS — sending:', urduText.substring(0, 60) + '...');

    const res = await fetch(`${ZYPHRA_BASE}/audio/text-to-speech`, {
      method:  'POST',
      headers: {
        'X-API-Key':    ZYPHRA_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text:          urduText,
        model:         'zonos-v0.1-transformer',
        speaking_rate: 12,           // Slower for Urdu
        language_iso_code: 'en-us',  // Urdu not supported, use en-us
        mime_type:     'audio/mp3',
        emotion: {
          happiness: 0.3,
          neutral:   0.8,
          sadness:   0.05,
          disgust:   0.05,
          fear:      0.05,
          surprise:  0.05,
          anger:     0.05,
          other:     0.4,
        },
      }),
    });

    console.log('Zyphra response status:', res.status, res.statusText);

    if (!res.ok) {
      const errText = await res.text();
      console.error('❌ Zyphra error:', res.status, errText);
      return null;
    }

    // Response is audio blob
    const blob    = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    console.log('✅ Zyphra audio blob created:', blobUrl);
    return blobUrl;

  } catch (e) {
    console.error('❌ Zyphra TTS error:', e.message);
    return null;
  }
};

// ── Quran API ──────────────────────────────────────────────────
export const getAllSurahs    = ()    => fetchJSON(`${BASE}/surah`);
export const getSurahArabic  = (num) => fetchJSON(`${BASE}/surah/${num}`);
export const getSurahEnglish = (num) => fetchJSON(`${BASE}/surah/${num}/en.asad`);
export const getSurahUrdu    = (num) => fetchJSON(`${BASE}/surah/${num}/ur.jalandhry`);

export const getRandomAyat = () => {
  const n = Math.floor(Math.random() * 6236) + 1;
  return fetchJSON(`${BASE}/ayah/${n}/editions/quran-simple,en.asad,ur.jalandhry`);
};

// ── Audio URLs ─────────────────────────────────────────────────
export const getAyatAudioUrl = (surahNum, ayatNum) => {
  const s = String(surahNum).padStart(3, '0');
  const a = String(ayatNum).padStart(3, '0');
  return `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;
};

export const getSurahAudioUrl = (surahNum) => {
  const s = String(surahNum).padStart(3, '0');
  return `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${s}.mp3`;
};