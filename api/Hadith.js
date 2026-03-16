export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const API_KEY = '$2y$10$b4sdQMLnNGydvG8FyRPQLjA4P5ikBuq4kKmU8iA0Lz70uAH06Zq';
  const BASE = 'https://hadithapi.com/api';

  try {
    const { endpoint, ...params } = req.query;
    if (!endpoint) return res.status(400).json({ error: 'endpoint required' });

    const queryParams = new URLSearchParams({ ...params, apiKey: API_KEY }).toString();
    const url = `${BASE}/${endpoint}?${queryParams}`;

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
    });
    const text = await response.text();
    
    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch {
      return res.status(500).json({ error: 'Invalid JSON from hadithapi', raw: text.substring(0, 200) });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}