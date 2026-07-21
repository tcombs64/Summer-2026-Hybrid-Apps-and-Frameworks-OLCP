import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import PlanetsScreen from "./screens/PlanetsScreen";
import FilmsScreen from "./screens/FilmsScreen";
import SpaceshipsScreen from "./screens/SpaceshipsScreen";
import OfflineNotice from "./components/OfflineNotice";

// The three screens for the assignment.
const SCREENS = [
  { name: "Planets", component: PlanetsScreen },
  { name: "Films", component: FilmsScreen },
  { name: "Spaceships", component: SpaceshipsScreen },
];

export default function App() {
  const [active, setActive] = useState("Planets");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // iOS uses bottom tabs; Android uses a drawer.
  const isAndroid = Platform.OS === "android";

  const ActiveScreen =
    SCREENS.find((s) => s.name === active)?.component || PlanetsScreen;

  // Navigate to a screen (and close the drawer on Android).
  function go(name) {
    setActive(name);
    setDrawerOpen(false);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      {/* Header — shows a menu button on Android, and the current screen name. */}
      <View style={styles.header}>
        {isAndroid && (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setDrawerOpen((open) => !open)}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{active}</Text>
      </View>

      {/* Module 6 ("Going Offline"): banner that appears whenever the
          device loses its network connection. */}
      <OfflineNotice />

      {/* Screen content (flex: 1 fills the space between header and tab bar). */}
      <View style={styles.content}>
        <ActiveScreen />
      </View>

      {/* iOS: bottom tab bar laid out with Flexbox (row of equal-width tabs). */}
      {!isAndroid && (
        <View style={styles.tabBar}>
          {SCREENS.map((screen) => {
            const focused = active === screen.name;
            return (
              <TouchableOpacity
                key={screen.name}
                style={styles.tab}
                onPress={() => go(screen.name)}
              >
                <Text style={[styles.tabText, focused && styles.tabTextActive]}>
                  {screen.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Android: drawer that slides in from the left (Flexbox overlay). */}
      {isAndroid && drawerOpen && (
        <View style={styles.drawerOverlay}>
          <View style={styles.drawer}>
            <Text style={styles.drawerHeader}>Star Wars</Text>
            {SCREENS.map((screen) => {
              const focused = active === screen.name;
              return (
                <TouchableOpacity
                  key={screen.name}
                  style={styles.drawerItem}
                  onPress={() => go(screen.name)}
                >
                  <Text
                    style={[
                      styles.drawerItemText,
                      focused && styles.drawerItemTextActive,
                    ]}
                  >
                    {screen.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tap the dimmed area to close the drawer. */}
          <TouchableOpacity
            style={styles.drawerBackdrop}
            activeOpacity={1}
            onPress={() => setDrawerOpen(false)}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const YELLOW = "#FFE81F"; // Star Wars logo yellow

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#000",
    borderBottomWidth: 2,
    borderBottomColor: YELLOW,
  },
  menuButton: {
    marginRight: 16,
  },
  menuIcon: {
    color: YELLOW,
    fontSize: 26,
  },
  headerTitle: {
    color: YELLOW,
    fontSize: 22,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  // iOS bottom tab bar
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#000",
    borderTopWidth: 2,
    borderTopColor: YELLOW,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
  },
  tabText: {
    color: "#888",
    fontSize: 14,
  },
  tabTextActive: {
    color: YELLOW,
    fontWeight: "bold",
  },
  // Android drawer
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },
  drawer: {
    width: "70%",
    backgroundColor: "#111",
    paddingTop: 50,
    paddingHorizontal: 24,
    borderRightWidth: 2,
    borderRightColor: YELLOW,
  },
  drawerHeader: {
    color: YELLOW,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  drawerItem: {
    paddingVertical: 16,
  },
  drawerItemText: {
    color: "#ccc",
    fontSize: 18,
  },
  drawerItemTextActive: {
    color: YELLOW,
    fontWeight: "bold",
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
});
