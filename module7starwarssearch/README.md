# Module 07 Assignment — Star Wars Search

Star Wars app (built on the Module 6 app) extended so each screen has a search
box at the top. Earlier modules popped up a *dialog* to search; now typing in
the box **filters the shown list live** — no dialog.

## What's new in this module

- `components/SwapiList.js` — a `TextInput` search box renders at the top of
  every screen, just under the header image. The current text is held in state
  (`query`); the visible list is derived by filtering the fetched items with a
  case-insensitive substring match on each item's name:

  ```js
  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.trim().toLowerCase())
  );
  ```

  The list re-renders on every keystroke, so it narrows as you type. An empty
  box shows everything; when nothing matches, a "No matches for …" message
  appears instead of an empty list.

## Carried over from earlier modules

- Module 6: NetInfo offline detection — red banner + "You are offline"
  message; lists load automatically when the connection returns.
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

Scan the QR code with Expo Go. Type in the search box at the top of a screen to
filter that screen's list.

## Snack version

`App.snack-single-file.js` is the whole app in one file — paste it into
https://snack.expo.dev (accept the prompts to add the
`react-native-reanimated` and `@react-native-community/netinfo`
dependencies).
