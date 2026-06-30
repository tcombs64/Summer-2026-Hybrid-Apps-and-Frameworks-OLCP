import React from "react";
import SwapiList from "../components/SwapiList";

// Spaceships screen — fetches the list of starships from the Star Wars API.
// swapi.tech starships shape: { results: [{ uid, name, url }] }
export default function SpaceshipsScreen() {
  return (
    <SwapiList
      url="https://www.swapi.tech/api/starships"
      parse={(json) =>
        json.results.map((ship) => ({ id: ship.uid, label: ship.name }))
      }
    />
  );
}
