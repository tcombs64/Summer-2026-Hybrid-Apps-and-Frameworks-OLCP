import React from "react";
import SwapiList from "../components/SwapiList";

// Planets screen — fetches the list of planets from the Star Wars API.
// swapi.tech planets shape: { results: [{ uid, name, url }] }
export default function PlanetsScreen() {
  return (
    <SwapiList
      url="https://www.swapi.tech/api/planets"
      parse={(json) =>
        json.results.map((planet) => ({ id: planet.uid, label: planet.name }))
      }
    />
  );
}
