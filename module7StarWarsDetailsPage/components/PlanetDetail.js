import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import useConnected from "./useConnected";

// Detail page for a single planet (Module 7, "Details pages and navigation").
// Reached by swiping a planet row on the Planets screen. It fetches the full
// record for that planet from swapi.tech's detail endpoint
// (…/api/planets/{uid}) and lays the bulk of the returned data out as a set
// of labelled stat tiles.
//
// Props:
//   uid    - the planet's id (used to build the detail URL)
//   name   - the planet's name (shown immediately, before the fetch finishes)
//   onBack - called when the user taps the back button
export default function PlanetDetail({ uid, name, onBack }) {
  const [planet, setPlanet] = useState(null);
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Module 6 ("Going Offline"): live network status. If the network returns
  // while we're on this page, the fetch effect re-runs and loads the data.
  const connected = useConnected();

  useEffect(() => {
    if (!connected) {
      setLoading(false);
      return;
    }

    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `https://www.swapi.tech/api/planets/${uid}`
        );
        const json = await response.json();
        if (active) {
          setPlanet(json.result.properties);
          setDescription(json.result.description);
        }
      } catch (e) {
        if (active) {
          setError("Could not load this planet. Check your connection.");
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
  }, [uid, connected]);

  // The stat tiles shown for the planet, in display order. Each entry names a
  // property, a human label, and how to format the raw string value.
  const STATS = planet
    ? [
        { label: "Climate", value: titleCase(planet.climate) },
        { label: "Terrain", value: titleCase(planet.terrain) },
        { label: "Population", value: withCommas(planet.population) },
        { label: "Diameter", value: withUnit(planet.diameter, "km") },
        { label: "Gravity", value: capitalize(planet.gravity) },
        { label: "Rotation", value: withUnit(planet.rotation_period, "hrs") },
        { label: "Orbital Period", value: withUnit(planet.orbital_period, "days") },
        { label: "Surface Water", value: withUnit(planet.surface_water, "%") },
      ]
    : [];

  let body;
  if (loading) {
    body = (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={YELLOW} />
      </View>
    );
  } else if (!connected && !planet) {
    body = (
      <View style={styles.center}>
        <Text style={styles.offlineTitle}>You are offline</Text>
        <Text style={styles.message}>
          This planet's details can't be loaded without a network connection.
        </Text>
      </View>
    );
  } else if (error) {
    body = (
      <View style={styles.center}>
        <Text style={styles.message}>{error}</Text>
      </View>
    );
  } else {
    body = (
      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero: name + the API's one-line description. */}
        <Text style={styles.title}>{planet.name || name}</Text>
        {description ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}

        {/* Stat tiles: two per row, wrapping. */}
        <View style={styles.grid}>
          {STATS.map((stat) => (
            <View key={stat.label} style={styles.tile}>
              <Text style={styles.tileLabel}>{stat.label}</Text>
              <Text style={styles.tileValue}>{stat.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back bar — returns to the planets list. */}
      <TouchableOpacity style={styles.backBar} onPress={onBack}>
        <Text style={styles.backText}>‹ Planets</Text>
      </TouchableOpacity>

      {body}
    </View>
  );
}

// ---- value formatting helpers ----
// swapi.tech returns everything as strings, often "unknown". These turn the
// raw values into something readable, and leave "Unknown" alone.
function isUnknown(value) {
  return value == null || value === "" || value.toLowerCase() === "unknown";
}

function capitalize(value) {
  if (isUnknown(value)) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

// Capitalizes each comma-separated part, e.g. "arid, temperate" -> "Arid,
// Temperate" (climate and terrain can list several values).
function titleCase(value) {
  if (isUnknown(value)) return "Unknown";
  return value
    .split(",")
    .map((part) => capitalize(part.trim()))
    .join(", ");
}

function withCommas(value) {
  if (isUnknown(value)) return "Unknown";
  const n = Number(value);
  return Number.isNaN(n) ? value : n.toLocaleString();
}

function withUnit(value, unit) {
  if (isUnknown(value)) return "Unknown";
  const n = Number(value);
  const shown = Number.isNaN(n) ? value : n.toLocaleString();
  return `${shown} ${unit}`;
}

const YELLOW = "#FFE81F";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backBar: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  backText: {
    color: YELLOW,
    fontSize: 16,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  message: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  offlineTitle: {
    color: YELLOW,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    padding: 20,
  },
  title: {
    color: YELLOW,
    fontSize: 34,
    fontWeight: "bold",
  },
  description: {
    color: "#aaa",
    fontSize: 15,
    fontStyle: "italic",
    marginTop: 6,
    marginBottom: 22,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tile: {
    width: "48%",
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 14,
  },
  tileLabel: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  tileValue: {
    color: YELLOW,
    fontSize: 20,
    fontWeight: "bold",
  },
});
