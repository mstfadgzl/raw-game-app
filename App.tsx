import React from 'react';
import { Provider } from "react-redux";
import { persistor, store } from "./app/redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { AppStack } from "@navigators";
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer theme={DarkTheme}>
            <AppStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};


export default App;
