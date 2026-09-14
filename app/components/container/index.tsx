import React from 'react';
import { View, StatusBar, Platform } from 'react-native'; // Platform eklendi
import { styles } from './styles';
import { colors } from '@theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../../context/settings-context';

interface ContainerProps {
    children: React.ReactNode;
    style?: any;
}

export const Container: React.FC<ContainerProps> = ({ children, style }) => {
    const { colors, themeMode } = useSettings();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <StatusBar
                barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
                {...(Platform.OS === 'android' ? { backgroundColor: colors.background } : {})}
            />
            <View style={[styles.container, style, { backgroundColor: colors.background }]}>
                {children}
            </View>
        </SafeAreaView>
    );
};
