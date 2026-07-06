// Gesture handler is required by the drawer navigator; imported here so it
// only loads on Android (keeps it out of the iOS bundle).
import "react-native-gesture-handler";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import PlanetsScreen from "./screens/PlanetsScreen";
import FilmsScreen from "./screens/FilmsScreen";
import SpaceshipsScreen from "./screens/SpaceshipsScreen";

// Android navigation: side drawer (swipe from the left edge).
const Drawer = createDrawerNavigator();

export default function Navigation() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Planets" component={PlanetsScreen} />
      <Drawer.Screen name="Films" component={FilmsScreen} />
      <Drawer.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Drawer.Navigator>
  );
}
