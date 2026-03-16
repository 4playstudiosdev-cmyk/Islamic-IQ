// ✅ Uses fetch instead of axios for better Android WebView compatibility

const BASE = 'https://api.alquran.cloud/v1';

const fetchJSON = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    });
    clearTimeout(timeout);
    const json = await res.json();
    return json.data;
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
};

export const getAllSurahs = async () => {
  return await fetchJSON(`${BASE}/surah`);
};

export const getSurahArabic = async (num) => {
  return await fetchJSON(`${BASE}/surah/${num}`);
};

export const getSurahEnglish = async (num) => {
  return await fetchJSON(`${BASE}/surah/${num}/en.asad`);
};

export const getSurahUrdu = async (num) => {
  return await fetchJSON(`${BASE}/surah/${num}/ur.jalandhry`);
};

export const getRandomAyat = async () => {
  const n = Math.floor(Math.random() * 6236) + 1;
  return await fetchJSON(`${BASE}/ayah/${n}/editions/quran-simple,en.asad,ur.jalandhry`);
};

// ✅ Audio URL - everyayah CDN (works on Android)
export const getAyatAudioUrl = (surahNum, ayatNum) => {
  const s = String(surahNum).padStart(3, '0');
  const a = String(ayatNum).padStart(3, '0');
  return `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;
};

export const getSurahAudioUrl = (surahNum) => {
  const s = String(surahNum).padStart(3, '0');
  return `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${s}.mp3`;
};