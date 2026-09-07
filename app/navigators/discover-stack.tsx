import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DiscoverStackParamList } from '@types';
import {
  DiscoverMainScreen,
  PlatformDetailScreen,
  GenreDetailScreen,
  CreatorDetailScreen,
  DeveloperDetailScreen,
  TagDetailScreen,
  DetailScreen
} from '@screens';
const Stack = createNativeStackNavigator<DiscoverStackParamList>();

export const DiscoverStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DiscoverMain" component={DiscoverMainScreen} />
    <Stack.Screen name="PlatformDetail" component={PlatformDetailScreen} />
    <Stack.Screen name="GenreDetail" component={GenreDetailScreen} />
    <Stack.Screen name="CreatorDetail" component={CreatorDetailScreen} />
    <Stack.Screen name="DeveloperDetail" component={DeveloperDetailScreen} />
    <Stack.Screen name="GameDetail" component={DetailScreen} />
    <Stack.Screen name="TagDetail" component={TagDetailScreen} />
  </Stack.Navigator>
);