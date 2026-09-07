import axios from 'axios';

const translationCache: { [key: string]: string } = {};

export const translateText = async (text: string): Promise<string> => {
    if (!text) return '';

    if (translationCache[text]) {
        return translationCache[text];
    }

    try {
        // Google'ın mobil/tarayıcılar için kullandığı güvenli public çeviri API'si
        const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
            params: {
                client: 'gtx',
                sl: 'en',
                tl: 'tr',
                dt: 't',
                q: text,
            },
            timeout: 8000,
        });

        // Google'ın döndürdüğü karmaşık dizi yapısından çevrilen metni güvenle çekiyoruz
        if (response.data && response.data[0]) {
            const translatedArray = response.data[0];
            let fullTranslation = '';

            translatedArray.forEach((item: any) => {
                if (item[0]) {
                    fullTranslation += item[0];
                }
            });

            if (fullTranslation.trim().length > 0) {
                translationCache[text] = fullTranslation;
                return fullTranslation;
            }
        }

        return text;
    } catch (error: any) {
        console.warn('Çeviri yapılırken hata oluştu, orijinal metin gösteriliyor:', error.message);
        return text;
    }
};