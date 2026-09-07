import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { NavigatorScreenParams } from '@react-navigation/native';

/**
 * 1. PARAMETRE LİSTELERİ
 */

export type HomeStackParamList = {
    DiscoveryScreen: undefined;
    GameDetail: { gameId: number | string; gameName: string };
    PlatformDetail: { id: number; name: string };
    DiscoverMain: { id: number; name: string };
    GenreDetail: { slug: string; name: string; };
};

export type DiscoverStackParamList = {
    DiscoverMain: undefined;
    PlatformDetail: { id: number; name: string };
    TagDetail: { slug: string; name: string };
    GenreDetail: { slug: string; name: string };
    CreatorDetail: { id: number; name: string };
    DeveloperDetail: { id: number; name: string };
    GameDetail: { gameId: number | string; gameName: string };
};

export type SearchStackParamList = {
    SearchScreen: undefined;
    GameDetail: { gameId: number | string; gameName: string };
};

export type LibraryStackParamList = {
    LibraryScreen: undefined;
    GameDetail: { gameId: number | string; gameName: string };
};

export type BottomTabParamList = {
    HomeTab: NavigatorScreenParams<HomeStackParamList>;
    DiscoverTab: NavigatorScreenParams<DiscoverStackParamList>;
    SearchTab: NavigatorScreenParams<SearchStackParamList>;
    LibraryTab: NavigatorScreenParams<LibraryStackParamList>;
};

export type AppStackParamList = {
    Main: undefined; // BottomTab'ı kapsar
    Auth: undefined;
};

/**
 * 2. PROFESYONEL NAVİGASYON PROPS (Burası Hatayı Çözer)
 */

// DiscoveryScreen içinde kullanılacak en güçlü navigasyon tipi
// Bu tip sayesinde hem Home içindeki ekranları hem de diğer Tab'leri görebilirsin.
export type DiscoveryScreenNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<HomeStackParamList>,
    BottomTabNavigationProp<BottomTabParamList>
>;

// Diğer ekranlar için de benzer yapı:
export type DiscoverMainNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<DiscoverStackParamList>,
    BottomTabNavigationProp<BottomTabParamList>
>;

// Herhangi bir ekranda her yere gitme yetkisi veren genel tip
export type GenericNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<HomeStackParamList & DiscoverStackParamList & SearchStackParamList & LibraryStackParamList>,
    BottomTabNavigationProp<BottomTabParamList>
>;

/**
 * 3. ROUTE PROPS
 */
export type TagDetailRouteProp = RouteProp<DiscoverStackParamList, 'TagDetail'>;
export type DeveloperDetailRouteProp = RouteProp<DiscoverStackParamList, 'DeveloperDetail'>;
export type GameDetailRouteProp = RouteProp<HomeStackParamList, 'GameDetail'>;
export type PlatformDetailRouteProp = RouteProp<DiscoverStackParamList, 'PlatformDetail'>;
export type GenreDetailRouteProp = RouteProp<DiscoverStackParamList, 'GenreDetail'>;
export type CreatorDetailRouteProp = RouteProp<DiscoverStackParamList, 'CreatorDetail'>;