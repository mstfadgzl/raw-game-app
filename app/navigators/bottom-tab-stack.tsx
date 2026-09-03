import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '@types';
import { HomeStack } from './home-stack';
import { colors } from '../theme/colors';
import { SearchScreen } from '@screens';
import { SearchStack } from './search-stack';

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
            <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
            <Tab.Screen name="SearchTab" component={SearchStack} options={{ title: 'Search' }} />
        </Tab.Navigator>
    );
};