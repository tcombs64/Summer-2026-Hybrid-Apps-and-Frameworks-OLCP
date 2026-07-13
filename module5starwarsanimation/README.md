# Module 5 — Star Wars app: Animation (Chapter 25)

Builds on the ScrollView + Swipeable Star Wars app from this module's
Programming Assignment 1.

## The animation

**Where:** the list items on every screen (Planets / Films / Spaceships).

**What:** when the data arrives from the Star Wars API and the rows mount,
each row slides in from the left with a spring, staggered by 80ms per row so
the list cascades in. This uses react-native-reanimated's layout `entering`
animation (`SlideInLeft`), as covered in Chapter 25:

```jsx
<Animated.View
  entering={SlideInLeft.delay(index * 80).springify().damping(18)}
  ...
>
```

See `components/SwipeableRow.js` — the row's outer View became an
`Animated.View` with the `entering` prop, and `components/SwapiList.js`
passes each row its `index` for the stagger.

## Files

- `components/SwipeableRow.js` — **the animation lives here** (Chapter 25),
  plus the Chapter 24 swipeable behavior.
- `components/SwapiList.js` — fetch + ScrollView list, passes `index`.
- `components/ItemModal.js` — Chapter 23 modal shown on swipe.
- `App.js`, `screens/` — navigation shell and the three screens.
- `App.snack-single-file.js` — everything in one file for Expo Snack.

## Running

```
npm install
npx expo start
```

Open in Expo Go and watch the rows cascade in; switch tabs to replay it.
