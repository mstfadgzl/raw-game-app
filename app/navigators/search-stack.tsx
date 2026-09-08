import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DetailScreen, SearchScreen } from "@screens";

const Stack = createNativeStackNavigator<any>();

export const SearchStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="GameDetail" component={DetailScreen} />
    </Stack.Navigator>
);