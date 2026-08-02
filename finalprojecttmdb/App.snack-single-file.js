// SDEV257 Final Project -- TMDB Movies (single-file Snack version)
// ----------------------------------------------------------------------------
// Everything from the multi-file project combined into one file so it can be
// pasted straight into https://snack.expo.dev to run in the browser / Expo Go.
//
// Data comes from the TMDB (The Movie Database) REST API.
//
// The app has TWO screens (state-based navigation, no extra libraries):
//   1. Popular Movies -- a scrolling list of movies from the TMDB REST API,
//      each row showing the poster, title, release year and rating.
//   2. Movie Detail    -- tap a movie to see its poster, rating, year, runtime,
//      genres, tagline and full overview. A back button returns to the list.
//
// The whole UI is laid out with Flexbox.
//
// The TMDB API key (v3 auth) is already filled in below.
// ----------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar as RNStatusBar,
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";

// ============================ TMDB API layer ================================

// TMDB v3 API key (from themoviedb.org -> Settings -> API).
const TMDB_API_KEY = "b80e0c33c37a241814e2525b383c03e9";

const API_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

function hasApiKey() {
  return TMDB_API_KEY && TMDB_API_KEY !== "YOUR_TMDB_API_KEY_HERE";
}

// Build a full poster URL from TMDB's short path; null when there is no poster.
function posterUrl(path) {
  return path ? `${IMAGE_BASE}${path}` : null;
}

// Shared request helper: adds the key, checks the status, returns JSON.
async function tmdbFetch(path) {
  if (!hasApiKey()) {
    throw new Error(
      "No TMDB API key set. Paste your key into TMDB_API_KEY at the top of the file."
    );
  }
  const separator = path.includes("?") ? "&" : "?";
  const url = `${API_BASE}${path}${separator}api_key=${TMDB_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB request failed (HTTP ${response.status}).`);
  }
  return response.json();
}

async function getPopularMovies() {
  const data = await tmdbFetch("/movie/popular");
  return data.results || [];
}

async function getMovieDetails(id) {
  return tmdbFetch(`/movie/${id}`);
}

// ================================ Theme =====================================

const COLORS = {
  background: "#0F1B2B",
  surface: "#1B2A3F",
  primary: "#F5C518",
  text: "#FFFFFF",
  textMuted: "#9BB0C9",
  border: "#26374F",
  danger: "#FF6B6B",
};

// ============================== MovieCard ===================================
// One tappable row in the list: poster + title/year/rating, laid out in a row.

function MovieCard({ movie, onPress }) {
  const uri = posterUrl(movie.poster_path);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress(movie)}
    >
      {uri ? (
        <Image style={styles.cardPoster} source={{ uri }} />
      ) : (
        <View style={[styles.cardPoster, styles.posterFallback]}>
          <Text style={styles.posterFallbackText}>No{"\n"}Image</Text>
        </View>
      )}

      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.cardYear}>{year}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.cardRating}>{rating}</Text>
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

// ============================ MoviesScreen (1) ==============================
// The popular-movies list, with loading / error / loaded states.

function MoviesScreen({ onSelectMovie }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.muted}>Loading popular movies…</Text>
      </View>
    );
  }

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

  return (
    <View style={styles.flex}>
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

// ========================= MovieDetailScreen (2) ============================
// One movie's full details. Renders instantly from the list summary, then
// enriches with runtime/genres/tagline from a second request.

function MovieDetailScreen({ movie, onBack }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadDetails() {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovieDetails(movie.id);
        if (active) setDetails(data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDetails();
    return () => {
      active = false;
    };
  }, [movie.id]);

  const data = details || movie;
  const uri = posterUrl(data.poster_path);
  const year = data.release_date ? data.release_date.slice(0, 4) : "—";
  const rating = data.vote_average ? data.vote_average.toFixed(1) : "N/A";
  const runtime = details && details.runtime ? `${details.runtime} min` : null;
  const genres =
    details && details.genres && details.genres.length
      ? details.genres.map((g) => g.name).join(", ")
      : null;

  return (
    <View style={styles.flex}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>‹ Back to list</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        {uri ? (
          <Image style={styles.detailPoster} source={{ uri }} resizeMode="cover" />
        ) : (
          <View style={[styles.detailPoster, styles.posterFallback]}>
            <Text style={styles.posterFallbackText}>No Image</Text>
          </View>
        )}

        <Text style={styles.detailTitle}>{data.title}</Text>
        {data.tagline ? (
          <Text style={styles.tagline}>{data.tagline}</Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Rating</Text>
            <Text style={styles.metaValue}>★ {rating}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Year</Text>
            <Text style={styles.metaValue}>{year}</Text>
          </View>
          {runtime ? (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Runtime</Text>
              <Text style={styles.metaValue}>{runtime}</Text>
            </View>
          ) : null}
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={styles.detailSpinner} />
        ) : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {genres ? <Text style={styles.genres}>{genres}</Text> : null}

        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overview}>
          {data.overview || "No overview available for this movie."}
        </Text>
      </ScrollView>
    </View>
  );
}

// ================================= App ======================================
// Owns the navigation state: show the detail screen when a movie is selected,
// otherwise show the list.

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

// ================================ Styles ====================================

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },
  flex: {
    flex: 1,
  },

  // List screen
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

  // Shared centered state (loading / error)
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

  // Movie card (list row)
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  cardPoster: {
    width: 70,
    height: 105,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  cardYear: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  star: {
    color: COLORS.primary,
    fontSize: 14,
    marginRight: 4,
  },
  cardRating: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  chevron: {
    color: COLORS.textMuted,
    fontSize: 26,
    marginLeft: 8,
  },

  // Poster fallback (used by both screens)
  posterFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  posterFallbackText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: "center",
  },

  // Detail screen
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    alignItems: "center",
  },
  detailPoster: {
    width: 200,
    height: 300,
    borderRadius: 12,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },
  detailTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  tagline: {
    color: COLORS.textMuted,
    fontStyle: "italic",
    fontSize: 14,
    textAlign: "center",
    marginTop: 6,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  metaItem: {
    alignItems: "center",
    marginHorizontal: 18,
  },
  metaLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  metaValue: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  detailSpinner: {
    marginVertical: 12,
  },
  genres: {
    color: COLORS.primary,
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
    alignSelf: "flex-start",
    marginTop: 20,
    marginBottom: 8,
  },
  overview: {
    color: COLORS.textMuted,
    fontSize: 15,
    lineHeight: 23,
    alignSelf: "flex-start",
  },
});
