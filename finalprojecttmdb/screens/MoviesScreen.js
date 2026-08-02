// screens/MoviesScreen.js
// SCREEN 1 of 2 -- the popular-movies list.
//
// On mount it calls the TMDB API for the current popular movies and renders
// them in a scrolling FlatList of MovieCard rows. It handles the three states
// every network screen needs: loading, error (with a retry button), and the
// loaded list. Tapping a row hands the movie back to App via onSelectMovie so
// the detail screen can open.
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MovieCard from "../components/MovieCard";
import { getPopularMovies } from "../tmdb";
import { COLORS } from "../theme";

export default function MoviesScreen({ onSelectMovie }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load the movies once, when the screen first appears.
  useEffect(() => {
    loadMovies();
  }, []);

  async function loadMovies() {
    try {
      setLoading(true);
      setError(null);
      const results = await getPopularMovies();
      setMovies(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ---- Loading state ----
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.muted}>Loading popular movies…</Text>
      </View>
    );
  }

  // ---- Error state (bad key, no network, etc.) ----
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadMovies}>
          <Text style={styles.retryText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ---- Loaded list ----
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Popular Movies</Text>
      <FlatList
        data={movies}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={onSelectMovie} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "800",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  muted: {
    color: COLORS.textMuted,
    fontSize: 15,
    marginTop: 12,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },
});
