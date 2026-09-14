let currentApiKey: string | null = null;

export const runtimeApiKey = {
    set(key: string) {
        currentApiKey = key.trim();
    },

    get() {
        return currentApiKey;
    },

    clear() {
        currentApiKey = null;
    },
};