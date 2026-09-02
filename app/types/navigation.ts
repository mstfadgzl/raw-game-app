// app/types/navigation.ts

// 1. Home sekmesi içindeki ekranlar
export type HomeStackParamList = {
    HomeScreen: undefined;
    GameDetail: { gameId: number; gameName: string };
};

// 2. Search sekmesi içindeki ekranlar
export type SearchStackParamList = {
    SearchScreen: undefined;
    GameDetail: { gameId: number; gameName: string };
};

// 3. Alt Menü (Bottom Tab) Yapısı
export type BottomTabParamList = {
    HomeTab: undefined;
    SearchTab: undefined;
    FavoritesTab: undefined;
};

// 4. En dıştaki Ana Yapı
export type AppStackParamList = {
    Main: undefined; // BottomTab'ı kapsar
    Auth: undefined; // Giriş yapısı gerekirse
};