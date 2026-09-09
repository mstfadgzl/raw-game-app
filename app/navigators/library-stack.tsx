import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LibraryStackParamList } from '@types';
import { CreatorDetailScreen, DeveloperDetailScreen, LibraryScreen, PlatformDetailScreen, TagDetailScreen, DetailScreen } from '@screens';

const Stack = createNativeStackNavigator<LibraryStackParamList>();

export const LibraryStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade_from_bottom', contentStyle: { backgroundColor: '#151515' } }}>
        <Stack.Screen name="LibraryScreen" component={LibraryScreen} />
        <Stack.Screen name="GameDetail" component={DetailScreen} />
        <Stack.Screen name="TagDetail" component={TagDetailScreen} />
        <Stack.Screen name="PlatformDetail" component={PlatformDetailScreen} />
        <Stack.Screen name="CreatorDetail" component={CreatorDetailScreen} />
        <Stack.Screen name="DeveloperDetail" component={DeveloperDetailScreen} />
        <Stack.Screen name="PublisherDetail" component={DeveloperDetailScreen} />
    </Stack.Navigator>
);
