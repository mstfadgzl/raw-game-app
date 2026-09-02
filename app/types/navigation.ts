import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    Home: undefined;
    GameDetail: { gameId: number; gameName: string };
    Search: undefined;
    GenreDetail: { genreSlug: string; genreName: string };
};

// Hooklarda ve bileşenlerde kullanacağımız yardımcı tipler
export type MainStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Detay ekranında "route.params" alırken kullanacağımız tip
export type GameDetailRouteProp = RouteProp<RootStackParamList, 'GameDetail'>;