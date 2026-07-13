import React from "react";
import SwapiList from "../components/SwapiList";

// Planets screen — fetches the list of planets from the Star Wars API.
// swapi.tech planets shape: { results: [{ uid, name, url }] }
// Header image (Chapter 26, lazy-loaded): Earth from Apollo 17 (Wikimedia).
export default function PlanetsScreen() {
  return (
    <SwapiList
      url="https://www.swapi.tech/api/planets"
      image="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/960px-The_Earth_seen_from_Apollo_17.jpg"
      parse={(json) =>
        json.results.map((planet) => ({ id: planet.uid, label: planet.name }))
      }
    />
  );
}
