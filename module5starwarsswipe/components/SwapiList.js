import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import SwipeableRow from "./SwipeableRow";
import ItemModal from "./ItemModal";

// Reusable list that fetches data from the Star Wars API (swapi.tech) and
// renders it inside a ScrollView (Chapter 24, "Implementing scrollable
// content"). Each item is a SwipeableRow — swiping it opens a modal dialog
// with the item's text. Each screen passes:
//   url   - the SWAPI endpoint to fetch
//   parse - a function that turns the JSON response into an array of
//           { id, label } items (this handles the different shapes:
//           planets/starships use `results[].name`, films use
//           `result[].properties.title`).
export default function SwapiList({ url, parse }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // The label of the item the user swiped; null means the modal is hidden.
  const [swiped, setSwiped] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url);
        const json = await response.json();
        if (active) {
          setItems(parse(json));
        }
      } catch (e) {
        if (active) {
          setError("Could not load data. Check your connection and try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [url]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFE81F" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Vertical ScrollView so the list can extend past the bottom of the
          screen (Chapter 24). Each row inside it is its own horizontal,
          swipeable ScrollView. */}
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {items.map((item) => (
          <SwipeableRow
            key={item.id}
            label={item.label}
            onSwipe={() => setSwiped(item.label)}
          />
        ))}
      </ScrollView>

      {/* Modal that shows the text of the swiped item (Chapter 23). */}
      <ItemModal
        visible={swiped !== null}
        text={swiped}
        onClose={() => setSwiped(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    alignItems: "center",
  },
});
