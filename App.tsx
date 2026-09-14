import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { persistor, store } from './app/redux/store';
import { AppStack } from './app/navigators';
import { ApiKeyScreen } from './app/screens/api-key-screen';
import { apiKeyStorage } from './app/services/api-key-storage';
import { runtimeApiKey } from './app/services/runtime-api-key';

const AppRoot = () => {
  const [checkingKey, setCheckingKey] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const loadKey = async () => {
      const key = await apiKeyStorage.get();

      if (key) {
        runtimeApiKey.set(key);
        setAuthenticated(true);
      }

      setCheckingKey(false);
    };

    void loadKey();
  }, []);

  if (checkingKey) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#64ffda" size="large" />
      </View>
    );
  }

  if (!authenticated) {
    return (
      <ApiKeyScreen
        onAuthenticated={() => setAuthenticated(true)}
      />
    );
  }

  return (
    <NavigationContainer>
      <AppStack />
    </NavigationContainer>
  );
};

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SafeAreaProvider>
        <AppRoot />
      </SafeAreaProvider>
    </PersistGate>
  </Provider>
);

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#151515',
  },
});

export default App;