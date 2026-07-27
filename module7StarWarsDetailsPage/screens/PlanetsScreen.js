import React, { useState } from "react";
import SwapiList from "../components/SwapiList";
import PlanetDetail from "../components/PlanetDetail";

// Planets screen — fetches the list of planets from the Star Wars API.
// swapi.tech planets shape: { results: [{ uid, name, url }] }
// Header image (Chapter 26, lazy-loaded): Earth from Apollo 17 (Wikimedia).
//
// Module 7 ("Details page and navigation"): this is the one screen with a
// detail page. Swiping a planet row selects it and shows PlanetDetail (a
// simple state-based "push"); the detail page's back button clears the
// selection and returns to the list.
export default function PlanetsScreen() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <PlanetDetail
        uid={selected.id}
        name={selected.label}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <SwapiList
      url="https://www.swapi.tech/api/planets"
      image="https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/960px-The_Earth_seen_from_Apollo_17.jpg"
      parse={(json) =>
        json.results.map((planet) => ({ id: planet.uid, label: planet.name }))
      }
      onSwipeItem={setSelected}
    />
  );
}
