import axios from 'axios';

const GROQ_KEY = process.env.REACT_APP_GROQ_KEY || '';
const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions';

// Cache key format: mcq_{categoryId}_{date}
const today = () => new Date().toISOString().split('T')[0]; // "2025-03-15"

export const getDailyQuestions = async (category) => {
  const cacheKey = `mcq_daily_${category.id}_${today()}`;

  // ✅ Check cache first — don't regenerate if already fetched today
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.length > 0) {
        console.log(`Using cached questions for ${category.name}`);
        return parsed;
      }
    }
  } catch {}

  // Generate fresh questions from Groq
  console.log(`Generating new questions for ${category.name}...`);

  const prompt = `Generate exactly 10 multiple choice questions about "${category.name}" in Islam.

Rules:
- Questions must be factually accurate based on Quran, Hadith, and authentic Islamic sources
- Each question must have exactly 4 options (A, B, C, D)
- Only ONE answer is correct
- Include a brief explanation for the correct answer
- Questions should vary in difficulty (mix of easy, medium, hard)
- Do NOT repeat common questions — make them fresh and interesting
- Today's date is ${today()} — generate unique questions

Return ONLY a valid JSON array in this exact format, nothing else:
[
  {
    "q": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "Brief explanation of why this is correct."
  }
]

The "answer" field must be the index (0, 1, 2, or 3) of the correct option.
Generate questions about: ${category.name} (${category.arabic})`;

  const res = await axios.post(
    GROQ_BASE,
    {
      model:       'llama-3.3-70b-versatile',
      messages:    [{ role: 'user', content: prompt }],
      max_tokens:  2000,
      temperature: 0.8, // slightly higher for variety
    },
    {
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type':  'application/json',
      }
    }
  );

  const text = res.data.choices[0].message.content;

  // Parse JSON from response
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Invalid response format from AI');

  const questions = JSON.parse(jsonMatch[0]);

  // Validate questions
  const valid = questions.filter(q =>
    q.q && Array.isArray(q.options) && q.options.length === 4 &&
    typeof q.answer === 'number' && q.answer >= 0 && q.answer <= 3 &&
    q.explanation
  );

  if (valid.length < 5) throw new Error('Not enough valid questions generated');

  // Cache for today
  try { localStorage.setItem(cacheKey, JSON.stringify(valid)); } catch {}

  return valid;
};

// Clear old cache (keep only today's)
export const clearOldCache = () => {
  try {
    const t = today();
    Object.keys(localStorage)
      .filter(k => k.startsWith('mcq_daily_') && !k.includes(t))
      .forEach(k => localStorage.removeItem(k));
  } catch {}
};