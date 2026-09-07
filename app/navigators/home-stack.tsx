import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DetailScreen, DiscoverMainScreen, DiscoveryScreen, GenreDetailScreen, PlatformDetailScreen } from "@screens";
import { HomeStackParamList } from "@types";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DiscoveryScreen" component={DiscoveryScreen} />
        <Stack.Screen name="GameDetail" component={DetailScreen} />
        <Stack.Screen name="PlatformDetail" component={PlatformDetailScreen} />
        <Stack.Screen name="GenreDetail" component={GenreDetailScreen} />
        <Stack.Screen name="DiscoverMain" component={DiscoverMainScreen} />
    </Stack.Navigator>
);