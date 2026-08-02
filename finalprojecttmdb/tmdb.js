// tmdb.js
// -----------------------------------------------------------------------------
// All communication with the TMDB (The Movie Database) REST API lives here.
// Keeping it in one module means the screens don't have to know any URLs or
// how the request is built -- they just call getPopularMovies() etc.
//
// The free API key below was generated at themoviedb.org
// (Settings -> API -> "API Key (v3 auth)").
// -----------------------------------------------------------------------------

// TMDB v3 API key.
export const TMDB_API_KEY = "b80e0c33c37a241814e2525b383c03e9";

// Base URL shared by every REST endpoint.
const API_BASE = "https://api.themoviedb.org/3";

// Base URL for poster images. "w500" is the requested image width in pixels.
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// True once a real key is present (guards against forgetting to set one).
export function hasApiKey() {
  return TMDB_API_KEY && TMDB_API_KEY !== "YOUR_TMDB_API_KEY_HERE";
}

// Build a full poster image URL from the short path TMDB returns
// (e.g. "/abc123.jpg"). Returns null when a movie has no poster so the UI
// can show a placeholder instead of a broken image.
export function posterUrl(path) {
  return path ? `${IMAGE_BASE}${path}` : null;
}

// Shared request helper: attaches the API key, checks the HTTP status, and
// returns the parsed JSON body. Every function below goes through this.
async function tmdbFetch(path) {
  if (!hasApiKey()) {
    throw new Error(
      "No TMDB API key set. Open tmdb.js and paste your key into TMDB_API_KEY."
    );
  }

  // TMDB v3 auth passes the key as a query-string parameter.
  const separator = path.includes("?") ? "&" : "?";
  const url = `${API_BASE}${path}${separator}api_key=${TMDB_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`TMDB request failed (HTTP ${response.status}).`);
  }
  return response.json();
}

// GET /movie/popular  ->  array of the current popular movies (Screen 1).
export async function getPopularMovies() {
  const data = await tmdbFetch("/movie/popular");
  return data.results || [];
}

// GET /movie/{id}  ->  the full record for one movie: runtime, genres,
// tagline, etc. (Screen 2).
export async function getMovieDetails(id) {
  return tmdbFetch(`/movie/${id}`);
}
