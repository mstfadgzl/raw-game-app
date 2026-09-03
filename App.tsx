// import React from 'react';
// import { Provider } from "react-redux";
// import { store } from "./app/redux/store";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { NavigationContainer } from "@react-navigation/native";
// import { AppStack } from "@navigators";

// const App = () => {
//   return (
//     <Provider store={store}>
//       <SafeAreaProvider>
//         <NavigationContainer>
//           <AppStack />
//         </NavigationContainer>
//       </SafeAreaProvider>
//     </Provider>
//   );
// };

// export default App;

import { gameService, EntityService, DiscoveryService } from '@services';

// ... useEffect içinde:
useEffect(() => {
  const runAllTests = async () => {
    console.log("🚀 API TESTLERİ BAŞLADI...");

    try {
      // 1. Oyun Detay Test
      const gameDetail = await gameService.getGameDetail(3498); // GTA V ID
      console.log("✅ Game Detail:", gameDetail.name);

      // 2. Fragman Test
      const trailers = await gameService.getGameTrailers(3498);
      console.log("✅ Trailers Count:", trailers.results.length);

      // 3. Yapımcılar Test
      const creators = await entityService.getCreators(1);
      console.log("✅ First Creator:", creators.results[0]?.name);

      // 4. Stüdyo Detay Test
      const devDetail = await entityService.getDeveloperDetail('rockstar-games');
      console.log("✅ Developer Detail:", devDetail.name);

      // 5. Etiketler (Tags) Test
      const tags = await discoveryService.getTags(1);
      console.log("✅ First Tag:", tags.results[0]?.name);

    } catch (error) {
      console.error("❌ TEST HATASI:", error);
    }
  };

  runAllTests();
}, []);