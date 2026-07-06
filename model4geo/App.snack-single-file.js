import React, { useState, useEffect } from "react";
import { Text, View, StatusBar, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

StatusBar.setBarStyle("dark-content");

// Overpass API (OpenStreetMap) lets us search for nearby restaurants
// without needing a Google API key.
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// Straight-line distance between two coordinates, good enough
// for ranking which restaurant is closest.
function distance(lat1, lon1, lat2, lon2) {
  return Math.hypot(lat1 - lat2, lon1 - lon2);
}

export default function App() {
  const [region, setRegion] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [message, setMessage] = useState("Finding your location...");

  useEffect(() => {
    (async () => {
      // Ask for permission to use the device's GPS (chapter 21, "Using Location API")
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setMessage("Permission to access location was denied");
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

      // Find restaurants within 2km of the current position
      try {
        const query = `[out:json];node["amenity"="restaurant"](around:2000,${latitude},${longitude});out;`;
        const resp = await fetch(
          `${OVERPASS_URL}?data=${encodeURIComponent(query)}`
        );
        const { elements } = await resp.json();
        const named = elements.filter((e) => e.tags && e.tags.name);

        if (named.length === 0) {
          setMessage("No restaurants found within 2km");
          return;
        }

        // Annotate the closest one (chapter 21, "Annotating points of interest")
        named.sort(
          (a, b) =>
            distance(a.lat, a.lon, latitude, longitude) -
            distance(b.lat, b.lon, latitude, longitude)
        );
        setRestaurant(named[0]);
        setMessage(`Nearby restaurant: ${named[0].tags.name}`);
      } catch (error) {
        setMessage(`Restaurant lookup failed: ${error.message}`);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.label}>{message}</Text>
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
              title={restaurant.tags.name}
              description={
                restaurant.tags.cuisine
                  ? `Cuisine: ${restaurant.tags.cuisine}`
                  : "Nearby restaurant"
              }
              coordinate={{
                latitude: restaurant.lat,
                longitude: restaurant.lon,
              }}
            />
          )}
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "ghostwhite",
  },
  mapView: {
    alignSelf: "stretch",
    flex: 1,
  },
  banner: {
    alignSelf: "stretch",
    padding: 12,
    paddingTop: 48,
    backgroundColor: "ghostwhite",
  },
  label: {
    fontSize: 16,
    textAlign: "center",
  },
});
