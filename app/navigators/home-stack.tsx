import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreatorDetailScreen, DeveloperDetailScreen, DetailScreen, DiscoverMainScreen, DiscoveryScreen, GenreDetailScreen, PlatformDetailScreen, TagDetailScreen } from "@screens";
import { HomeStackParamList } from "@types";
import { useSettings } from '@hooks';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => {
    const { colors } = useSettings();

    return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade_from_bottom', contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="DiscoveryScreen" component={DiscoveryScreen} />
        <Stack.Screen name="GameDetail" component={DetailScreen} />
        <Stack.Screen name="PlatformDetail" component={PlatformDetailScreen} />
        <Stack.Screen name="GenreDetail" component={GenreDetailScreen} />
        <Stack.Screen name="DiscoverMain" component={DiscoverMainScreen} />
        <Stack.Screen name="TagDetail" component={TagDetailScreen} />
        <Stack.Screen name="CreatorDetail" component={CreatorDetailScreen} />
        <Stack.Screen name="DeveloperDetail" component={DeveloperDetailScreen} />
        <Stack.Screen name="PublisherDetail" component={DeveloperDetailScreen} />

    </Stack.Navigator>
    );
};
