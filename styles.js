import { StyleSheet, StatusBar, Platform } from "react-native";

export default StyleSheet.create({
  // Keeps content below the status bar.
  // SafeAreaView handles the notch/status bar on iOS automatically;
  // on Android we add the status bar height as top padding so the
  // layout starts below it regardless of platform.
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  // A row lays its children out horizontally.
  row: {
    flex: 1,
    flexDirection: "row",
  },
  // A column lays its children out vertically and shares row space evenly.
  column: {
    flex: 1,
    flexDirection: "column",
  },
  // Each box fills its slot, with a border so the grid is visible.
  box: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#999",
    backgroundColor: "#ddd",
    margin: 2,
  },
  boxText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
