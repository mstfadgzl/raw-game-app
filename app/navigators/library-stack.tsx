import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LibraryStackParamList } from '@types';
import { LibraryScreen, DetailScreen } from '@screens';

const Stack = createNativeStackNavigator<LibraryStackParamList>();

export const LibraryStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LibraryScreen" component={LibraryScreen} />
        <Stack.Screen name="GameDetail" component={DetailScreen} />
    </Stack.Navigator>
);