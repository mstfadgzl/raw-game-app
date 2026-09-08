import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '@types';
import { colors } from '../theme/colors';
import { LibraryStack, SearchStack, DiscoverStack, HomeStack } from '@navigators';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabStack = () => {

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: { backgroundColor: colors.surface, borderTopWidth: 0 },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.secondary,
                headerShown: false,
            }}
        >
            <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Ana Sayfa' }} />
            <Tab.Screen name="DiscoverTab" component={DiscoverStack} options={{ title: 'Keşfet' }} />
            <Tab.Screen name="SearchTab" component={SearchStack} options={{ title: 'Ara' }} />
            <Tab.Screen name="LibraryTab" component={LibraryStack} options={{ title: 'Kitaplık' }} />
        </Tab.Navigator>
    );
};