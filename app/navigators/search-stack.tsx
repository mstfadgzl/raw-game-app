import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreatorDetailScreen, DeveloperDetailScreen, DetailScreen, SearchScreen } from "@screens";
import type { SearchStackParamList } from '@types';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export const SearchStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade_from_bottom', contentStyle: { backgroundColor: '#151515' } }}>
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="GameDetail" component={DetailScreen} />
        <Stack.Screen name="CreatorDetail" component={CreatorDetailScreen} />
        <Stack.Screen name="DeveloperDetail" component={DeveloperDetailScreen} />
    </Stack.Navigator>
);
