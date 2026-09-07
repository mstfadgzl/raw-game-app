import axios from 'axios';

export const translateText = async (text: string): Promise<string> => {
    if (!text) return '';

    try {
        // Örnek ücretsiz çeviri isteği (Senin projendeki endpoint buradadır)
        const response = await axios.get('https://api.mymemory.translated.net/get', {
            params: {
                q: text.slice(0, 500), // API limitlerine takılmamak için metni ilk 500 karakterle sınırlandırıyoruz
                langpair: 'en|tr',
            },
        });

        const translated = response.data?.responseData?.translatedText;

        // Eğer API 429 veya boş dönerse orijinal metni ver
        if (!translated || response.data.responseStatus === 429) {
            return text;
        }

        return translated;
    } catch (error: any) {
        // 429 (Too Many Requests) veya başka bir ağ hatası aldığında sessizce orijinal metni döndür (Çöküşü engeller)
        if (error.response?.status === 429) {
            console.warn('Çeviri limiti aşıldı (429). Orijinal metin gösteriliyor.');
        } else {
            console.error('Çeviri hatası:', error.message);
        }
        return text;
    }
};