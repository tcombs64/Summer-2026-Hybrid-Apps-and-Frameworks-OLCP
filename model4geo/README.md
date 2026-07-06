# Module 04 Assignment — Geo-location

React Native (Expo) app that uses the phone's GPS to show my current
position on a map and annotates one nearby restaurant, based on
Chapter 21 of *React and React Native, 4th Edition*.

## How it works

- `expo-location` asks for foreground location permission and reads the
  device's current GPS coordinates (chapter 21, "Using Location API").
- `react-native-maps` renders a `MapView` centered on that position with
  the user's location shown (chapter 21, "Rendering the Map").
- The app queries the free OpenStreetMap Overpass API for restaurants
  within 2 km, picks the closest one, and drops a `Marker` on it
  (chapter 21, "Annotating points of interest"). No Google API key needed.

## Running it

```
npm install
npx expo start
```

Scan the QR code with the Expo Go app on your phone, then grant the
location permission when prompted. The map centers on your position and
a pin appears on the nearest restaurant with its name and cuisine.

## Files

- `App.js` — location lookup, restaurant search, and map rendering
- `styles.js` — StyleSheet, following the book's project layout
