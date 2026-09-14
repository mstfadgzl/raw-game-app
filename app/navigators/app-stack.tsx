import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '@types';
import { BottomTabStack } from './bottom-tab-stack';
import { VideoScreen } from '../components/video-player';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={BottomTabStack} options={{ orientation: 'portrait' }} />
        <Stack.Screen name="Video" component={VideoScreen} options={{ animation: 'fade', gestureEnabled: false, orientation: 'portrait', statusBarHidden: true, navigationBarHidden: true, contentStyle: { backgroundColor: '#080B10' } }} />
    </Stack.Navigator>
);
