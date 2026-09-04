import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '@types';
import { BottomTabStack } from './bottom-tab-stack';
import { DiscoveryScreen } from '@screens';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Discovery" component={DiscoveryScreen}></Stack.Screen>
        {/* <Stack.Screen name="Main" component={BottomTabStack} /> */}
    </Stack.Navigator>
);