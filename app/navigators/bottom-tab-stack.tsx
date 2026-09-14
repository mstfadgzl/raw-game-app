import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '@types';
import { colors } from '../theme/colors';
import { LibraryStack, SearchStack, DiscoverStack, HomeStack } from '@navigators';
import { AnimatedTabIcon } from '../components/animated-tab-icon';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SettingsScreen } from '@screens';
import { useSettings } from '@hooks';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabStack = () => {
    const insets = useSafeAreaInsets();
    const { colors, t } = useSettings();

    return (
        <Tab.Navigator
            safeAreaInsets={{ bottom: insets.bottom }}
            detachInactiveScreens
            screenOptions={({ route }) => ({
                lazy: true,
                freezeOnBlur: true,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    height: 64 + insets.bottom,
                    paddingTop: 6,
                    paddingBottom: insets.bottom + 4,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.secondary,
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
                tabBarLabelPosition: 'below-icon',
                tabBarHideOnKeyboard: true,
                animation: 'none',
                tabBarIcon: ({ focused, color }) => (
                    <AnimatedTabIcon
                    name={route.name === 'HomeTab' ? 'home' : route.name === 'DiscoverTab' ? 'discover' : route.name === 'SearchTab' ? 'search' : route.name === 'LibraryTab' ? 'library' : 'settings'}
                        focused={focused}
                        color={color}
                    />
                ),
                headerShown: false,
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: t('home') }} />
            <Tab.Screen name="DiscoverTab" component={DiscoverStack} options={{ title: t('discover') }} />
            <Tab.Screen name="SearchTab" component={SearchStack} options={{ title: t('search') }} />
            <Tab.Screen name="LibraryTab" component={LibraryStack} options={{ title: t('library') }} />
            <Tab.Screen name="SettingsTab" component={SettingsScreen} options={{ title: t('settings') }} />
        </Tab.Navigator>
    );
};
