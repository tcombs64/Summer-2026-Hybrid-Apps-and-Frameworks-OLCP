# Module 5 — Star Wars app: ScrollView + Swipeable

Builds on the Star Wars app from the previous module (Planets / Films /
Spaceships fetched from https://www.swapi.tech).

What was added for this module:

1. **ScrollView (Chapter 24)** — each screen's list of fetched items is
   rendered inside a vertical `ScrollView`, so the list can be scrolled when
   it extends past the bottom of the screen.
2. **Swipeable items (Chapter 24)** — each list item is a `SwipeableRow`: a
   horizontal `ScrollView` with `pagingEnabled`, following the book's
   "swipeable and cancellable" example. Swiping an item a full page to the
   left triggers its action, then the row snaps back.
3. **Modal dialog (Chapter 23)** — the swipe action opens a `Modal` that
   displays the text of the swiped item, with a Close button.

## Files

- `App.js` — navigation shell (iOS bottom tabs / Android drawer, Flexbox).
- `components/SwapiList.js` — fetches a SWAPI endpoint, renders the items in
  a ScrollView of SwipeableRows, and owns the modal state.
- `components/SwipeableRow.js` — the Chapter 24-style swipeable list row.
- `components/ItemModal.js` — the Chapter 23-style modal dialog.
- `screens/` — Planets, Films, Spaceships screens (each passes its endpoint
  and a parse function to SwapiList).
- `App.snack-single-file.js` — everything combined into one file for pasting
  into Expo Snack.

## Running

```
npm install
npx expo start
```

Scan the QR code with Expo Go, swipe any list item to the left to see the
modal.
