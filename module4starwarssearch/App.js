import React from "react";
import { NavigationContainer } from "@react-navigation/native";

// Metro picks the right file per platform:
//   iOS      -> Navigation.ios.js     (bottom tabs)
//   Android  -> Navigation.android.js (drawer)
//   web/etc. -> Navigation.js         (bottom tabs)
// This keeps the drawer's react-native-reanimated dependency out of the
// iOS bundle, so the app runs in Expo Go on iPhone.
import Navigation from "./Navigation";

export default function App() {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}
