import axios from 'axios';

export const translateText = async (text: string): Promise<string> => {
    if (!text) return '';
    try {
        const response = await axios.get(
            `https://api.mymemory.translated.net/get?q=${encodeHeight(text)}&langpair=en|tr`
        );
        return response.data.responseData.translateText || text;
    } catch (error) {
        console.error("Çeviri Hatası", error);
        return text;
    }
};

const encodeHeight = (text: string) => {
    return text.substring(0, 500);
};