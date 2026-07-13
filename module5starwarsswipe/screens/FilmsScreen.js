import React from "react";
import SwapiList from "../components/SwapiList";

// Films screen — fetches the list of films from the Star Wars API.
// NOTE: swapi.tech films use a DIFFERENT shape than planets/starships:
//   { result: [{ uid, properties: { title, ... } }] }
// so we read `result` (singular) and `properties.title`.
export default function FilmsScreen() {
  return (
    <SwapiList
      url="https://www.swapi.tech/api/films"
      parse={(json) =>
        json.result.map((film) => ({
          id: film.uid,
          label: film.properties.title,
        }))
      }
    />
  );
}
