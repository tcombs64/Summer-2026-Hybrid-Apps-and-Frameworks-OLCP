# Module 04 Assignment 2 — Star Wars Search

Extends the Star Wars app from Module 2 (Planets / Films / Spaceships with
platform-specific navigation) by adding a search feature, using concepts from
Chapters 22 and 23.

## What was added

- A **search box** (`TextInput`) at the top of **every screen** where the user
  can type a search term (Chapter 22, "Collecting text input").
- When the user submits — by pressing the **Search** button or the keyboard's
  search/return key — the entered text is shown in a **modal dialog**
  (Chapter 23, "Confirmation modals"). The modal has a **Close** button.

The original app is unchanged otherwise: three screens, with iOS bottom tabs
and an Android drawer.

## File structure

- `App.js` — wraps the platform navigator in a `NavigationContainer`
- `Navigation.ios.js` — bottom tabs (iOS)
- `Navigation.android.js` — drawer (Android)
- `Navigation.js` — bottom tabs (web / fallback)
- `screens/` — `PlanetsScreen`, `FilmsScreen`, `SpaceshipsScreen`
- `components/SearchScreen.js` — reusable screen with the search box + modal
- `components/SearchModal.js` — the modal that displays the submitted term
- `styles.js` — shared styles
- `App.snack-single-file.js` — everything combined for Expo Snack

The navigator is split into platform-specific files so that iOS only loads
the bottom-tab navigator. The Android drawer depends on
`react-native-reanimated`, whose native module can crash in Expo Go on iOS;
keeping it in an Android-only file avoids that while preserving the original
iOS-tabs / Android-drawer behavior.

## Running it

### In Expo Snack
1. Open https://snack.expo.dev
2. Paste the contents of `App.snack-single-file.js` into `App.js`.
3. Snack installs the navigation dependencies automatically.
4. Use the **iOS** preview to see bottom tabs, **Android** to see the drawer.
5. Type a search term, press **Search**, and the modal shows it.

### Locally
```bash
npm install
npx expo start
```

## Dependencies

- @react-navigation/native, @react-navigation/bottom-tabs,
  @react-navigation/drawer
- react-native-screens, react-native-safe-area-context,
  react-native-gesture-handler, react-native-reanimated
