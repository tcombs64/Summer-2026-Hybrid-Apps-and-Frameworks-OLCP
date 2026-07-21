# Module 06 Assignment 1 — Star Wars Going Offline

Star Wars app (built on the Module 5 app) extended to detect whether the
network is present and accessible, and to display a meaningful message to the
user when it isn't.

## What's new in this module

Network detection uses `@react-native-community/netinfo`:

- `components/useConnected.js` — hook that subscribes to NetInfo and reports
  the live connection state. Components using it re-render the moment the
  network drops or comes back.
- `components/OfflineNotice.js` — red "No network connection — you are
  offline" banner that appears under the app header whenever the device is
  offline (and disappears when it reconnects).
- `components/SwapiList.js` — while offline, the list screens skip fetching
  and show a meaningful "You are offline" message explaining that the data
  can't be loaded without a connection. When the network returns, the data
  loads automatically (the fetch effect re-runs when the connection state
  changes).

## Carried over from earlier modules

- Chapter 26: lazy-loaded themed header image on each screen.
- Chapter 25: staggered slide-in animation on list rows (reanimated).
- Chapter 24: vertical ScrollView lists; each row is a swipeable
  (horizontal paging ScrollView).
- Chapter 23: swiping a row opens a modal with the item's text.
- Data from the Star Wars API (swapi.tech): Planets, Films, Spaceships.
- iOS: bottom tab bar. Android: drawer navigation.

## Running it

```
npm install
npx expo start
```

Scan the QR code with Expo Go. To test the offline behavior, turn on
airplane mode (or turn off Wi-Fi/data) — the banner and offline message
appear; turn the network back on and the lists load again.

## Snack version

`App.snack-single-file.js` is the whole app in one file — paste it into
https://snack.expo.dev (accept the prompts to add the
`react-native-reanimated` and `@react-native-community/netinfo`
dependencies).
