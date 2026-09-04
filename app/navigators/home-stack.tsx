import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DetailScreen, DiscoveryScreen } from "@screens";
import { HomeStackParamList } from "@types";
import { HomeScreen } from "@screens";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="DiscoveryScreen" component={DiscoveryScreen} />
        <Stack.Screen name="GameDetail" component={DetailScreen} />
    </Stack.Navigator>
);