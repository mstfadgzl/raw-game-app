import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '@types';
import { colors } from '../theme/colors';
import { LibraryStack, SearchStack, DiscoverStack, HomeStack } from '@navigators';
import { AnimatedTabIcon } from '../components/animated-tab-icon';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabStack = () => {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: '#303636', paddingTop: 6 },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.secondary,
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
                tabBarLabelPosition: 'below-icon',
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({ focused, color }) => (
                    <AnimatedTabIcon
                        name={route.name === 'HomeTab' ? 'home' : route.name === 'DiscoverTab' ? 'discover' : route.name === 'SearchTab' ? 'search' : 'library'}
                        focused={focused}
                        color={color}
                    />
                ),
                headerShown: false,
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Ana Sayfa' }} />
            <Tab.Screen name="DiscoverTab" component={DiscoverStack} options={{ title: 'Keşfet' }} />
            <Tab.Screen name="SearchTab" component={SearchStack} options={{ title: 'Ara' }} />
            <Tab.Screen name="LibraryTab" component={LibraryStack} options={{ title: 'Kitaplık' }} />
        </Tab.Navigator>
    );
};
