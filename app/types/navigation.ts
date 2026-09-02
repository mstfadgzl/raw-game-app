import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CompositeNavigationProp, RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

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
    HomeTab: undefined; // HomeStack'i kapsar
    SearchTab: undefined; // SearchStack'i kapsar
    FavoritesTab: undefined;
};

// 4. En dıştaki Ana Yapı
export type AppStackParamList = {
    Main: undefined; // BottomTabStack'i kapsar
    Auth: undefined;
};

// HomeScreen içinde kullanacağın navigasyon tipi
export type HomeScreenNavigationProp = NativeStackNavigationProp<
    HomeStackParamList,
    'HomeScreen'
>;

// Eğer hem HomeStack içinde gezip hem de sekmeler arası geçiş yapacaksan (Composite):
export type HomeTabCompositeNavigationProp = CompositeNavigationProp<
    NativeStackNavigationProp<HomeStackParamList>,
    BottomTabNavigationProp<BottomTabParamList>
>;