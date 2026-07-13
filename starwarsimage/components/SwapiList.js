import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import SwipeableRow from "./SwipeableRow";
import ItemModal from "./ItemModal";
import LazyImage from "./LazyImage";

// Reusable list that fetches data from the Star Wars API (swapi.tech) and
// renders it inside a ScrollView (Chapter 24, "Implementing scrollable
// content"). Each item is a SwipeableRow — swiping it opens a modal dialog
// with the item's text. Each screen passes:
//   url   - the SWAPI endpoint to fetch
//   parse - a function that turns the JSON response into an array of
//           { id, label } items (this handles the different shapes:
//           planets/starships use `results[].name`, films use
//           `result[].properties.title`).
//   image - the uri of a themed header image, lazy-loaded at the top of the
//           screen (Chapter 26).
export default function SwapiList({ url, parse, image }) {
  const imageWidth = useWindowDimensions().width;
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

  // The part below the header image: spinner while fetching, error message,
  // or the scrollable list of swipeable rows.
  let body;
  if (loading) {
    body = (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFE81F" />
      </View>
    );
  } else if (error) {
    body = (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  } else {
    body = (
      /* Vertical ScrollView so the list can extend past the bottom of the
         screen (Chapter 24). Each row inside it is its own horizontal,
         swipeable ScrollView. */
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {items.map((item, index) => (
          <SwipeableRow
            key={item.id}
            label={item.label}
            index={index}
            onSwipe={() => setSwiped(item.label)}
          />
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Themed header image at the top of the screen, lazy-loaded
          (Chapter 26): a placeholder shows until the download finishes. */}
      <LazyImage
        style={{ width: imageWidth, height: 160 }}
        resizeMode="cover"
        source={{ uri: image }}
      />

      {body}

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
