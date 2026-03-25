import axios from 'axios';

// ✅ Groq API — Free, Fast, Great for Islamic Q&A
// Get your free key at: https://console.groq.com
const GROQ_KEY = process.env.REACT_APP_GROQ_KEY || '';
const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are IslamIQ Assistant — a knowledgeable, respectful Islamic AI assistant.

Your role:
- Answer questions about Islam, Quran, Hadith, Islamic history, Fiqh, and daily Islamic life
- Provide answers based on authentic Quran and Hadith sources
- Be respectful, kind, and use Islamic greetings when appropriate
- When quoting Quran, mention the Surah name and ayat number
- When quoting Hadith, mention the source (Bukhari, Muslim, etc.)
- For Fiqh (Islamic law) questions, mention different scholarly opinions when relevant
- Always encourage consulting a qualified Islamic scholar for complex religious matters
- Respond in the same language the user writes in (English or Urdu)
- Keep answers clear, accurate and beneficial

Topics you can help with:
✅ Quran meaning, tafsir, recitation
✅ Hadith explanation and authenticity  
✅ Prayer (Salah), Fasting, Zakat, Hajj
✅ Islamic history and Prophet's life (Seerah)
✅ Daily duas and Islamic etiquette
✅ Halal/Haram questions
✅ Islamic finance basics
✅ Marriage and family in Islam
✅ Aqeedah (Islamic beliefs)

Do NOT answer:
❌ Non-Islamic topics unrelated to the question
❌ Political controversies
❌ Questions that disrespect Islam or the Prophet ﷺ

Always end responses with "Allahu Akbar" or a relevant dua when appropriate.`;

export const sendMessage = async (messages) => {
  const res = await axios.post(
    GROQ_BASE,
    {
      model:       'llama-3.3-70b-versatile', // Best free model on Groq
      messages:    [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
      max_tokens:  1024,
      temperature: 0.7,
      stream:      false,
    },
    {
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type':  'application/json',
      }
    }
  );
  return res.data.choices[0].message.content;
};

export const SUGGESTED_QUESTIONS = [
  { text: 'What is the meaning of Surah Al-Fatiha?',     icon: '📖' },
  { text: 'How to perform Wudu (ablution)?',              icon: '💧' },
  { text: 'What are the 5 pillars of Islam?',             icon: '🕌' },
  { text: 'Tell me about Prophet Muhammad ﷺ',            icon: '🌟' },
  { text: 'What does Islam say about kindness?',          icon: '💚' },
  { text: 'Dua for anxiety and stress',                   icon: '🤲' },
  { text: 'Is music halal or haram in Islam?',            icon: '🎵' },
  { text: 'How to make Tawbah (repentance)?',             icon: '🕋' },
];