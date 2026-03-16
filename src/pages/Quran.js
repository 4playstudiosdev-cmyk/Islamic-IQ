/* eslint-disable react-hooks/exhaustive-deps, no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Search, Play, Pause, BookOpen, Volume2, Loader, SkipBack, SkipForward, Languages } from 'lucide-react';
import { getSurahArabic, getSurahEnglish, getSurahUrdu, getAyatAudioUrl } from '../services/quranApi';

// ── EXACT Juz start/end positions ─────────────────────────────
// startSurah/startAyat = exact ayat where THIS parah begins
// endSurah/endAyat     = exact ayat where THIS parah ends
const PARAHS = [
  { num:1,  name:'Alif Lam Meem',        arabic:'الم',                    startSurah:1,  startAyat:1,   endSurah:2,  endAyat:141  },
  { num:2,  name:'Sayaqool',              arabic:'سَيَقُولُ',              startSurah:2,  startAyat:142, endSurah:2,  endAyat:252  },
  { num:3,  name:'Tilkar Rusul',          arabic:'تِلْكَ الرُّسُلُ',       startSurah:2,  startAyat:253, endSurah:3,  endAyat:92   },
  { num:4,  name:'Lan Tanaloo',           arabic:'لَن تَنَالُوا',          startSurah:3,  startAyat:93,  endSurah:4,  endAyat:23   },
  { num:5,  name:'Wal Mohsanat',          arabic:'وَالْمُحْصَنَاتُ',       startSurah:4,  startAyat:24,  endSurah:4,  endAyat:147  },
  { num:6,  name:'La Yuhibbullah',        arabic:'لَا يُحِبُّ اللَّهُ',    startSurah:4,  startAyat:148, endSurah:5,  endAyat:81   },
  { num:7,  name:'Wa Iza Samiu',          arabic:'وَإِذَا سَمِعُوا',       startSurah:5,  startAyat:82,  endSurah:6,  endAyat:110  },
  { num:8,  name:'Wa Lau Annana',         arabic:'وَلَوْ أَنَّنَا',        startSurah:6,  startAyat:111, endSurah:7,  endAyat:87   },
  { num:9,  name:'Qalal Malao',           arabic:'قَالَ الْمَلَأُ',        startSurah:7,  startAyat:88,  endSurah:8,  endAyat:40   },
  { num:10, name:'Wa Alamu',              arabic:'وَاعْلَمُوا',            startSurah:8,  startAyat:41,  endSurah:9,  endAyat:92   },
  { num:11, name:'Yatazeroon',            arabic:'يَعْتَذِرُونَ',          startSurah:9,  startAyat:93,  endSurah:11, endAyat:5    },
  { num:12, name:'Wa Mamin Dabbah',       arabic:'وَمَا مِن دَابَّةٍ',     startSurah:11, startAyat:6,   endSurah:12, endAyat:52   },
  { num:13, name:'Wa Ma Ubarri-o',        arabic:'وَمَا أُبَرِّئُ',        startSurah:12, startAyat:53,  endSurah:14, endAyat:52   },
  { num:14, name:'Rubama',                arabic:'رُبَمَا',                startSurah:15, startAyat:1,   endSurah:16, endAyat:128  },
  { num:15, name:'Subhanallazi',          arabic:'سُبْحَانَ الَّذِي',      startSurah:17, startAyat:1,   endSurah:18, endAyat:74   },
  { num:16, name:'Qal Alam',              arabic:'قَالَ أَلَمْ',           startSurah:18, startAyat:75,  endSurah:20, endAyat:135  },
  { num:17, name:'Aqtarabo',              arabic:'اقْتَرَبَ',              startSurah:21, startAyat:1,   endSurah:22, endAyat:78   },
  { num:18, name:'Qad Aflaha',            arabic:'قَدْ أَفْلَحَ',          startSurah:23, startAyat:1,   endSurah:25, endAyat:20   },
  { num:19, name:'Wa Qalallazina',        arabic:'وَقَالَ الَّذِينَ',      startSurah:25, startAyat:21,  endSurah:27, endAyat:55   },
  { num:20, name:'Amman Khalaq',          arabic:'أَمَّنْ خَلَقَ',         startSurah:27, startAyat:56,  endSurah:29, endAyat:45   },
  { num:21, name:'Utlu Ma Oohia',         arabic:'اتْلُ مَا أُوحِيَ',      startSurah:29, startAyat:46,  endSurah:33, endAyat:30   },
  { num:22, name:'Wa Manyaqnut',          arabic:'وَمَن يَقْنُتْ',         startSurah:33, startAyat:31,  endSurah:36, endAyat:27   },
  { num:23, name:'Wa Mali',               arabic:'وَمَا لِيَ',             startSurah:36, startAyat:28,  endSurah:39, endAyat:31   },
  { num:24, name:'Faman Azlam',           arabic:'فَمَنْ أَظْلَمُ',        startSurah:39, startAyat:32,  endSurah:41, endAyat:46   },
  { num:25, name:'Elahe Yuruddo',         arabic:'إِلَيْهِ يُرَدُّ',       startSurah:41, startAyat:47,  endSurah:45, endAyat:37   },
  { num:26, name:'Ha Meem',               arabic:'حم',                     startSurah:46, startAyat:1,   endSurah:51, endAyat:30   },
  { num:27, name:'Qala Fama Khatbukum',   arabic:'قَالَ فَمَا خَطْبُكُمْ', startSurah:51, startAyat:31,  endSurah:57, endAyat:29   },
  { num:28, name:'Qad Sami Allah',        arabic:'قَدْ سَمِعَ اللَّهُ',    startSurah:58, startAyat:1,   endSurah:66, endAyat:12   },
  { num:29, name:'Tabarakallazi',         arabic:'تَبَارَكَ الَّذِي',      startSurah:67, startAyat:1,   endSurah:77, endAyat:50   },
  { num:30, name:'Amma',                  arabic:'عَمَّ',                  startSurah:78, startAyat:1,   endSurah:114,endAyat:6    },
];

// ── Better TTS using Google Translate TTS (better voice) ─────
// ── TTS: ResponsiveVoice (Urdu) + Browser TTS (English) ──────
const ttsAudioRef = { current: null };

// ✅ Add your ResponsiveVoice API key here when you get it
const RV_KEY = 'YOUR_RESPONSIVEVOICE_KEY';

function speakText(text, langCode, onEnd) {
  window.speechSynthesis.cancel();
  if (ttsAudioRef.current) {
    ttsAudioRef.current.pause();
    ttsAudioRef.current.src = '';
  }

  if (langCode === 'ur-PK') {
    // ✅ ResponsiveVoice for Urdu
    if (RV_KEY && RV_KEY !== 'YOUR_RESPONSIVEVOICE_KEY') {
      playResponsiveVoice(text, onEnd);
    } else {
      // Fallback: browser speech
      browserSpeak(text, 'ur-PK', 0.75, onEnd);
    }
  } else {
    browserSpeak(text, 'en-GB', 0.82, onEnd);
  }
}

function playResponsiveVoice(text, onEnd) {
  // ResponsiveVoice API — Urdu Female voice
  const encoded = encodeURIComponent(text.substring(0, 500));
  const url = `https://code.responsivevoice.org/getvoice.php?t=${encoded}&tl=ur&sv=&vn=&pitch=0.5&rate=0.7&vol=1&key=${RV_KEY}`;
  const audio = new Audio(url);
  ttsAudioRef.current = audio;
  audio.onended = onEnd;
  audio.onerror = () => {
    console.warn('ResponsiveVoice failed, using browser fallback');
    browserSpeak(text, 'ur-PK', 0.75, onEnd);
  };
  audio.play().catch(() => browserSpeak(text, 'ur-PK', 0.75, onEnd));
}

function browserSpeak(text, lang, rate, onEnd) {
  window.speechSynthesis.cancel();
  const voices = window.speechSynthesis.getVoices();
  const utter  = new SpeechSynthesisUtterance(text);
  if (lang.startsWith('ur')) {
    const urduVoice = voices.find(v => v.lang.startsWith('ur'));
    if (urduVoice) utter.voice = urduVoice;
    utter.lang = 'ur-PK';
  } else {
    const preferred = ['Google UK English Female','Microsoft Zira','Microsoft Hazel','Google US English','Samantha'];
    let best = null;
    for (const name of preferred) {
      best = voices.find(v => v.name.includes(name.split(' ')[1]) && v.lang.startsWith('en'));
      if (best) break;
    }
    if (!best) best = voices.find(v => v.lang === 'en-GB');
    if (!best) best = voices.find(v => v.lang.startsWith('en'));
    if (best) utter.voice = best;
    utter.lang  = best?.lang || 'en-US';
    utter.pitch = 1.05;
  }
  utter.rate   = rate;
  utter.onend  = onEnd;
  utter.onerror= onEnd;
  window.speechSynthesis.speak(utter);
}

export default function Quran() {
  const [surahs, setSurahs]               = useState([]);
  const [selected, setSelected]           = useState(null);
  const [ayats, setAyats]                 = useState([]);
  const [translations, setTranslations]   = useState([]);
  const [urduTrans, setUrduTrans]         = useState([]);
  const [loading, setLoading]             = useState(false);
  const [loadingSurahs, setLoadingSurahs] = useState(true);
  const [search, setSearch]               = useState('');
  const [displayLang, setDisplayLang]     = useState('english'); // for display
  const [playing, setPlaying]             = useState(false);
  const [currentAyat, setCurrentAyat]     = useState(null);
  const [audioLoading, setAudioLoading]   = useState(false);
  const [activeTab, setActiveTab]         = useState('surah');
  const [selectedParah, setSelectedParah] = useState(null);
  const [playingParah, setPlayingParah]   = useState(null);
  const [playMode, setPlayMode]           = useState('ayat'); // 'ayat' | 'with-translation'
  const [transLang, setTransLang]         = useState('english'); // translation voice lang

  // ── All playback state in ONE ref — never stale ──
  const S = useRef({
    active:       false,
    isParah:      false,
    surahsData:   [],      // [{surahNumber, surahInfo, ayahs, enTrans, urTrans}]
    sIdx:         0,
    aNum:         1,
    mode:         'ayat',
    transLang:    'english',
    stopped:      false,
  });

  const audioRef   = useRef(null);
  const audio2Ref  = useRef(null); // for preloading
  const surahsRef  = useRef([]);

  // ── Mobile responsive ──
  const [isMobile, setIsMobile]     = useState(window.innerWidth < 768);
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => { surahsRef.current = surahs; }, [surahs]);
  useEffect(() => { S.current.mode = playMode; }, [playMode]);
  useEffect(() => { S.current.transLang = transLang; }, [transLang]);

  useEffect(() => {
    // Pre-load voices
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();

    // ✅ Load surahs with retry (fixes Android WebView blocking)
    const loadSurahs = async (attempt = 1) => {
      try {
        // Use fetch directly instead of axios for better Android compatibility
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);
        const res = await fetch('https://api.alquran.cloud/v1/surah', {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
        });
        clearTimeout(timeout);
        const json = await res.json();
        if (json && json.data) {
          setSurahs(json.data);
          setLoadingSurahs(false);
        } else throw new Error('Bad response');
      } catch (e) {
        if (attempt < 3) {
          // Retry after 2 seconds
          setTimeout(() => loadSurahs(attempt + 1), 2000);
        } else {
          // Final fallback — use CDN mirror
          try {
            const res2 = await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara.json');
            const json2 = await res2.json(); // eslint-disable-line no-unused-vars
            // Build minimal surah list from this API
            const fallbackSurahs = Array.from({length: 114}, (_, i) => ({
              number: i + 1,
              name: ['الفاتحة','البقرة','آل عمران','النساء','المائدة','الأنعام','الأعراف','الأنفال','التوبة','يونس','هود','يوسف','الرعد','إبراهيم','الحجر','النحل','الإسراء','الكهف','مريم','طه','الأنبياء','الحج','المؤمنون','النور','الفرقان','الشعراء','النمل','القصص','العنكبوت','الروم','لقمان','السجدة','الأحزاب','سبأ','فاطر','يس','الصافات','ص','الزمر','غافر','فصلت','الشورى','الزخرف','الدخان','الجاثية','الأحقاف','محمد','الفتح','الحجرات','ق','الذاريات','الطور','النجم','القمر','الرحمن','الواقعة','الحديد','المجادلة','الحشر','الممتحنة','الصف','الجمعة','المنافقون','التغابن','الطلاق','التحريم','الملك','القلم','الحاقة','المعارج','نوح','الجن','المزمل','المدثر','القيامة','الإنسان','المرسلات','النبأ','النازعات','عبس','التكوير','الانفطار','المطففين','الانشقاق','البروج','الطارق','الأعلى','الغاشية','الفجر','البلد','الشمس','الليل','الضحى','الشرح','التين','العلق','القدر','البينة','الزلزلة','العاديات','القارعة','التكاثر','العصر','الهمزة','الفيل','قريش','الماعون','الكوثر','الكافرون','النصر','المسد','الإخلاص','الفلق','الناس'][i],
              englishName: ["Al-Fatiha","Al-Baqara","Aal-i-Imraan","An-Nisaa","Al-Maaida","Al-An'aam","Al-A'raaf","Al-Anfaal","At-Tawba","Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Israa","Al-Kahf","Maryam","Ta-Ha","Al-Anbiyaa","Al-Hajj","Al-Muminoon","An-Noor","Al-Furqaan","Ash-Shu'araa","An-Naml","Al-Qasas","Al-Ankaboot","Ar-Room","Luqman","As-Sajda","Al-Ahzaab","Saba","Faatir","Ya-Seen","As-Saaffaat","Saad","Az-Zumar","Ghafir","Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhaan","Al-Jaathiya","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujuraat","Qaaf","Adh-Dhaariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'a","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahana","As-Saff","Al-Jumu'a","Al-Munafiqoon","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haaqqa","Al-Ma'arij","Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyama","Al-Insan","Al-Mursalat","An-Naba","An-Naazi'aat","Abasa","At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Burooj","At-Tariq","Al-Ala","Al-Ghashiya","Al-Fajr","Al-Balad","Ash-Shams","Al-Lail","Ad-Dhuha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyina","Az-Zalzala","Al-Aadiyaat","Al-Qaari'a","At-Takaathur","Al-Asr","Al-Humaza","Al-Fil","Quraish","Al-Maa'un","Al-Kawthar","Al-Kaafiroon","An-Nasr","Al-Masad","Al-Ikhlaas","Al-Falaq","An-Naas"][i],
              englishNameTranslation: '',
              numberOfAyahs: [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,59,37,35,31,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,29,15,52,12,77,50,45,26,50,30,38,44,32,40,15,6,29,24,13,14,43,32,30,13,14,22,18,12,12,30,52,52,44,28,28,20,56,25,13,32,10,5,11,4,13,4,5,5,4,4,5,6,3,3,3][i],
              revelationType: i < 87 ? 'Meccan' : 'Medinan',
            }));
            setSurahs(fallbackSurahs);
          } catch {
            setSurahs([]);
          }
          setLoadingSurahs(false);
        }
      }
    };

    loadSurahs();
  }, []);

  // Load surah for display (only when NOT in parah mode)
  useEffect(() => {
    if (!selected || S.current.isParah) return;
    setLoading(true);
    setAyats([]); setTranslations([]); setUrduTrans([]);
    stopAll();
    const fetchWithFallback = async (url, fallback = []) => {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 12000);
        const r = await fetch(url, { signal: ctrl.signal, headers: { 'Accept': 'application/json' } });
        clearTimeout(t);
        const j = await r.json();
        return j.data || fallback;
      } catch { return fallback; }
    };

    Promise.all([
      fetchWithFallback(`https://api.alquran.cloud/v1/surah/${selected.number}`),
      fetchWithFallback(`https://api.alquran.cloud/v1/surah/${selected.number}/en.asad`),
      fetchWithFallback(`https://api.alquran.cloud/v1/surah/${selected.number}/ur.jalandhry`),
    ]).then(([ar, en, ur]) => {
      setAyats(ar.ayahs || []);
      setTranslations(en.ayahs || []);
      setUrduTrans(ur.ayahs || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selected]);

  // ─── CORE: play single ayat audio, then maybe speak translation ───
  function playAyatItem(sIdx, aNum) {
    const s = S.current;
    if (s.stopped) return;

    const sd = s.surahsData[sIdx];
    if (!sd) return;

    // Past last ayat → move to next surah
    if (aNum > sd.ayahs.length) {
      const nextSIdx = sIdx + 1;
      if (nextSIdx < s.surahsData.length) {
        s.sIdx = nextSIdx;
        s.aNum = 1;
        const nextSD = s.surahsData[nextSIdx];
        // Update UI for next surah
        setAyats(nextSD.ayahs);
        setTranslations(nextSD.enTrans || []);
        setUrduTrans(nextSD.urTrans || []);
        setCurrentAyat(1);
        if (nextSD.surahInfo) setSelected(nextSD.surahInfo);
        playAyatItem(nextSIdx, 1);
      } else {
        // All done!
        s.active  = false;
        s.isParah = false;
        setPlaying(false); setPlayingParah(null); setCurrentAyat(null);
      }
      return;
    }

    s.sIdx = sIdx;
    s.aNum = aNum;

    // ── Use REAL ayat number from ayah object (not array index) ──
    // aNum is 1-based index into the sliced array
    // sd.ayahs[aNum-1].numberInSurah is the real ayat number in the surah
    const realAyatNum = sd.ayahs[aNum - 1]?.numberInSurah || aNum;
    const url = getAyatAudioUrl(sd.surahNumber, realAyatNum);
    const preloadedUrl = audio2Ref.current?.src || '';

    let mainAudio = audioRef.current;
    if (preloadedUrl.endsWith(url.split('/').pop())) {
      // Swap: use preloaded audio as main
      mainAudio = audio2Ref.current;
      audioRef.current = audio2Ref.current;
      audio2Ref.current = mainAudio === audioRef.current ? new Audio() : mainAudio;
    } else {
      mainAudio.src = url;
      mainAudio.load();
    }

    setCurrentAyat(realAyatNum);
    setPlaying(true);
    setAudioLoading(true);

    mainAudio.oncanplaythrough = () => setAudioLoading(false);
    mainAudio.onended = () => {
      if (S.current.stopped) return;
      // Preload NEXT ayat immediately while translation plays
      preloadNext(sIdx, aNum);
      afterAyatPlayed(sIdx, aNum);
    };
    mainAudio.onerror = () => {
      if (S.current.stopped) return;
      afterAyatPlayed(sIdx, aNum); // skip on error
    };
    mainAudio.play().catch(() => {
      if (!S.current.stopped) afterAyatPlayed(sIdx, aNum);
    });

    // Preload the NEXT ayat right now
    preloadNext(sIdx, aNum);
  }

  function preloadNext(sIdx, aNum) {
    const s  = S.current;
    const sd = s.surahsData[sIdx];
    if (!sd || !audio2Ref.current) return;
    let ns = sIdx, na = aNum + 1;
    if (na > sd.ayahs.length) {
      ns = sIdx + 1;
      na = 1;
    }
    const nsd = s.surahsData[ns];
    if (!nsd) return;
    // Use real ayat number from ayah object
    const realNa = nsd.ayahs[na - 1]?.numberInSurah || na;
    audio2Ref.current.src = getAyatAudioUrl(nsd.surahNumber, realNa);
    audio2Ref.current.load();
  }

  function afterAyatPlayed(sIdx, aNum) {
    const s = S.current;
    if (s.stopped) return;
    if (s.mode === 'with-translation') {
      const sd     = s.surahsData[sIdx];
      const isUrdu = s.transLang === 'urdu';
      const arr    = isUrdu ? sd?.urTrans : sd?.enTrans;
      const text   = arr?.[aNum - 1]?.text;
      if (text) {
        speakText(text, isUrdu ? 'ur-PK' : 'en-GB', () => {
          if (!S.current.stopped) {
            s.aNum = aNum + 1;
            playAyatItem(sIdx, aNum + 1);
          }
        });
        return;
      }
    }
    s.aNum = aNum + 1;
    playAyatItem(sIdx, aNum + 1);
  }

  // ─── Stop everything ───────────────────────────────────────────
  function stopAll() {
    S.current.stopped = true;
    S.current.active  = false;
    S.current.isParah = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onended  = null;
      audioRef.current.onerror  = null;
    }
    // Stop Google TTS Urdu audio too
    if (ttsAudioRef.current) {
      ttsAudioRef.current.pause();
      ttsAudioRef.current.onended = null;
      ttsAudioRef.current.onerror = null;
      ttsAudioRef.current.src = '';
    }
    window.speechSynthesis.cancel();
    setPlaying(false); setCurrentAyat(null); setPlayingParah(null);
  }

  // ─── Start playing full Surah ──────────────────────────────────
  async function startSurah(mode) {
    if (!selected || !ayats.length) return;
    stopAll();
    await new Promise(r => setTimeout(r, 80)); // tiny pause after stop

    S.current = {
      stopped:    false, active: true, isParah: false,
      surahsData: [{ surahNumber: selected.number, surahInfo: selected, ayahs: ayats, enTrans: translations, urTrans: urduTrans }],
      sIdx: 0, aNum: 1,
      mode, transLang: S.current.transLang,
    };
    setPlayMode(mode);
    playAyatItem(0, 1);
  }

  // ─── Start playing full Parah (from exact startAyat) ────────────
  async function startParah(parah) {
    stopAll();
    await new Promise(r => setTimeout(r, 80));
    setLoading(true);
    setPlayingParah(parah);

    // Get all surahs that are part of this parah
    const list = surahsRef.current.filter(
      s => s.number >= parah.startSurah && s.number <= parah.endSurah
    );
    if (list[0]) setSelected(list[0]);

    // Load all surahs data in parallel
    const loaded = await Promise.all(
      list.map(async s => {
        const [ar, en, ur] = await Promise.all([
          getSurahArabic(s.number),
          getSurahEnglish(s.number),
          getSurahUrdu(s.number),
        ]);

        // ✅ Slice ayats to correct range for this parah
        // First surah: start from parah.startAyat
        // Last surah:  end at parah.endAyat
        // Middle surahs: full surah
        let ayahs   = ar.ayahs;
        let enTrans = en.ayahs;
        let urTrans = ur.ayahs;

        if (s.number === parah.startSurah && s.number === parah.endSurah) {
          // Parah is entirely within one surah
          ayahs   = ar.ayahs.slice(parah.startAyat - 1, parah.endAyat);
          enTrans = en.ayahs.slice(parah.startAyat - 1, parah.endAyat);
          urTrans = ur.ayahs.slice(parah.startAyat - 1, parah.endAyat);
        } else if (s.number === parah.startSurah) {
          // First surah — start from parah.startAyat
          ayahs   = ar.ayahs.slice(parah.startAyat - 1);
          enTrans = en.ayahs.slice(parah.startAyat - 1);
          urTrans = ur.ayahs.slice(parah.startAyat - 1);
        } else if (s.number === parah.endSurah) {
          // Last surah — end at parah.endAyat
          ayahs   = ar.ayahs.slice(0, parah.endAyat);
          enTrans = en.ayahs.slice(0, parah.endAyat);
          urTrans = ur.ayahs.slice(0, parah.endAyat);
        }
        // Middle surahs — full surah (no slice needed)

        return {
          surahNumber: s.number,
          surahInfo:   s,
          ayahs,
          enTrans,
          urTrans,
          // Keep original for display scrolling reference
          startAyatOffset: s.number === parah.startSurah ? parah.startAyat - 1 : 0,
        };
      })
    );

    // Set display for first surah — show from startAyat
    setAyats(loaded[0].ayahs);
    setTranslations(loaded[0].enTrans);
    setUrduTrans(loaded[0].urTrans);
    setLoading(false);

    S.current = {
      stopped:   false, active: true, isParah: true,
      surahsData: loaded, sIdx: 0, aNum: 1,
      mode:      S.current.mode,
      transLang: S.current.transLang,
      parah,
    };
    // ✅ Start from ayat 1 of loaded data (which is already sliced to startAyat)
    playAyatItem(0, 1);
  }

  const getParahSurahs = num => {
    const p = PARAHS[num - 1];
    return surahs.filter(s => s.number >= p.startSurah && s.number <= p.endSurah);
  };

  // Get parah info label for a surah (e.g. "starts at ayat 142")
  const getParahSurahLabel = (parah, surahNum) => {
    if (surahNum === parah.startSurah && parah.startAyat > 1)
      return `From ayat ${parah.startAyat}`;
    if (surahNum === parah.endSurah && parah.endAyat < 286)
      return `Up to ayat ${parah.endAyat}`;
    return null;
  };

  const filtered = surahs.filter(s =>
    s.englishName.toLowerCase().includes(search.toLowerCase()) ||
    s.name.includes(search) ||
    s.englishNameTranslation.toLowerCase().includes(search.toLowerCase()) ||
    String(s.number).includes(search)
  );

  return (
    <div style={{ display: 'flex', height: isMobile ? 'calc(100vh - 120px)' : '100vh', overflow: 'hidden' }}>
      {/* Hidden audio elements */}
      <audio ref={audioRef} />
      <audio ref={audio2Ref} style={{ display: 'none' }} />

      {/* ── MOBILE: Drawer ── */}
      {isMobile && drawerOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:500 }} onClick={() => setDrawerOpen(false)}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(4px)' }}/>
          <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:0, left:0, bottom:0, width:'82%', maxWidth:310, background:'#080f0a', borderRight:'1px solid rgba(46,139,87,0.2)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
            {/* Close button */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 14px 0' }}>
              <h1 style={{ fontSize:16, fontWeight:800, display:'flex', alignItems:'center', gap:6 }}>
                <BookOpen size={16} color="#D4AF37"/> القرآن الكريم
              </h1>
              <button onClick={() => setDrawerOpen(false)} style={{ background:'rgba(255,255,255,0.08)', border:'none', borderRadius:8, padding:'5px 9px', cursor:'pointer', color:'#7a9585', fontSize:14 }}>✕</button>
            </div>
            {/* Surah/Parah tabs */}
            <div style={{ padding:'12px 14px', borderBottom:'1px solid rgba(46,139,87,0.1)' }}>
              <div style={{ display:'flex', gap:6, marginBottom:10, background:'rgba(46,139,87,0.08)', borderRadius:10, padding:4 }}>
                {['surah','parah'].map(t => (
                  <button key={t} onClick={() => { setActiveTab(t); setSelectedParah(null); }} style={{ flex:1, padding:'7px', borderRadius:7, border:'none', background: activeTab===t ? 'rgba(46,139,87,0.35)' : 'transparent', color: activeTab===t ? 'white' : '#4a6355', fontSize:12, fontWeight: activeTab===t ? 600 : 400, cursor:'pointer' }}>
                    {t === 'surah' ? '📖 Surah' : '📚 Parah'}
                  </button>
                ))}
              </div>
              {activeTab === 'surah' && (
                <div style={{ position:'relative' }}>
                  <Search size={12} color="#4a6355" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }}/>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search surah..."
                    style={{ width:'100%', padding:'8px 10px 8px 30px', background:'rgba(46,139,87,0.08)', border:'1px solid rgba(46,139,87,0.2)', borderRadius:8, color:'white', fontSize:16, outline:'none', fontFamily:'inherit' }}/>
                </div>
              )}
            </div>
            {/* Surah/Parah list */}
            <div style={{ flex:1, overflowY:'auto' }}>
              {loadingSurahs ? (
                <div style={{ padding:40, textAlign:'center' }}>
                  <Loader size={22} color="#2E8B57" style={{ animation:'spin 1s linear infinite' }}/>
                  <p style={{ color:'#4a6355', fontSize:11, marginTop:10 }}>Loading...</p>
                </div>
              ) : activeTab === 'surah' ? filtered.map(s => {
                const isA = selected?.number === s.number && !S.current.isParah;
                return (
                  <button key={s.number} onClick={() => { stopAll(); S.current.isParah=false; setSelected(s); setDrawerOpen(false); }} style={{ width:'100%', padding:'11px 14px', background: isA ? 'rgba(27,107,58,0.2)' : 'transparent', border:'none', borderLeft: isA ? '3px solid #2E8B57' : '3px solid transparent', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:30, height:30, flexShrink:0, background: isA ? 'rgba(46,139,87,0.3)' : 'rgba(46,139,87,0.08)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color: isA ? '#3aad6e' : '#4a6355' }}>{s.number}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', justifyContent:'space-between' }}>
                        <span style={{ fontSize:12, fontWeight:600, color: isA ? 'white' : '#c0d4c8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:100 }}>{s.englishName}</span>
                        <span className="arabic" style={{ fontSize:13, color:'#D4AF37' }}>{s.name}</span>
                      </div>
                      <div style={{ fontSize:10, color:'#4a6355' }}>{s.numberOfAyahs} ayats</div>
                    </div>
                  </button>
                );
              }) : selectedParah === null ? PARAHS.map(p => (
                <button key={p.num} onClick={() => setSelectedParah(p)} style={{ width:'100%', padding:'12px 14px', background:'transparent', border:'none', borderLeft:'3px solid transparent', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:34, height:34, flexShrink:0, background:'rgba(212,175,55,0.1)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#D4AF37' }}>{p.num}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontSize:12, fontWeight:600, color:'#c0d4c8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:110 }}>{p.name}</span>
                      <span className="arabic" style={{ fontSize:13, color:'#D4AF37' }}>{p.arabic}</span>
                    </div>
                    <div style={{ fontSize:10, color:'#4a6355' }}>Surahs {p.startSurah}–{p.endSurah}</div>
                  </div>
                </button>
              )) : (
                <>
                  <button onClick={() => setSelectedParah(null)} style={{ width:'100%', padding:'10px 14px', background:'rgba(212,175,55,0.08)', border:'none', borderBottom:'1px solid rgba(212,175,55,0.15)', cursor:'pointer', textAlign:'left', color:'#D4AF37', fontSize:12, fontWeight:600 }}>← All Parahs</button>
                  <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(46,139,87,0.1)' }}>
                    <div className="arabic" style={{ fontSize:16, color:'#D4AF37', marginBottom:4 }}>{selectedParah.arabic}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:'white', marginBottom:10 }}>Parah {selectedParah.num} — {selectedParah.name}</div>
                    <button onClick={() => { if(playingParah?.num===selectedParah.num&&playing) stopAll(); else { startParah(selectedParah); setDrawerOpen(false); }}} style={{ width:'100%', padding:'10px', background:'linear-gradient(135deg,#B7950B,#D4AF37)', border:'none', borderRadius:10, cursor:'pointer', color:'#0a1a0f', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                      {loading ? <><Loader size={12} style={{ animation:'spin 1s linear infinite' }}/> Loading...</> : playingParah?.num===selectedParah.num&&playing ? <><Pause size={12}/> Stop</> : <><Play size={12}/> Play Full Parah</>}
                    </button>
                  </div>
                  {getParahSurahs(selectedParah.num).map(s => {
                    const isCur=selected?.number===s.number&&S.current.isParah;
                    const lbl=getParahSurahLabel(selectedParah,s.number);
                    return (
                      <button key={s.number} onClick={() => { stopAll(); S.current.isParah=false; setSelected(s); setDrawerOpen(false); }} style={{ width:'100%', padding:'10px 14px', background: isCur?'rgba(212,175,55,0.1)':'transparent', border:'none', borderLeft: isCur?'3px solid #D4AF37':'3px solid transparent', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:28, height:28, flexShrink:0, background: isCur?'rgba(212,175,55,0.25)':'rgba(46,139,87,0.08)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color: isCur?'#D4AF37':'#4a6355' }}>{s.number}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', justifyContent:'space-between' }}>
                            <span style={{ fontSize:12, fontWeight:600, color: isCur?'#f5d060':'#c0d4c8' }}>{s.englishName}</span>
                            <span className="arabic" style={{ fontSize:13, color:'#D4AF37' }}>{s.name}</span>
                          </div>
                          <div style={{ fontSize:10, color: lbl?'#D4AF37':'#4a6355' }}>{lbl?`📍 ${lbl}`:`${s.numberOfAyahs} ayats`}</div>
                        </div>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── DESKTOP: Sidebar ── */}
      {!isMobile && (
        <div style={{ width:300, borderRight:'1px solid rgba(46,139,87,0.15)', display:'flex', flexDirection:'column', background:'#080f0a', flexShrink:0 }}>
          <div style={{ padding:'14px', borderBottom:'1px solid rgba(46,139,87,0.1)', flexShrink:0 }}>
            <h1 style={{ fontSize:16, fontWeight:800, marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
              <BookOpen size={16} color="#D4AF37"/> القرآن الكريم
            </h1>
            <div style={{ display:'flex', gap:6, marginBottom:10, background:'rgba(46,139,87,0.08)', borderRadius:10, padding:4 }}>
              {['surah','parah'].map(t => (
                <button key={t} onClick={() => { setActiveTab(t); setSelectedParah(null); }} style={{ flex:1, padding:'7px', borderRadius:7, border:'none', background: activeTab===t ? 'rgba(46,139,87,0.35)' : 'transparent', color: activeTab===t ? 'white' : '#4a6355', fontSize:12, fontWeight: activeTab===t ? 600 : 400, cursor:'pointer' }}>
                  {t === 'surah' ? '📖 Surah' : '📚 Parah'}
                </button>
              ))}
            </div>
            {activeTab === 'surah' && (
              <div style={{ position:'relative' }}>
                <Search size={12} color="#4a6355" style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)' }}/>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search surah..."
                  style={{ width:'100%', padding:'8px 10px 8px 30px', background:'rgba(46,139,87,0.08)', border:'1px solid rgba(46,139,87,0.2)', borderRadius:8, color:'white', fontSize:12, outline:'none', fontFamily:'inherit' }}/>
              </div>
            )}
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {loadingSurahs ? (
              <div style={{ padding:40, textAlign:'center' }}>
                <Loader size={22} color="#2E8B57" style={{ animation:'spin 1s linear infinite' }}/>
                <p style={{ color:'#4a6355', fontSize:11, marginTop:10 }}>Loading Quran...</p>
              </div>
            ) : activeTab === 'surah' ? filtered.map(s => {
              const isA = selected?.number === s.number && !S.current.isParah;
              return (
                <button key={s.number} onClick={() => { stopAll(); S.current.isParah=false; setSelected(s); }} style={{ width:'100%', padding:'10px 14px', background: isA?'rgba(27,107,58,0.2)':'transparent', border:'none', borderLeft: isA?'3px solid #2E8B57':'3px solid transparent', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:10 }}
                  onMouseEnter={e => { if(!isA) e.currentTarget.style.background='rgba(46,139,87,0.06)'; }}
                  onMouseLeave={e => { if(!isA) e.currentTarget.style.background='transparent'; }}
                >
                  <div style={{ width:30, height:30, flexShrink:0, background: isA?'rgba(46,139,87,0.3)':'rgba(46,139,87,0.08)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color: isA?'#3aad6e':'#4a6355' }}>{s.number}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontSize:12, fontWeight:600, color: isA?'white':'#c0d4c8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:100 }}>{s.englishName}</span>
                      <span className="arabic" style={{ fontSize:13, color:'#D4AF37' }}>{s.name}</span>
                    </div>
                    <div style={{ fontSize:10, color:'#4a6355', marginTop:1 }}>{s.numberOfAyahs} ayats · {s.revelationType}</div>
                  </div>
                </button>
              );
            }) : selectedParah === null ? PARAHS.map(p => {
              const isP = playingParah?.num === p.num;
              return (
                <button key={p.num} onClick={() => setSelectedParah(p)} style={{ width:'100%', padding:'12px 14px', background: isP?'rgba(212,175,55,0.1)':'transparent', border:'none', borderLeft: isP?'3px solid #D4AF37':'3px solid transparent', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:10 }}
                  onMouseEnter={e => { if(!isP){ e.currentTarget.style.background='rgba(212,175,55,0.06)'; e.currentTarget.style.borderLeftColor='#D4AF37'; }}}
                  onMouseLeave={e => { if(!isP){ e.currentTarget.style.background='transparent'; e.currentTarget.style.borderLeftColor='transparent'; }}}
                >
                  <div style={{ width:34, height:34, flexShrink:0, background: isP?'rgba(212,175,55,0.25)':'rgba(212,175,55,0.1)', borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize: isP?16:11, fontWeight:800, color:'#D4AF37' }}>{isP&&playing?'▶':p.num}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontSize:12, fontWeight:600, color: isP?'#f5d060':'#c0d4c8', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:110 }}>{p.name}</span>
                      <span className="arabic" style={{ fontSize:13, color:'#D4AF37' }}>{p.arabic}</span>
                    </div>
                    <div style={{ fontSize:10, color:'#4a6355', marginTop:1 }}>Parah {p.num} · {p.startSurah}–{p.endSurah}</div>
                  </div>
                </button>
              );
            }) : (
              <>
                <button onClick={() => setSelectedParah(null)} style={{ width:'100%', padding:'10px 14px', background:'rgba(212,175,55,0.08)', border:'none', borderBottom:'1px solid rgba(212,175,55,0.15)', cursor:'pointer', textAlign:'left', color:'#D4AF37', fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>← All Parahs</button>
                <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(46,139,87,0.1)' }}>
                  <div className="arabic" style={{ fontSize:16, color:'#D4AF37', marginBottom:4 }}>{selectedParah.arabic}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:'white', marginBottom:10 }}>Parah {selectedParah.num} — {selectedParah.name}</div>
                  <button onClick={() => { if(playingParah?.num===selectedParah.num&&playing) stopAll(); else startParah(selectedParah); }} style={{ width:'100%', padding:'10px', background:'linear-gradient(135deg,#B7950B,#D4AF37)', border:'none', borderRadius:10, cursor:'pointer', color:'#0a1a0f', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                    {loading ? <><Loader size={12} style={{ animation:'spin 1s linear infinite' }}/> Loading...</> : playingParah?.num===selectedParah.num&&playing ? <><Pause size={12}/> Stop Parah</> : <><Play size={12}/> ▶ Play Full Parah</>}
                  </button>
                </div>
                {getParahSurahs(selectedParah.num).map(s => {
                  const isCur=selected?.number===s.number&&S.current.isParah;
                  const lbl=getParahSurahLabel(selectedParah,s.number);
                  return (
                    <button key={s.number} onClick={() => { stopAll(); S.current.isParah=false; setSelected(s); }} style={{ width:'100%', padding:'10px 14px', background: isCur?'rgba(212,175,55,0.1)':'transparent', border:'none', borderLeft: isCur?'3px solid #D4AF37':'3px solid transparent', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:28, height:28, flexShrink:0, background: isCur?'rgba(212,175,55,0.25)':'rgba(46,139,87,0.08)', borderRadius:7, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color: isCur?'#D4AF37':'#4a6355' }}>{s.number}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', justifyContent:'space-between' }}>
                          <span style={{ fontSize:12, fontWeight:600, color: isCur?'#f5d060':'#c0d4c8' }}>{s.englishName}</span>
                          <span className="arabic" style={{ fontSize:13, color:'#D4AF37' }}>{s.name}</span>
                        </div>
                        <div style={{ fontSize:10, color: lbl?'#D4AF37':'#4a6355' }}>{lbl?`📍 ${lbl}`:`${s.numberOfAyahs} ayats`}</div>
                      </div>
                      {isCur&&playing&&<div style={{ display:'flex', gap:2 }}>{[0,1,2].map(i=><div key={i} style={{ width:3, height:12, background:'#D4AF37', borderRadius:2, animation:`pulse 0.8s ease ${i*0.2}s infinite` }}/>)}</div>}
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: playing ? 80 : 0 }}>
        {!selected ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="arabic" style={{ fontSize: 52, color: '#D4AF37', marginBottom: 16 }}>﷽</div>
            <p style={{ fontSize: 14, color: '#4a6355', marginBottom: 8 }}>Select a Surah or Parah to begin</p>
            <p className="arabic" style={{ fontSize: 17, color: '#2E8B57', marginBottom: 20 }}>اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</p>
            {isMobile && (
              <button onClick={() => setDrawerOpen(true)} style={{ background: 'linear-gradient(135deg,#1B6B3A,#2E8B57)', color: 'white', border: 'none', borderRadius: 50, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><rect width="16" height="2" rx="1" fill="white"/><rect y="5" width="16" height="2" rx="1" fill="white"/><rect y="10" width="16" height="2" rx="1" fill="white"/></svg>
                Browse Surahs & Parahs
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ background: 'linear-gradient(135deg, #0f3d22, #1B6B3A, #0a2e1a)', padding: isMobile ? '12px 16px' : '18px 24px', borderBottom: '1px solid rgba(212,175,55,0.15)', position: 'sticky', top: 0, zIndex: 10 }}>
              {/* Mobile hamburger */}
              {isMobile && (
                <button onClick={() => setDrawerOpen(true)} style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 9, padding: '7px 12px', cursor: 'pointer', color: '#D4AF37', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600 }}>
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><rect width="16" height="2" rx="1" fill="#D4AF37"/><rect y="5" width="16" height="2" rx="1" fill="#D4AF37"/><rect y="10" width="16" height="2" rx="1" fill="#D4AF37"/></svg>
                  {activeTab === 'surah' ? (selected ? selected.englishName : 'Select Surah') : (selectedParah ? `Parah ${selectedParah.num}` : 'Select Parah')}
                </button>
              )}
              {playingParah && (
                <div style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 8, padding: '5px 12px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 2 }}>{[0,1,2].map(i => <div key={i} style={{ width: 3, height: 10, background: '#D4AF37', borderRadius: 2, animation: `pulse 1s ease ${i*0.2}s infinite` }} />)}</div>
                  <span style={{ fontSize: 11, color: '#D4AF37', fontWeight: 600 }}>Playing Parah {playingParah.num} — {playingParah.name}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <div className="arabic" style={{ fontSize: 22, color: '#f5d060', fontWeight: 700 }}>{selected.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{selected.englishName} — {selected.englishNameTranslation}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{selected.numberOfAyahs} Ayats · {selected.revelationType}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  {/* Display lang */}
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: 3 }}>
                    {[{v:'english',l:'EN'},{v:'urdu',l:'اردو'},{v:'both',l:'Both'}].map(({v,l}) => (
                      <button key={v} onClick={() => setDisplayLang(v)} style={{ background: displayLang === v ? 'rgba(46,139,87,0.4)' : 'transparent', border: 'none', borderRadius: 6, padding: '5px 9px', color: displayLang === v ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 11, fontWeight: displayLang === v ? 600 : 400 }}>{l}</button>
                    ))}
                  </div>
                  {/* Translation voice lang */}
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: 3 }}>
                    {[{v:'english',l:'🗣 EN'},{v:'urdu',l:'🗣 UR'}].map(({v,l}) => (
                      <button key={v} onClick={() => { setTransLang(v); S.current.transLang = v; }} style={{ background: transLang === v ? 'rgba(142,68,173,0.4)' : 'transparent', border: 'none', borderRadius: 6, padding: '5px 9px', color: transLang === v ? '#c39bd3' : 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 11, fontWeight: transLang === v ? 600 : 400 }}>{l}</button>
                    ))}
                  </div>
                  {/* Play buttons */}
                  {!playingParah ? (
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button onClick={() => { if (playing && playMode === 'ayat') stopAll(); else startSurah('ayat'); }} style={{ background: playing && playMode === 'ayat' ? 'rgba(212,175,55,0.2)' : 'rgba(46,139,87,0.3)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 50, padding: '7px 14px', color: 'white', cursor: 'pointer', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                        {playing && playMode === 'ayat' ? <><Pause size={11}/> Pause</> : <><Play size={11}/> Play Surah</>}
                      </button>
                      <button onClick={() => { if (playing && playMode === 'with-translation') stopAll(); else startSurah('with-translation'); }} style={{ background: playing && playMode === 'with-translation' ? 'rgba(142,68,173,0.3)' : 'rgba(0,0,0,0.3)', border: '1px solid rgba(142,68,173,0.3)', borderRadius: 50, padding: '7px 14px', color: playing && playMode === 'with-translation' ? '#c39bd3' : 'rgba(255,255,255,0.55)', cursor: 'pointer', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Languages size={11}/>{playing && playMode === 'with-translation' ? ' Pause +T' : ' Play + Translation'}
                      </button>
                    </div>
                  ) : (
                    <button onClick={stopAll} style={{ background: 'rgba(231,76,60,0.2)', border: '1px solid rgba(231,76,60,0.4)', borderRadius: 50, padding: '7px 14px', color: '#e74c3c', cursor: 'pointer', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Pause size={11}/> Stop Parah
                    </button>
                  )}
                </div>
              </div>
            </div>

            {selected.number !== 9 && (
              <div style={{ textAlign: 'center', padding: '18px 26px 4px' }}>
                <div className="arabic" style={{ fontSize: 22, color: '#D4AF37', fontWeight: 600 }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
              </div>
            )}

            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 12 }}>
                <Loader size={26} color="#2E8B57" style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#4a6355', fontSize: 13 }}>Loading {selected.englishName}...</p>
              </div>
            ) : (
              <div style={{ padding: '10px 26px 40px' }}>
                {ayats.map((ayat, i) => {
                  const isPlaying = currentAyat === ayat.numberInSurah && playing;
                  return (
                    <div key={`${selected.number}-${ayat.numberInSurah}`} style={{ background: isPlaying ? 'rgba(27,107,58,0.15)' : 'var(--dark-card)', border: `1px solid ${isPlaying ? 'rgba(46,139,87,0.4)' : 'rgba(46,139,87,0.08)'}`, borderRadius: 14, padding: '16px 20px', marginBottom: 9, transition: 'background 0.3s, border-color 0.3s', animation: 'fadeInUp 0.35s ease forwards', animationDelay: `${Math.min(i*0.02,0.3)}s`, opacity: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ width: 26, height: 26, background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#D4AF37' }}>{ayat.numberInSurah}</div>
                        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                          {isPlaying && <div style={{ display: 'flex', gap: 2 }}>{[0,1,2].map(j => <div key={j} style={{ width: 3, height: 12, background: '#3aad6e', borderRadius: 2, animation: `pulse 0.8s ease ${j*0.15}s infinite` }} />)}</div>}
                          {!S.current.isParah && (
                            <>
                              {ayat.numberInSurah > 1 && <button onClick={() => { stopAll(); setTimeout(() => { S.current = {...S.current, stopped: false, active: true, isParah: false, surahsData: [{surahNumber: selected.number, surahInfo: selected, ayahs: ayats, enTrans: translations, urTrans: urduTrans}], sIdx: 0, aNum: ayat.numberInSurah-1}; playAyatItem(0, ayat.numberInSurah-1); }, 80); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a6355' }}><SkipBack size={12}/></button>}
                              <button onClick={() => { if (isPlaying) stopAll(); else { stopAll(); setTimeout(() => { S.current = {...S.current, stopped: false, active: true, isParah: false, surahsData: [{surahNumber: selected.number, surahInfo: selected, ayahs: ayats, enTrans: translations, urTrans: urduTrans}], sIdx: 0, aNum: ayat.numberInSurah}; playAyatItem(0, ayat.numberInSurah); }, 80); }}} style={{ background: isPlaying ? 'rgba(46,139,87,0.25)' : 'rgba(46,139,87,0.1)', border: '1px solid rgba(46,139,87,0.2)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#3aad6e', display: 'flex', alignItems: 'center', gap: 3 }}>
                                {audioLoading && currentAyat === ayat.numberInSurah ? <Loader size={11} style={{ animation: 'spin 1s linear infinite' }} /> : isPlaying ? <Pause size={11}/> : <Volume2 size={11}/>}
                              </button>
                              {ayat.numberInSurah < ayats.length && <button onClick={() => { stopAll(); setTimeout(() => { S.current = {...S.current, stopped: false, active: true, isParah: false, surahsData: [{surahNumber: selected.number, surahInfo: selected, ayahs: ayats, enTrans: translations, urTrans: urduTrans}], sIdx: 0, aNum: ayat.numberInSurah+1}; playAyatItem(0, ayat.numberInSurah+1); }, 80); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a6355' }}><SkipForward size={12}/></button>}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="arabic" style={{ fontSize: 22, color: 'white', lineHeight: 2.2, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgba(46,139,87,0.08)' }}>{ayat.text}</div>
                      {(displayLang === 'english' || displayLang === 'both') && translations[i] && (
                        <div style={{ fontSize: 13, color: isPlaying ? '#c0d4c8' : '#7a9585', lineHeight: 1.75, fontStyle: 'italic', marginBottom: displayLang === 'both' ? 6 : 0, transition: 'color 0.3s' }}>{translations[i].text}</div>
                      )}
                      {(displayLang === 'urdu' || displayLang === 'both') && urduTrans[i] && (
                        <div className="arabic" style={{ fontSize: 14, color: isPlaying ? '#c0d4c8' : '#9db8ab', lineHeight: 2, transition: 'color 0.3s' }}>{urduTrans[i].text}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Audio Bar ── */}
      {playing && selected && (
        <div style={{ position: 'fixed', bottom: 0, left: 72, right: 0, background: playingParah ? 'linear-gradient(135deg, #3d2a00, #B7950B)' : playMode === 'with-translation' ? 'linear-gradient(135deg, #1a0033, #6B2FA0)' : 'linear-gradient(135deg, #0f3d22, #1B6B3A)', border: '1px solid rgba(212,175,55,0.2)', padding: '11px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 200, boxShadow: '0 -8px 32px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {playMode === 'with-translation' ? <Languages size={15} color="#c39bd3"/> : <Volume2 size={15} color="#D4AF37"/>}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>
                {playingParah ? `📚 Parah ${playingParah.num} — ${selected.englishName} — Ayat ${currentAyat}` : `${selected.englishName} — Ayat ${currentAyat}`}
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>
                {playingParah ? `${playingParah.name} · Auto-continues 🔄` : playMode === 'with-translation' ? `Arabic ▶ then ${transLang === 'urdu' ? 'Urdu 🗣' : 'English 🗣'} translation` : 'Mishary Rashid Alafasy'}
              </div>
            </div>
          </div>
          <button onClick={stopAll} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 7, padding: '7px 16px', cursor: 'pointer', color: 'white', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Pause size={12}/> Stop
          </button>
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}