/* eslint-disable no-unused-vars */

const API_KEY  = process.env.REACT_APP_HADITH_KEY || '$2y$10$b4sdQMLnNGydvG8FyRPQLjA4P5ikBuq4kKmU8iA0Lz70uAH06Zq';
const BASE     = 'https://hadithapi.com/api';

export const HADITH_BOOKS = [
  { id:'sahih-bukhari', name:'Sahih Bukhari',  arabic:'صحيح البخاري', count:'7563', color:'#C9A84C', imam:'Imam Bukhari'  },
  { id:'sahih-muslim',  name:'Sahih Muslim',   arabic:'صحيح مسلم',    count:'7453', color:'#E8C97A', imam:'Imam Muslim'   },
  { id:'al-tirmidhi',   name:'At-Tirmidhi',    arabic:'سنن الترمذي',  count:'3956', color:'#C9A84C', imam:'Imam Tirmidhi' },
  { id:'abu-dawood',    name:'Abu Dawud',       arabic:'سنن أبي داود', count:'5274', color:'#E8C97A', imam:'Imam Abu Dawud'},
  { id:'ibn-e-majah',   name:'Ibn Majah',       arabic:'سنن ابن ماجه', count:'4341', color:'#C9A84C', imam:'Imam Ibn Majah'},
  { id:'sunan-nasai',   name:"An-Nasa'i",       arabic:'سنن النسائي',  count:'5761', color:'#E8C97A', imam:"Imam Nasa'i"  },
];

// ── Direct API call (works locally + on Vercel) ──────────────
const call = async (endpoint, params = {}) => {
  const query = new URLSearchParams({ apiKey: API_KEY, ...params }).toString();
  const url   = `${BASE}/${endpoint}?${query}`;

  try {
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      mode: 'cors',
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    // If CORS fails, try via proxy (Vercel production)
    if (window.location.hostname !== 'localhost') {
      const proxyQuery = new URLSearchParams({ endpoint, ...params }).toString();
      const proxyRes   = await fetch(`/api/hadith?${proxyQuery}`);
      if (!proxyRes.ok) throw new Error(`Proxy HTTP ${proxyRes.status}`);
      return await proxyRes.json();
    }
    throw e;
  }
};

export const getHadiths = (bookSlug, page = 1) =>
  call('hadiths', { book: bookSlug, paginate: 20, page });

export const getChapters = (bookSlug) =>
  call(`${bookSlug}/chapters`, { paginate: 200 });

export const getChapterHadiths = (bookSlug, chapterNum, page = 1) =>
  call('hadiths', { book: bookSlug, chapter: chapterNum, paginate: 20, page });

export const searchHadiths = (bookSlug, query, page = 1) =>
  call('hadiths', { book: bookSlug, hadithEnglish: query, paginate: 20, page });