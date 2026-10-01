import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory cache for ultra-fast instant audio responses
const serverTtsCache = new Map<string, string>();

// API route for high-fidelity Vietnamese text-to-speech
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text required' });
    }

    const cleanText = text.trim();

    if (serverTtsCache.has(cleanText)) {
      return res.json({ audio: serverTtsCache.get(cleanText) });
    }

    // 1. Try Gemini 3.8 Flash Lite TTS with Vietnamese voice
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Đọc to bằng giọng tiếng Việt tự nhiên, ấm áp, nhiệt huyết cổ vũ tinh thần: "${cleanText}"`,
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          const audioUri = `data:audio/wav;base64,${base64Audio}`;
          serverTtsCache.set(cleanText, audioUri);
          return res.json({ audio: audioUri });
        }
      } catch (geminiErr) {
        console.warn('Gemini TTS attempt error, trying fallback:', geminiErr);
      }
    }

    // 2. High-reliability native Vietnamese TTS fallback
    try {
      const encoded = encodeURIComponent(cleanText);
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encoded}`;
      const ttsRes = await fetch(ttsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          'Referer': 'https://translate.google.com/',
        },
      });

      if (ttsRes.ok) {
        const arrayBuffer = await ttsRes.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const audioUri = `data:audio/mp3;base64,${base64}`;
        serverTtsCache.set(cleanText, audioUri);
        return res.json({ audio: audioUri });
      }
    } catch (fetchErr) {
      console.warn('Google TTS fetch error:', fetchErr);
    }

    return res.status(500).json({ error: 'TTS generation unavailable' });
  } catch (err) {
    console.error('Server error in /api/tts:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

start();
