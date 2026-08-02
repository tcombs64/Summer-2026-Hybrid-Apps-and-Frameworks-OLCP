// components/MovieCard.js
// One row in the popular-movies list: a poster thumbnail on the left with the
// title, year and rating stacked to the right. The whole row is tappable and
// calls onPress(movie) so the parent screen can open the detail page.
//
// The layout is pure Flexbox: the card is a horizontal row (flexDirection:
// "row"), and the text column uses flex: 1 to fill the space next to the poster.
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { posterUrl } from "../tmdb";
import { COLORS } from "../theme";

export default function MovieCard({ movie, onPress }) {
  const uri = posterUrl(movie.poster_path);
  // release_date looks like "2024-11-27"; the first 4 chars are the year.
  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => onPress(movie)}
    >
      {uri ? (
        <Image style={styles.poster} source={{ uri }} />
      ) : (
        <View style={[styles.poster, styles.posterFallback]}>
          <Text style={styles.posterFallbackText}>No{"\n"}Image</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.year}>{year}</Text>

        <View style={styles.ratingRow}>
          <Text style={styles.star}>★</Text>
          <Text style={styles.rating}>{rating}</Text>
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  poster: {
    width: 70,
    height: 105,
    borderRadius: 8,
    backgroundColor: COLORS.border,
  },
  posterFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  posterFallbackText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: "center",
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  year: {
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
  rating: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  chevron: {
    color: COLORS.textMuted,
    fontSize: 26,
    marginLeft: 8,
  },
});
