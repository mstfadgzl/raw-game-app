import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';

/**
 * 1. INDIVIDUAL STACK PARAM LISTS
 */

// Home Stack: Ana keşfet akışı
export type HomeStackParamList = {
    DiscoveryScreen: undefined;
    GameDetail: { gameId: number | string; gameName: string };
};

// Discover Stack: Kategoriler, Platformlar, Yapımcılar
export type DiscoverStackParamList = {
    DiscoverMain: undefined;
    PlatformDetail: { id: number; name: string };
    TagDetail: { slug: string; name: string };
    GenreDetail: { slug: string; name: string };
    CreatorDetail: { id: number; name: string };
    DeveloperDetail: { id: number; name: string };
    GameDetail: { gameId: number | string; gameName: string };
};

// Search Stack: Gelişmiş arama
export type SearchStackParamList = {
    SearchScreen: undefined;
    GameDetail: { gameId: number | string; gameName: string };
};

// Library Stack: Favoriler ve Koleksiyon
export type LibraryStackParamList = {
    LibraryScreen: undefined;
    GameDetail: { gameId: number | string; gameName: string };
};

/**
 * 2. BOTTOM TAB PARAM LIST
 */
export type BottomTabParamList = {
    HomeTab: undefined;     // HomeStack'i barındırır
    DiscoverTab: undefined; // DiscoverStack'i barındırır
    SearchTab: undefined;   // SearchStack'i barındırır
    LibraryTab: undefined;  // LibraryStack'i barındırır
};

/**
 * 3. ROOT APP STACK (En Dış Kapsayıcı)
 */
export type AppStackParamList = {
    Main: undefined; // BottomTabStack'i barındırır
    Auth: undefined; // Login/Register akışı gerekirse
};

/**
 * 4. PROFESSIONAL NAVIGATION PROPS (HOOKLAR İÇİN)
 * Bu tipler sayesinde 'navigation.navigate' dediğinde tüm uygulama haritası önünde olur.
 */

// Genel bir ekranın hem kendi stack'inde hem de tablar arasında gezebilmesini sağlar.
export type GenericNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<HomeStackParamList & DiscoverStackParamList & SearchStackParamList & LibraryStackParamList>,
    BottomTabNavigationProp<BottomTabParamList>
>;

// Spesifik ekran navigasyon tipleri
export type DiscoveryScreenNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<HomeStackParamList, 'DiscoveryScreen'>,
    BottomTabNavigationProp<BottomTabParamList>
>;

export type DiscoverMainNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<DiscoverStackParamList, 'DiscoverMain'>,
    BottomTabNavigationProp<BottomTabParamList>
>;

export type GameDetailNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'GameDetail'>;

/**
 * 5. ROUTE PROPS (PARAMETRE OKUMAK İÇİN)
*/
export type TagDetailRouteProp = RouteProp<DiscoverStackParamList, 'TagDetail'>;
export type DeveloperDetailRouteProp = RouteProp<DiscoverStackParamList, 'DeveloperDetail'>;
export type GameDetailRouteProp = RouteProp<HomeStackParamList, 'GameDetail'>;
export type PlatformDetailRouteProp = RouteProp<DiscoverStackParamList, 'PlatformDetail'>;
export type GenreDetailRouteProp = RouteProp<DiscoverStackParamList, 'GenreDetail'>;
export type CreatorDetailRouteProp = RouteProp<DiscoverStackParamList, 'CreatorDetail'>;