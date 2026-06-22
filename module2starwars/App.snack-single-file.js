// ============================================================
// SNACK-READY SINGLE FILE VERSION
// Paste this whole thing into App.js in Expo Snack to test quickly.
// For GitHub, use the multi-file version (App.js + screens/ folder).
// ============================================================

import React from "react";
import { Platform, View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

// ---- Screens ----
function PlanetsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Planets</Text>
    </View>
  );
}

function FilmsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Films</Text>
    </View>
  );
}

function SpaceshipsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Spaceships</Text>
    </View>
  );
}

// ---- Navigators ----
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Planets" component={PlanetsScreen} />
      <Tab.Screen name="Films" component={FilmsScreen} />
      <Tab.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Planets" component={PlanetsScreen} />
      <Drawer.Screen name="Films" component={FilmsScreen} />
      <Drawer.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  // iOS -> bottom tabs, Android -> drawer
  return (
    <NavigationContainer>
      {Platform.OS === "ios" ? <TabNavigator /> : <DrawerNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
