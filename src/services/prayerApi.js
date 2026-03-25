import axios from 'axios';

const BASE = 'https://api.aladhan.com/v1';

// Get prayer times by coordinates
export const getPrayerTimesByCoords = async (lat, lng, method = 1) => {
  const date = new Date();
  const d    = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
  const res  = await axios.get(`${BASE}/timings/${d}`, {
    params: { latitude: lat, longitude: lng, method }
  });
  return res.data.data;
};

// Get prayer times by city name
export const getPrayerTimesByCity = async (city, country, method = 1) => {
  const date = new Date();
  const d    = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
  const res  = await axios.get(`${BASE}/timingsByCity/${d}`, {
    params: { city, country, method }
  });
  return res.data.data;
};

// Get full month prayer times
export const getMonthlyTimes = async (lat, lng, method = 1) => {
  const now = new Date();
  const res = await axios.get(`${BASE}/calendar/${now.getFullYear()}/${now.getMonth()+1}`, {
    params: { latitude: lat, longitude: lng, method }
  });
  return res.data.data;
};

// Calculation methods
export const METHODS = [
  { id: 1,  name: 'University of Islamic Sciences, Karachi' },
  { id: 2,  name: 'Islamic Society of North America (ISNA)'  },
  { id: 3,  name: 'Muslim World League'                       },
  { id: 4,  name: 'Umm Al-Qura University, Makkah'           },
  { id: 5,  name: 'Egyptian General Authority of Survey'      },
  { id: 18, name: 'Gulf Region'                               },
];

// Prayer info
export const PRAYERS = [
  { key: 'Fajr',    name: 'Fajr',    arabic: 'الفجر',  urdu: 'فجر',    icon: '🌙', color: '#1A3A5C' },
  { key: 'Sunrise', name: 'Sunrise', arabic: 'الشروق', urdu: 'طلوع',   icon: '🌅', color: '#8B4513', notif: false },
  { key: 'Dhuhr',   name: 'Dhuhr',   arabic: 'الظهر',  urdu: 'ظہر',    icon: '☀️', color: '#B7950B' },
  { key: 'Asr',     name: 'Asr',     arabic: 'العصر',  urdu: 'عصر',    icon: '🌤', color: '#1B6B3A' },
  { key: 'Maghrib', name: 'Maghrib', arabic: 'المغرب', urdu: 'مغرب',   icon: '🌆', color: '#8E44AD' },
  { key: 'Isha',    name: 'Isha',    arabic: 'العشاء', urdu: 'عشاء',   icon: '🌙', color: '#1A3A5C' },
];