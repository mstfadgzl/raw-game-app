import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreatorDetailScreen, DeveloperDetailScreen, PlatformDetailScreen, TagDetailScreen, DetailScreen, SearchScreen } from "@screens";
import type { SearchStackParamList } from '@types';
import { useSettings } from '@hooks';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export const SearchStack = () => {
    const { colors } = useSettings();

    return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade_from_bottom', contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="GameDetail" component={DetailScreen} />
        <Stack.Screen name="CreatorDetail" component={CreatorDetailScreen} />
        <Stack.Screen name="DeveloperDetail" component={DeveloperDetailScreen} />
        <Stack.Screen name="TagDetail" component={TagDetailScreen} />
        <Stack.Screen name="PlatformDetail" component={PlatformDetailScreen} />
        <Stack.Screen name="PublisherDetail" component={DeveloperDetailScreen} />
    </Stack.Navigator>
    );
};
