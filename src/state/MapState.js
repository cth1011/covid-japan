import { useState } from "react";
import { createContainer } from "unstated-next";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";
import { ACCESS_TOKEN } from "../constants";

const useMapState = () => {
  const [map, setMap] = useState(null);
  const [activePref, setActivePref] = useState(null);
  const [filterValue, setFilterValue] = useState(0);
  const [activeState, setActiveState] = useState("default");
  const [geocoder] = useState(
    new MapboxGeocoder({
      accessToken: ACCESS_TOKEN,
      mapboxgl: mapboxgl,
      placeholder: "Search prefecture...",
      types: "region",
      countries: "JP",
      marker: false,
    }).setFlyTo({ zoom: 8 })
  );
  return {
    map,
    setMap,
    geocoder,
    activePref,
    setActivePref,
    filterValue,
    setFilterValue,
    activeState,
    setActiveState,
  };
};

const MapState = createContainer(useMapState);

export default MapState;
