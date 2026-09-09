// Resize only known RAWG media URLs; signed and third-party URLs stay untouched.
export const cardImageUrl = (uri?: string | null): string => {
    if (!uri) return '';
    if (/[?#]/.test(uri)) return uri;
    return uri.replace(
        /^(https:\/\/media\.rawg\.io\/media\/)(?!resize\/|crop\/)/,
        '$1resize/420/-/',
    );
};
