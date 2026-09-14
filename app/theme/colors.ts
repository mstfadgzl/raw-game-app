export type ThemeColors = {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    error: string;
    warning: string;
    success: string;
    border: string;
    black: string;
    white: string;
    gray: string;
    gold: string;
};

export const darkColors: ThemeColors = {
    background: '#151515', // Ana koyu arka plan
    surface: '#202020',    // Kartlar ve yan paneller
    primary: '#64ffda',    // Aksan rengi (Neon yeşil/turkuaz - oyuncu ruhu)
    secondary: '#94a3b8',  // Yardımcı metinler
    text: '#FFFFFF',       // Ana metin
    error: '#ff4646',
    warning: '#ffb020',
    success: '#4caf50',
    border: '#333333',
    black: '#000000',
    white: '#FFFFFF',
    gray: '#808080',
    gold: '#FFD700',
};

export const lightColors: ThemeColors = {
    background: '#F4F7FB',
    surface: '#FFFFFF',
    primary: '#00796B',
    secondary: '#52606D',
    text: '#17202A',
    error: '#C62828',
    warning: '#A86400',
    success: '#2E7D32',
    border: '#D7E0E8',
    black: '#000000',
    white: '#FFFFFF',
    gray: '#718096',
    gold: '#B8860B',
};

// Static styles still import this dark palette. Components that support
// runtime theme changes use SettingsContext and the active palette directly.
export const colors = darkColors;
