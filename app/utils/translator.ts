import axios from 'axios';

const translationCache = new Map<string, string>();
const pending = new Map<string, Promise<string>>();
const MAX_ENTRIES = 40;

export const translateText = async (text: string): Promise<string> => {
    if (!text) return '';
    const cached = translationCache.get(text);
    if (cached) return cached;
    const running = pending.get(text);
    if (running) return running;

    // If the translation service is unavailable, keep the original description usable.
    const request = (async () => {
        try {
            const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
                params: { client: 'gtx', sl: 'en', tl: 'tr', dt: 't', q: text },
                timeout: 8000,
            });
            const segments: unknown = response.data?.[0];
            if (!Array.isArray(segments)) return text;
            const translated = segments.map(segment =>
                Array.isArray(segment) && typeof segment[0] === 'string' ? segment[0] : '',
            ).join('');
            if (!translated.trim()) return text;
            if (translationCache.size >= MAX_ENTRIES) {
                const oldest = translationCache.keys().next().value;
                if (oldest !== undefined) translationCache.delete(oldest);
            }
            translationCache.set(text, translated);
            return translated;
        } catch {
            return text;
        }
    })();
    pending.set(text, request);
    try { return await request; }
    finally { if (pending.get(text) === request) pending.delete(text); }
};
