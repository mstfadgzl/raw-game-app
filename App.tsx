import React from 'react';
import { Provider } from "react-redux";
import { store } from "./app/redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { AppStack } from "@navigators";
import { DiscoveryScreen } from '@screens';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;