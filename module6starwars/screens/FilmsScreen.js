import React from "react";
import SwapiList from "../components/SwapiList";

// Films screen — fetches the list of films from the Star Wars API.
// NOTE: swapi.tech films use a DIFFERENT shape than planets/starships:
//   { result: [{ uid, properties: { title, ... } }] }
// so we read `result` (singular) and `properties.title`.
// Header image (Chapter 26, lazy-loaded): the iconic still from the first
// sci-fi film, "A Trip to the Moon" (1902), from Wikimedia.
export default function FilmsScreen() {
  return (
    <SwapiList
      url="https://www.swapi.tech/api/films"
      image="https://upload.wikimedia.org/wikipedia/commons/0/04/Le_Voyage_dans_la_lune.jpg"
      parse={(json) =>
        json.result.map((film) => ({
          id: film.uid,
          label: film.properties.title,
        }))
      }
    />
  );
}
