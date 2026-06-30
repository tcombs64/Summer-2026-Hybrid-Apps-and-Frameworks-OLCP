import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

// Reusable list that fetches data from the Star Wars API (swapi.tech) and
// renders it. Each screen passes:
//   url   - the SWAPI endpoint to fetch
//   parse - a function that turns the JSON response into an array of
//           { id, label } items (this handles the different shapes:
//           planets/starships use `results[].name`, films use
//           `result[].properties.title`).
export default function SwapiList({ url, parse }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <FlatList
      style={styles.list}
      data={items}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.rowText}>{item.label}</Text>
        </View>
      )}
    />
  );
}

const YELLOW = "#FFE81F";

const styles = StyleSheet.create({
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
    backgroundColor: "#000",
  },
  listContent: {
    padding: 16,
  },
  row: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: YELLOW,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  rowText: {
    color: YELLOW,
    fontSize: 18,
    fontWeight: "bold",
  },
});
