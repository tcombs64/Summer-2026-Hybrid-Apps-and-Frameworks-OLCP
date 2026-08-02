// screens/MovieDetailScreen.js
// SCREEN 2 of 2 -- the movie detail page.
//
// The list already gives us the movie summary (title, overview, poster), so
// this screen can render immediately. In the background it fetches the FULL
// record for extra fields (runtime, genres, tagline) and merges them in when
// they arrive. That means the page is useful even if the second request fails.
// A back button returns to the list.
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { getMovieDetails, posterUrl } from "../tmdb";
import { COLORS } from "../theme";

export default function MovieDetailScreen({ movie, onBack }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the full record whenever the selected movie changes. The `active`
  // flag stops us calling setState after the screen has been closed.
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

  // Prefer the fuller details once loaded, otherwise use the list summary.
  const data = details || movie;
  const uri = posterUrl(data.poster_path);
  const year = data.release_date ? data.release_date.slice(0, 4) : "—";
  const rating = data.vote_average ? data.vote_average.toFixed(1) : "N/A";
  const runtime =
    details && details.runtime ? `${details.runtime} min` : null;
  const genres =
    details && details.genres && details.genres.length
      ? details.genres.map((g) => g.name).join(", ")
      : null;

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>‹ Back to list</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        {uri ? (
          <Image style={styles.poster} source={{ uri }} resizeMode="cover" />
        ) : (
          <View style={[styles.poster, styles.posterFallback]}>
            <Text style={styles.posterFallbackText}>No Image</Text>
          </View>
        )}

        <Text style={styles.title}>{data.title}</Text>
        {data.tagline ? (
          <Text style={styles.tagline}>{data.tagline}</Text>
        ) : null}

        {/* Meta row: rating / year / runtime laid out with Flexbox. */}
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

        {/* Small spinner / error just for the extra details fetch. */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  poster: {
    width: 200,
    height: 300,
    borderRadius: 12,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },
  posterFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  posterFallbackText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  title: {
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
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    textAlign: "center",
    marginVertical: 8,
  },
});
