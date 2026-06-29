import React from "react";
import { View, Text, StyleSheet } from "react-native";

// Films screen. For now it just displays its name (per the assignment).
// Later in the course this will list and display Star Wars films.
export default function FilmsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Films</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFE81F",
  },
});
