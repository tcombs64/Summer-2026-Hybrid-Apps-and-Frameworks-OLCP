import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import PlanetsScreen from "./screens/PlanetsScreen";
import FilmsScreen from "./screens/FilmsScreen";
import SpaceshipsScreen from "./screens/SpaceshipsScreen";

// iOS navigation: bottom tabs.
// Kept in a platform-specific file so iOS never imports the drawer
// navigator (and its react-native-reanimated dependency).
const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Planets" component={PlanetsScreen} />
      <Tab.Screen name="Films" component={FilmsScreen} />
      <Tab.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Tab.Navigator>
  );
}
