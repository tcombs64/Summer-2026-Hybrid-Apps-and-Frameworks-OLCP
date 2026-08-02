// SDEV257 Final Project -- Movies App (single-file Snack version)
// ----------------------------------------------------------------------------
// Everything from the multi-file project combined into one file so it can be
// pasted straight into https://snack.expo.dev to run in the browser / Expo Go.
//
// Data comes from the OMDb (Open Movie Database) REST API. (OMDb is used
// instead of TMDB because TMDB's CloudFront servers return a 403 block on this
// network; OMDb is another free movie REST API.)
//
// The app has TWO screens (state-based navigation, no extra libraries):
//   1. Movie Search -- a search box (pre-loaded with results) that queries the
//      OMDb REST API and lists matching movies with poster, title and year.
//   2. Movie Detail -- tap a movie to see its poster, IMDb rating, year,
//      runtime, genre, full plot, director and cast. A back button returns.
//
// The whole UI is laid out with Flexbox.
//
// The free OMDb API key is already filled in below (from omdbapi.com/apikey.aspx).
// ----------------------------------------------------------------------------

import React, { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar as RNStatusBar,
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StatusBar } from "expo-status-bar";

// ============================ OMDb API layer ================================

// Free OMDb API key (https://www.omdbapi.com/apikey.aspx).
const OMDB_API_KEY = "4d2add6f";

// HTTPS matters: Snack runs on an https page and blocks plain http requests.
const API_BASE = "https://www.omdbapi.com/";

function hasApiKey() {
  return OMDB_API_KEY && OMDB_API_KEY !== "YOUR_OMDB_API_KEY_HERE";
}

// OMDb returns the string "N/A" when a movie has no poster.
function posterUrl(poster) {
  return poster && poster !== "N/A" ? poster : null;
}

// Shared request helper: adds the key, checks the status, returns JSON.
async function omdbFetch(params) {
  if (!hasApiKey()) {
    throw new Error(
      "No OMDb API key set. Paste your key into OMDB_API_KEY at the top of the file."
    );
  }
  const url = `${API_BASE}?apikey=${OMDB_API_KEY}&${params}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OMDb request failed (HTTP ${response.status}).`);
  }
  return response.json();
}

// Search movies by title (Screen 1). Returns [] when there are no matches.
async function searchMovies(query) {
  const data = await omdbFetch(`s=${encodeURIComponent(query)}&type=movie`);
  if (data.Response === "False") {
    if (data.Error && /not found/i.test(data.Error)) return [];
    throw new Error(data.Error || "OMDb search failed.");
  }
  return data.Search || [];
}

// Full details for one movie by IMDb id (Screen 2).
async function getMovieDetails(imdbID) {
  const data = await omdbFetch(`i=${encodeURIComponent(imdbID)}&plot=full`);
  if (data.Response === "False") {
    throw new Error(data.Error || "Movie not found.");
  }
  return data;
}

// Return a value only when present and not OMDb's "N/A" placeholder.
function clean(value) {
  return value && value !== "N/A" ? value : null;
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
// One tappable row in the results list: poster + title/year, laid out in a row.

function MovieCard({ movie, onPress }) {
  const uri = posterUrl(movie.Poster);
  const year = movie.Year || "—";

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
          {movie.Title}
        </Text>
        <Text style={styles.cardYear}>{year}</Text>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

// ============================ MoviesScreen (1) ==============================
// The search screen: a default search runs on load so it isn't empty.

const DEFAULT_QUERY = "Avengers";

function MoviesScreen({ onSelectMovie }) {
  const [input, setInput] = useState(DEFAULT_QUERY);
  const [lastQuery, setLastQuery] = useState(DEFAULT_QUERY);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    runSearch(DEFAULT_QUERY);
  }, []);

  async function runSearch(query) {
    const q = query.trim();
    if (!q) return;
    try {
      setLoading(true);
      setError(null);
      setLastQuery(q);
      const results = await searchMovies(q);
      setMovies(results);
    } catch (err) {
      setError(err.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  function renderBody() {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.muted}>Searching…</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => runSearch(lastQuery)}
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (movies.length === 0) {
      return (
        <View style={styles.center}>
          <Text style={styles.muted}>No movies found for “{lastQuery}”.</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={movies}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={onSelectMovie} />
        )}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    );
  }

  return (
    <View style={styles.flex}>
      <Text style={styles.heading}>Movie Search</Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => runSearch(input)}
          placeholder="Search movies…"
          placeholderTextColor={COLORS.textMuted}
          returnKeyType="search"
          autoCapitalize="words"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => runSearch(input)}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      {renderBody()}
    </View>
  );
}

// ========================= MovieDetailScreen (2) ============================
// One movie's full details, fetched by IMDb id.

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
        const data = await getMovieDetails(movie.imdbID);
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
  }, [movie.imdbID]);

  const data = details || movie;
  const uri = posterUrl(data.Poster);
  const year = clean(data.Year) || "—";
  const rating = details ? clean(details.imdbRating) : null;
  const runtime = details ? clean(details.Runtime) : null;
  const genre = details ? clean(details.Genre) : null;
  const plot = details ? clean(details.Plot) : null;
  const director = details ? clean(details.Director) : null;
  const actors = details ? clean(details.Actors) : null;
  const rated = details ? clean(details.Rated) : null;

  return (
    <View style={styles.flex}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>‹ Back to search</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        {uri ? (
          <Image style={styles.detailPoster} source={{ uri }} resizeMode="cover" />
        ) : (
          <View style={[styles.detailPoster, styles.posterFallback]}>
            <Text style={styles.posterFallbackText}>No Image</Text>
          </View>
        )}

        <Text style={styles.detailTitle}>{data.Title}</Text>
        {rated ? <Text style={styles.rated}>Rated {rated}</Text> : null}

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>IMDb</Text>
            <Text style={styles.metaValue}>★ {rating || "N/A"}</Text>
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

        {genre ? <Text style={styles.genres}>{genre}</Text> : null}

        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overview}>
          {plot || "No overview available for this movie."}
        </Text>

        {director ? (
          <Text style={styles.credit}>
            <Text style={styles.creditLabel}>Director: </Text>
            {director}
          </Text>
        ) : null}
        {actors ? (
          <Text style={styles.credit}>
            <Text style={styles.creditLabel}>Cast: </Text>
            {actors}
          </Text>
        ) : null}
      </ScrollView>
    </View>
  );
}

// ================================= App ======================================
// Owns the navigation state: show the detail screen when a movie is selected,
// otherwise show the search list.

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

  // Search screen
  heading: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: "800",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 18,
    justifyContent: "center",
    marginLeft: 10,
  },
  searchButtonText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // Shared centered state (loading / error / empty)
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
    textAlign: "center",
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
    marginTop: 6,
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
  rated: {
    color: COLORS.textMuted,
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
  credit: {
    color: COLORS.textMuted,
    fontSize: 14,
    lineHeight: 22,
    alignSelf: "flex-start",
    marginTop: 12,
  },
  creditLabel: {
    color: COLORS.text,
    fontWeight: "700",
  },
});
