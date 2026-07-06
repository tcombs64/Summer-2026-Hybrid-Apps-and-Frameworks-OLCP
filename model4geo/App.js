import React, { useState, useEffect, useCallback } from "react";
import { Text, View, StatusBar, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import styles from "./styles";

StatusBar.setBarStyle("dark-content");

// We use OpenStreetMap's free Nominatim service to find nearby
// restaurants. No Google API key required.
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

// Straight-line distance between two coordinates, good enough
// for ranking which restaurant is closest.
function distance(lat1, lon1, lat2, lon2) {
  return Math.hypot(lat1 - lat2, lon1 - lon2);
}

// Fetch and parse JSON, but fail loudly if the server hands back an
// HTML error page (which is what caused the "unexpected character: <"
// error when the previous map data server was overloaded).
async function fetchJson(url) {
  const resp = await fetch(url, {
    headers: {
      // Nominatim's usage policy asks for an identifying User-Agent.
      "User-Agent": "module4-geolocation-school-app",
      Accept: "application/json",
    },
  });
  const text = await resp.text();
  if (!resp.ok) {
    throw new Error(`server returned HTTP ${resp.status}`);
  }
  if (text.trim().startsWith("<")) {
    throw new Error("server was busy, please retry");
  }
  return JSON.parse(text);
}

// Look up restaurants inside a small box around the given position and
// return them as { name, cuisine, latitude, longitude }, closest first.
async function findRestaurants(latitude, longitude) {
  const d = 0.02; // ~2km box
  const viewbox = `${longitude - d},${latitude + d},${longitude + d},${
    latitude - d
  }`;
  const url =
    `${NOMINATIM_URL}?q=restaurant&format=jsonv2&limit=20` +
    `&bounded=1&viewbox=${viewbox}`;

  const results = await fetchJson(url);
  return results
    .filter((r) => r.name)
    .map((r) => ({
      name: r.name,
      cuisine: r.type,
      latitude: parseFloat(r.lat),
      longitude: parseFloat(r.lon),
    }))
    .sort(
      (a, b) =>
        distance(a.latitude, a.longitude, latitude, longitude) -
        distance(b.latitude, b.longitude, latitude, longitude)
    );
}

export default function App() {
  const [region, setRegion] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [message, setMessage] = useState("Finding your location...");
  const [loading, setLoading] = useState(true);

  const locate = useCallback(async () => {
    setLoading(true);
    setRestaurant(null);
    setMessage("Finding your location...");

    // Ask for permission to use the device's GPS (chapter 21, "Using Location API")
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setMessage("Permission to access location was denied");
      setLoading(false);
      return;
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({});

    // Center the map on where we are (chapter 21, "Rendering the Map")
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
    setMessage("Looking for a nearby restaurant...");

    // Annotate the closest restaurant (chapter 21, "Annotating points of interest")
    try {
      const found = await findRestaurants(latitude, longitude);
      if (found.length === 0) {
        setMessage("No restaurants found nearby");
      } else {
        setRestaurant(found[0]);
        setMessage(`Nearby restaurant: ${found[0].name}`);
      }
    } catch (error) {
      setMessage(`Couldn't load restaurants: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    locate();
  }, [locate]);

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.label}>{message}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={locate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "..." : "Retry"}</Text>
        </TouchableOpacity>
      </View>
      {region && (
        <MapView
          style={styles.mapView}
          region={region}
          showsPointsOfInterest={false}
          showsUserLocation
          followUserLocation
        >
          {restaurant && (
            <Marker
              title={restaurant.name}
              description={
                restaurant.cuisine
                  ? `Cuisine: ${restaurant.cuisine}`
                  : "Nearby restaurant"
              }
              coordinate={{
                latitude: restaurant.latitude,
                longitude: restaurant.longitude,
              }}
            />
          )}
        </MapView>
      )}
    </View>
  );
}
