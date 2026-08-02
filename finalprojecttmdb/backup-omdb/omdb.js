// omdb.js
// -----------------------------------------------------------------------------
// All communication with the OMDb (Open Movie Database) REST API lives here.
// Keeping it in one module means the screens don't have to know any URLs or
// how a request is built -- they just call searchMovies() / getMovieDetails().
//
// OMDb is used instead of TMDB because TMDB's servers (CloudFront) block this
// network with a 403 error. OMDb is another free movie REST API.
//
// The free API key below was generated at https://www.omdbapi.com/apikey.aspx
// (a key is emailed to you instantly).
// -----------------------------------------------------------------------------

// Free OMDb API key.
export const OMDB_API_KEY = "4d2add6f";

// Base URL for every OMDb request. HTTPS matters: Expo Snack runs on an https
// page and would block a plain http request.
const API_BASE = "https://www.omdbapi.com/";

// True when a real key is present (guards against forgetting to set one).
export function hasApiKey() {
  return OMDB_API_KEY && OMDB_API_KEY !== "YOUR_OMDB_API_KEY_HERE";
}

// OMDb returns the string "N/A" (not null) when a movie has no poster, so we
// treat that as "no image" and let the UI show a placeholder instead.
export function posterUrl(poster) {
  return poster && poster !== "N/A" ? poster : null;
}

// Shared request helper: attaches the key, checks the HTTP status, parses JSON.
// OMDb always returns 200 and signals problems with a "Response":"False" field,
// which each function below inspects.
async function omdbFetch(params) {
  if (!hasApiKey()) {
    throw new Error(
      "No OMDb API key set. Open omdb.js and paste your key into OMDB_API_KEY."
    );
  }

  const url = `${API_BASE}?apikey=${OMDB_API_KEY}&${params}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`OMDb request failed (HTTP ${response.status}).`);
  }
  return response.json();
}

// Search movies by title (Screen 1). Returns an array of summaries, each with
// Title, Year, imdbID, Poster and Type. An empty array means "no matches".
// type=movie keeps the results to films (no TV series / episodes).
export async function searchMovies(query) {
  const data = await omdbFetch(`s=${encodeURIComponent(query)}&type=movie`);

  if (data.Response === "False") {
    // "Movie not found!" is a normal empty result, not a real error.
    if (data.Error && /not found/i.test(data.Error)) return [];
    throw new Error(data.Error || "OMDb search failed.");
  }
  return data.Search || [];
}

// Full details for one movie by its IMDb id (Screen 2): Plot, imdbRating,
// Runtime, Genre, Director, Actors, etc. plot=full asks for the long summary.
export async function getMovieDetails(imdbID) {
  const data = await omdbFetch(`i=${encodeURIComponent(imdbID)}&plot=full`);

  if (data.Response === "False") {
    throw new Error(data.Error || "Movie not found.");
  }
  return data;
}
