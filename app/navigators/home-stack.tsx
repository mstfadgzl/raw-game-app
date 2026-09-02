import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DetailScreen from "@screens/detail-screen";
import HomeScreen from "@screens/home-screen";
import { HomeStackParamList } from "@types";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => {
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="GameDetail" component={DetailScreen} />
    </Stack.Navigator>
};