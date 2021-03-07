import * as colors from "./colors";

export const addLayers = (map, source, activeState) => {
  !map.getSource("prefectures_data") &&
    map.addSource("prefectures_data", {
      type: "geojson",
      data: source,
    });
  !map.getLayer("prefectures") &&
    map.addLayer({
      id: "prefectures",
      type: "fill",
      source: "prefectures_data",
      paint: {
        "fill-opacity":
          activeState === "default"
            ? 1
            : ["case", ["boolean", ["feature-state", "hover"], false], 0.2, 0],
        "fill-color":
          activeState === "default"
            ? [
                "interpolate",
                ["linear"],
                ["get", "cases"],
                0,
                "#FFF",
                1000,
                colors.red,
              ]
            : "#FFF",
        "fill-outline-color": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          "black",
          "grey",
        ],
      },
    });
  !map.getLayer("pref-outline") &&
    map.addLayer({
      id: "pref-outline",
      type: "line",
      source: "prefectures_data",
      paint: {
        "line-width": 2,
        "line-color": "#FFF",
        "line-opacity": [
          "case",
          ["boolean", ["feature-state", "hover"], false],
          1,
          0,
        ],
      },
    });
};

export const addSatelliteLayer = (map) => {};

export const removeLayers = (map, mouseMove, mouseLeave) => {
  map.off("mousemove", (e) => mouseMove(map, e));
  map.off("mouseleave", "prefectures", (e) => mouseLeave(map, e));
  map.getLayer("prefectures") && map.removeLayer("prefectures");
  map.getLayer("pref-outline") && map.removeLayer("pref-outline");
  map.getSource("prefectures_data") && map.removeSource("prefectures_data");
};
