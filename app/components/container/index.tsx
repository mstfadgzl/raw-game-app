import React from 'react';
import { View, StatusBar, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export const Container: React.FC<ContainerProps> = ({ children, style }) => (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle="light-content" />
        <View style={[{ flex: 1, paddingHorizontal: 16 }, style]}>
            {children}
        </View>
    </SafeAreaView>
);