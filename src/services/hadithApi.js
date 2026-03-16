import axios from 'axios';

const API_KEY = process.env.REACT_APP_HADITH_KEY || '$2y$10$b4sdQMLnNGydvG8FyRPQLjA4P5ikBuq4kKmU8iA0Lz70uAH06Zq';
const BASE    = 'https://hadithapi.com/api';

export const HADITH_BOOKS = [
  { id: 'sahih-bukhari', name: 'Sahih Bukhari',  arabic: 'صحيح البخاري', count: '7563', color: '#1B6B3A', imam: 'Imam Bukhari'  },
  { id: 'sahih-muslim',  name: 'Sahih Muslim',   arabic: 'صحيح مسلم',    count: '7453', color: '#1A5276', imam: 'Imam Muslim'   },
  { id: 'al-tirmidhi',   name: 'At-Tirmidhi',    arabic: 'سنن الترمذي',  count: '3956', color: '#B7950B', imam: 'Imam Tirmidhi' },
  { id: 'abu-dawood',    name: 'Abu Dawud',       arabic: 'سنن أبي داود', count: '5274', color: '#6D4C41', imam: 'Imam Abu Dawud'},
  { id: 'ibn-e-majah',   name: 'Ibn Majah',       arabic: 'سنن ابن ماجه', count: '4341', color: '#D35400', imam: 'Imam Ibn Majah'},
  { id: 'sunan-nasai',   name: "An-Nasa'i",       arabic: 'سنن النسائي',  count: '5761', color: '#8E44AD', imam: "Imam Nasa'i"  },
];

export const getHadiths = async (bookSlug, page = 1) => {
  const res = await axios.get(`${BASE}/hadiths`, {
    params: { apiKey: API_KEY, book: bookSlug, paginate: 20, page }
  });
  return res.data;
};

export const getChapters = async (bookSlug) => {
  const res = await axios.get(`${BASE}/${bookSlug}/chapters`, {
    params: { apiKey: API_KEY, paginate: 200 }
  });
  return res.data;
};

export const getChapterHadiths = async (bookSlug, chapterNum, page = 1) => {
  const res = await axios.get(`${BASE}/hadiths`, {
    params: { apiKey: API_KEY, book: bookSlug, chapter: chapterNum, paginate: 20, page }
  });
  return res.data;
};

export const searchHadiths = async (bookSlug, query, page = 1) => {
  const res = await axios.get(`${BASE}/hadiths`, {
    params: { apiKey: API_KEY, book: bookSlug, hadithEnglish: query, paginate: 20, page }
  });
  return res.data;
};