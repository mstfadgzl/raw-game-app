import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

/** 
 * 1. PARAMETRE LİSTELERİ 
 * Her bir stack'in içindeki ekranları ve bekledikleri dataları tanımlar.
 */

export type HomeStackParamList = {
    HomeScreen: undefined;
    GameDetail: { gameId: number; gameName: string };
};
export type DiscoveryStackParamList = {
    DiscoveryScreen: undefined;

}

export type SearchStackParamList = {
    SearchScreen: undefined;
    GameDetail: { gameId: number; gameName: string };
};

export type FavoritesStackParamList = {
    FavoritesScreen: undefined;
    GameDetail: { gameId: number; gameName: string };
};

export type BottomTabParamList = {
    HomeTab: undefined;   // HomeStack'i kapsar
    SearchTab: undefined; // SearchStack'i kapsar
    FavoritesTab: undefined;
};

export type AppStackParamList = {
    Main: undefined; // BottomTabStack'i kapsar
    Auth: undefined;
};

/** 
 * 2. NAVİGASYON PROPS (useNavigation için)
 * Ekranların içinde "navigation.navigate" dediğinde çıkan seçenekleri belirler.
 */

// Genel/Ortak Navigasyon Tipi (Hangi stack'te olursan ol detaylara gitmeni sağlar)
export type MainStackNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

// HomeScreen için: Hem kendi stack'inde gezebilir hem Tab değiştirebilir
export type HomeScreenNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>,
    BottomTabNavigationProp<BottomTabParamList>
>;

// SearchScreen için:
export type SearchScreenNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<SearchStackParamList, 'SearchScreen'>,
    BottomTabNavigationProp<BottomTabParamList>
>;

// GameDetail için:
export type GameDetailNavigationProp = NativeStackNavigationProp<
    HomeStackParamList,
    'GameDetail'
>;
// DiscoveryScreen için:
export type DiscoveryScreenNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<DiscoveryStackParamList, 'DiscoveryScreen'>,
    BottomTabNavigationProp<BottomTabParamList>
>;

/** 
 * 3. ROUTE PROPS (useRoute için)
 * Ekranlara gelen "params" değerlerini okumak için kullanılır.
 */

export type GameDetailRouteProp = RouteProp<HomeStackParamList, 'GameDetail'>;
export type SearchScreenRouteProp = RouteProp<SearchStackParamList, 'SearchScreen'>;