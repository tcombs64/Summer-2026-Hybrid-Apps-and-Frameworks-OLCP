# Star Wars App

A React Native app (foundation for the course project) to look up and view
Planets, Spaceships, and Films from the Star Wars universe.

This first version sets up three screens and platform-specific navigation:

- **iOS:** bottom tab navigation
- **Android:** drawer navigation

Each screen currently displays its name. Content will be added later in the course.

## Screens

- Planets
- Films
- Spaceships

## Navigation

Navigation is chosen at runtime based on the platform (see `App.js`):

```js
{Platform.OS === "ios" ? <TabNavigator /> : <DrawerNavigator />}
```

- On **iOS** the app renders a `createBottomTabNavigator` with tabs on the bottom.
- On **Android** the app renders a `createDrawerNavigator` with a side drawer
  (swipe from the left edge or tap the hamburger icon).

## Running the app

### In Expo Snack
1. Open https://snack.expo.dev
2. Recreate the file structure (App.js + screens/ folder) or paste the combined
   single-file version.
3. The required navigation dependencies are available in Snack automatically.
4. Use the iOS and Android preview tabs to confirm tabs vs. drawer.

### Locally
```bash
npm install
npx expo start
```

## Dependencies

- @react-navigation/native
- @react-navigation/bottom-tabs
- @react-navigation/drawer
- react-native-screens
- react-native-safe-area-context
- react-native-gesture-handler
- react-native-reanimated
