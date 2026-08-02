# SDEV257 Final Project — TMDB Movies App

A React Native / Expo mobile app that retrieves live data from the
**TMDB (The Movie Database)** REST API. It meets the final-project
requirements: a Flexbox-based interface with **two screens** that fetches and
displays real data from a REST API.

## What it does

- **Screen 1 — Popular Movies:** on launch the app calls TMDB's
  `/movie/popular` endpoint and shows the results in a scrolling list. Each row
  (a `MovieCard`) shows the poster, title, release year and star rating.
- **Screen 2 — Movie Detail:** tapping a movie opens a detail page that fetches
  the full record from `/movie/{id}` and shows the poster, rating, year,
  runtime, genres, tagline and full overview. A **Back to list** button returns
  to Screen 1.

Navigation between the two screens is a single piece of React state in
`App.js` — no navigation library required. The entire layout uses **Flexbox**
(`flexDirection`, `flex`, `justifyContent`, `alignItems`).

## API key

The TMDB API key (v3 auth) is already filled into the code (`tmdb.js` and the
Snack file), so the app runs as-is. To use your own key, get one free at
themoviedb.org (Settings → API → "API Key (v3 auth)") and replace
`TMDB_API_KEY`.

## Project structure

```
finalprojecttmdb/
├── App.js                     # root: switches between the two screens
├── tmdb.js                    # TMDB API key + fetch helpers
├── theme.js                   # shared colours
├── screens/
│   ├── MoviesScreen.js        # Screen 1: popular-movies list
│   └── MovieDetailScreen.js   # Screen 2: movie detail page
├── components/
│   └── MovieCard.js           # a single list row
├── App.snack-single-file.js   # everything inlined for snack.expo.dev
├── backup-omdb/               # backup OMDb version (see note below)
├── app.json / package.json / index.js / babel.config.js
└── README.md
```

## Running it

### Option A — Expo Snack (fastest)
1. Open <https://snack.expo.dev>.
2. Paste the contents of `App.snack-single-file.js` into `App.js`.
3. Press "Run" — use the web preview, or scan the QR code with Expo Go.

### Option B — Locally with the Expo CLI
```
npm install
npx expo start
```
Then open it in Expo Go (QR code), an emulator, or the web (`w`).

## API used (TMDB)

- Popular movies: `GET https://api.themoviedb.org/3/movie/popular?api_key=KEY`
- Movie details: `GET https://api.themoviedb.org/3/movie/{id}?api_key=KEY`
- Poster images: `https://image.tmdb.org/t/p/w500{poster_path}`

_This product uses the TMDB API but is not endorsed or certified by TMDB._

## Backup: OMDb version

`backup-omdb/` holds an alternate build of this app that uses the **OMDb**
(omdbapi.com) REST API instead of TMDB. It was made while TMDB was temporarily
network-blocked (a CloudFront 403). It's kept only as a fallback — the main app
above uses TMDB as the assignment requires.
