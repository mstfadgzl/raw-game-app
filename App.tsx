import React from 'react';
import { Provider } from "react-redux";
import { persistor, store } from "./app/redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { AppStack } from "@navigators";
import { PersistGate } from 'redux-persist/integration/react';
import { SplashScreen } from './app/screens/splash-screen';
import { View } from 'react-native';

const App = () => {
  const [splashVisible, setSplashVisible] = React.useState(true);
  const [hydrated, setHydrated] = React.useState(false);
  const hideSplash = React.useCallback(() => setSplashVisible(false), []);

  return (
    <View style={{ flex: 1, backgroundColor: '#151515' }}>
      <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} onBeforeLift={() => setHydrated(true)}>
        <SafeAreaProvider>
          <NavigationContainer theme={DarkTheme}>
            <AppStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
      </Provider>
      {(splashVisible || !hydrated) && <SplashScreen onFinish={hideSplash} />}
    </View>
  );
};


export default App;
