import { AppStack } from "@navigators"
import { DarkTheme, NavigationContainer } from "@react-navigation/native"
import { Provider } from "react-redux"
import { store } from "./app/redux/store"
import { SafeAreaProvider } from "react-native-safe-area-context"

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppStack />
      </SafeAreaProvider>
    </Provider>
  )
}