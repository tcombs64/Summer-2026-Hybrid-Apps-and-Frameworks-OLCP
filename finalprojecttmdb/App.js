// App.js
// Root of the app. It owns the "which screen am I on?" state and switches
// between the two screens:
//
//   - no movie selected  ->  MoviesScreen   (the popular-movies list)
//   - a movie selected   ->  MovieDetailScreen (that movie's detail page)
//
// Using a single piece of state for navigation keeps the project dependency-
// free (no navigation library needed) while still meeting the "minimum two
// screens" requirement.
import React, { useState } from "react";
import {
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import MoviesScreen from "./screens/MoviesScreen";
import MovieDetailScreen from "./screens/MovieDetailScreen";
import { COLORS } from "./theme";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      {selectedMovie ? (
        <MovieDetailScreen
          movie={selectedMovie}
          onBack={() => setSelectedMovie(null)}
        />
      ) : (
        <MoviesScreen onSelectMovie={(movie) => setSelectedMovie(movie)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
    // Push content below the Android status bar (iOS handles this via SafeArea).
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },
});
