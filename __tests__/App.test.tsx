import React from 'react';
import { Text } from 'react-native';
import TestRenderer, { act } from 'react-test-renderer';
import App from '../App';
import { apiKeyStorage } from '../app/services/api-key-storage';
import { runtimeApiKey } from '../app/services/runtime-api-key';

jest.mock('react-redux', () => ({ Provider: ({ children }: any) => children }));
jest.mock('redux-persist/integration/react', () => ({ PersistGate: ({ children }: any) => children }));
jest.mock('../app/redux/store', () => ({ store: {}, persistor: {} }));
jest.mock('react-native-safe-area-context', () => ({ SafeAreaProvider: ({ children }: any) => children }));
jest.mock('@react-navigation/native', () => ({ NavigationContainer: ({ children }: any) => children }));
jest.mock('../app/navigators', () => {
    const { Text: MockText } = require('react-native');
    return { AppStack: () => <MockText>Application</MockText> };
});
jest.mock('../app/screens/api-key-screen', () => {
    const { Pressable: MockPressable, Text: MockText } = require('react-native');
    return { ApiKeyScreen: ({ onAuthenticated }: any) => <MockPressable testID="login" onPress={onAuthenticated}><MockText>Login</MockText></MockPressable> };
});
jest.mock('../app/services/api-key-storage', () => ({ apiKeyStorage: { get: jest.fn(), clear: jest.fn() } }));
jest.mock('../app/services/preferences-storage', () => ({
    defaultPreferences: { language: 'en', themeMode: 'dark' },
    preferencesStorage: {
        get: jest.fn().mockResolvedValue({ language: 'en', themeMode: 'dark' }),
        save: jest.fn().mockResolvedValue(undefined),
    },
}));

let tree: TestRenderer.ReactTestRenderer;
beforeEach(() => { runtimeApiKey.clear(); jest.clearAllMocks(); });
afterEach(async () => { if (tree) await act(() => tree.unmount()); });

it('opens login without a stored key, then enters the app after authentication', async () => {
    (apiKeyStorage.get as jest.Mock).mockResolvedValue(null);
    await act(async () => { tree = TestRenderer.create(<App />); });
    expect(tree.root.findByType(Text).props.children).toBe('Login');
    await act(async () => tree.root.findByProps({ testID: 'login' }).props.onPress());
    expect(tree.root.findByType(Text).props.children).toBe('Application');
});

it('restores a saved session before rendering the application', async () => {
    (apiKeyStorage.get as jest.Mock).mockResolvedValue('test-key');
    await act(async () => { tree = TestRenderer.create(<App />); });
    expect(tree.root.findByType(Text).props.children).toBe('Application');
    expect(runtimeApiKey.get()).toBe('test-key');
});

it('shows login instead of an endless spinner when storage fails', async () => {
    (apiKeyStorage.get as jest.Mock).mockRejectedValue(new Error('Storage unavailable'));
    await act(async () => { tree = TestRenderer.create(<App />); });
    expect(tree.root.findByType(Text).props.children).toBe('Login');
    expect(runtimeApiKey.get()).toBeNull();
});

