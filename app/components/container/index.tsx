import React from 'react';
import { View, StatusBar, Platform } from 'react-native'; // Platform eklendi
import { styles } from './styles';
import { colors } from '@theme';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContainerProps {
    children: React.ReactNode;
    style?: any;
}

export const Container: React.FC<ContainerProps> = ({ children, style }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                barStyle="light-content"
                {...(Platform.OS === 'android' ? { backgroundColor: colors.background } : {})}
            />
            <View style={[styles.container, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
};