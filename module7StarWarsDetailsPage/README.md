# Module 07 Assignment — Star Wars Details Page

Star Wars app (built on the previous Star Wars Search module) finished off with
a **detail page and navigation**. Earlier modules made the rows swipeable but
did nothing useful with the swipe; now, on the **Planets** screen, swiping a
row navigates to a detail page showing the bulk of that planet's data.

## What's new in this module

- `components/PlanetDetail.js` — the detail page. It fetches the full record
  for one planet from swapi.tech's detail endpoint (`…/api/planets/{uid}`) and
  lays the data out as a grid of labelled **stat tiles**: climate, terrain,
  population, diameter, gravity, rotation period, orbital period, and surface
  water. It has a hero title + the API's description, a back button, and its
  own loading / offline / error states. Raw API strings are formatted for
  display (title-casing, thousands separators, units, `"unknown"` → `Unknown`).
- `components/SwapiList.js` — now takes an optional `onSwipeItem(item)` prop.
  When a screen passes it, swiping a row calls it (used to navigate); screens
  that don't pass it keep the old modal behaviour.
- `screens/PlanetsScreen.js` — holds the selected planet in state. Swiping a
  planet shows `PlanetDetail`; the back button clears the selection and
  returns to the list. (Per the assignment, only **one** screen — Planets —
  gets a detail page; Films and Spaceships still open the modal.)

## Carried over from earlier modules

- Module 7 (Search): live search box filtering each screen's list.
- Module 6: NetInfo offline detection (banner + "You are offline" messages).
- Chapter 26: lazy-loaded themed header image on each screen.
- Chapter 25: staggered slide-in animation on list rows (reanimated).
- Chapter 24: vertical ScrollView lists; each row is a swipeable
  (horizontal paging ScrollView).
- Chapter 23: swiping a Films/Spaceships row opens a modal with the item text.
- Data from the Star Wars API (swapi.tech): Planets, Films, Spaceships.
- iOS: bottom tab bar. Android: drawer navigation.

## Running it

```
npm install
npx expo start
```

Scan the QR code with Expo Go. On the Planets tab, swipe a row to the left to
open that planet's detail page; tap "‹ Planets" to go back.

## Snack version

`App.snack-single-file.js` is the whole app in one file — paste it into
https://snack.expo.dev (accept the prompts to add the
`react-native-reanimated` and `@react-native-community/netinfo`
dependencies).
