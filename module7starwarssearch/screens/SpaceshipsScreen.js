import React from "react";
import SwapiList from "../components/SwapiList";

// Spaceships screen — fetches the list of starships from the Star Wars API.
// swapi.tech starships shape: { results: [{ uid, name, url }] }
// Header image (Chapter 26, lazy-loaded): Space Shuttle Columbia launching
// (Wikimedia).
export default function SpaceshipsScreen() {
  return (
    <SwapiList
      url="https://www.swapi.tech/api/starships"
      image="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Space_Shuttle_Columbia_launching.jpg/960px-Space_Shuttle_Columbia_launching.jpg"
      parse={(json) =>
        json.results.map((ship) => ({ id: ship.uid, label: ship.name }))
      }
    />
  );
}
