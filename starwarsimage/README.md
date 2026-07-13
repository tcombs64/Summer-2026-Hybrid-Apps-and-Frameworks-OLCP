# Star Wars app: Lazy-loaded header images (Chapter 26)

Builds on the Star Wars app from the previous assignment (ScrollView +
Swipeable rows + modal + entering animation).

## What was added

**A lazy-loaded, theme-appropriate image at the top of each screen**
(Chapter 26, "Lazy image loading"):

- **Planets** — Earth photographed from Apollo 17
- **Films** — the iconic still from *A Trip to the Moon* (1902), the first
  sci-fi film
- **Spaceships** — Space Shuttle Columbia launching

All three are hotlinked from Wikimedia Commons.

### How the lazy loading works

`components/LazyImage.js` follows the book's Chapter 26 pattern: a bundled
placeholder image (`assets/placeholder.png`) renders immediately, and the
real remote image only replaces it once its `onLoad` event fires — so the
user sees a themed "loading image..." frame instead of an empty box while
the download happens.

```jsx
<LazyImage
  style={{ width: imageWidth, height: 160 }}
  resizeMode="cover"
  source={{ uri: image }}
/>
```

Each screen passes its `image` URL to `SwapiList`, which renders the
`LazyImage` above the list (see `components/SwapiList.js`).

## Files

- `components/LazyImage.js` — **new** (Chapter 26): placeholder-until-loaded
  image component.
- `assets/placeholder.png` — **new**: themed placeholder shown while the
  real image downloads.
- `components/SwapiList.js` — renders the lazy header image, then the
  fetched list.
- `components/SwipeableRow.js`, `components/ItemModal.js`, `screens/`,
  `App.js` — from the previous assignments (Chapters 23-25).
- `App.snack-single-file.js` — everything in one file for Expo Snack (the
  placeholder is inlined as a data URI there, since Snack gets no assets
  folder).

## Running

```
npm install
npx expo start
```

Open in Expo Go — each screen shows its placeholder frame for a moment,
then the real image fades in once downloaded.
