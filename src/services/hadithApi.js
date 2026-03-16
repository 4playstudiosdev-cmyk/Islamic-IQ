/* eslint-disable no-unused-vars */

// ✅ Uses Vercel proxy to avoid CORS issues
const PROXY = '/api/hadith';

export const HADITH_BOOKS = [
  { id: 'sahih-bukhari', name: 'Sahih Bukhari',  arabic: 'صحيح البخاري', count: '7563', color: '#1B6B3A', imam: 'Imam Bukhari'  },
  { id: 'sahih-muslim',  name: 'Sahih Muslim',   arabic: 'صحيح مسلم',    count: '7453', color: '#1A5276', imam: 'Imam Muslim'   },
  { id: 'al-tirmidhi',   name: 'At-Tirmidhi',    arabic: 'سنن الترمذي',  count: '3956', color: '#B7950B', imam: 'Imam Tirmidhi' },
  { id: 'abu-dawood',    name: 'Abu Dawud',       arabic: 'سنن أبي داود', count: '5274', color: '#6D4C41', imam: 'Imam Abu Dawud'},
  { id: 'ibn-e-majah',   name: 'Ibn Majah',       arabic: 'سنن ابن ماجه', count: '4341', color: '#D35400', imam: 'Imam Ibn Majah'},
  { id: 'sunan-nasai',   name: "An-Nasa'i",       arabic: 'سنن النسائي',  count: '5761', color: '#8E44AD', imam: "Imam Nasa'i"  },
];

const call = async (endpoint, params = {}) => {
  const query = new URLSearchParams({ endpoint, ...params }).toString();
  const res = await fetch(`${PROXY}?${query}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
};

export const getHadiths = (bookSlug, page = 1) =>
  call('hadiths', { book: bookSlug, paginate: 20, page });

export const getChapters = (bookSlug) =>
  call(`${bookSlug}/chapters`, { paginate: 200 });

export const getChapterHadiths = (bookSlug, chapterNum, page = 1) =>
  call('hadiths', { book: bookSlug, chapter: chapterNum, paginate: 20, page });

export const searchHadiths = (bookSlug, query, page = 1) =>
  call('hadiths', { book: bookSlug, hadithEnglish: query, paginate: 20, page });