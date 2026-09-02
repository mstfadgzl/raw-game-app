import { AppStack } from "@navigators/app-stack"
import { DarkTheme, NavigationContainer } from "@react-navigation/native"
import { Provider } from "react-redux"
import { store } from "./app/redux/store"

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer theme={DarkTheme}>
        <AppStack />
      </NavigationContainer>
    </Provider>
  )
}