import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import mapboxgl from "mapbox-gl";

import styled from "styled-components";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { get } from "lodash";

import {
  ACCESS_TOKEN,
  DEFAULT_STYLE,
  SATELLITE_STYLE,
  DEFAULT_SETTINGS,
} from "../constants";
import * as colors from "../colors";
import { addLayers, removeLayers } from "../maputils";

import JapanMarker from "../asset/japanmarker.png";

import { Text } from "grommet";

import TooltipContent from "./TooltipContent";

import CovidData from "../state/CovidData";
import MapState from "../state/MapState";

const BackButton = styled(({ className, onClick }) => (
  <span className={className} onClick={onClick} color="#000">
    Back{" "}
  </span>
))`
  position: absolute;
  z-index: 1000;
  transform: translate(50vw, 22%);
  border-radius: 10px;
  padding: 10px 50px;
  background-color: #fff;
  color: #000;
  font-weight: bold;
  border-color: grey;
  :focus,
  :active {
    outline: 0;
    border: 0;
  }
`;
const Legend = styled(({ className }) => (
  <div className={className}>
    <Text size="12px">0</Text>
    <div>
      <svg width={80} height={20}>
        {colors.cases.map((d, i) => (
          <rect
            key={i}
            height={20}
            width={20}
            x={i * 20}
            fill={d}
            stroke={"black"}
          />
        ))}
      </svg>
    </div>
    <Text size="12px">+1000 cases</Text>
  </div>
))`
  display: flex;
  gap: 10px;
  flex-direction: row;
  position: absolute;
  z-index: 1000;
  transform: translate(50vw, 0);
  bottom: 0;
  margin-bottom: 10px;
`;
const Map = styled(({ className }) => {
  const mapContainer = useRef();
  const popupNode = useRef();
  const markerNode = useRef();
  const {
    map,
    setMap,
    activePref,
    setActivePref,
    filterValue,
    setFilterValue,
    activeState,
    setActiveState,
  } = MapState.useContainer();

  let hoverId = null;
  const popup = useRef(
    new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      anchor: "bottom",
      offset: 30,
    })
  );
  let el = document.createElement("div");
  el.className = "marker";
  const marker = new mapboxgl.Marker(markerNode.current, { offset: [0, -20] });
  const { prefectures } = CovidData.useContainer();
  const back = () => {
    removeLayers(map, mouseMove, mouseLeave);
    setActiveState("default");
    setFilterValue(0);
    map.flyTo({
      ...DEFAULT_SETTINGS,
    });
  };
  const mouseMove = (map, { point, lngLat }) => {
    if (activeState === "default" && map.getLayer("prefectures")) {
      const isSatelliteStyle = map.getStyle().name === "Mapbox Satellite";
      const query = map.queryRenderedFeatures(point, {
        layers: ["prefectures"],
      });

      if (query.length) {
        (hoverId || hoverId === 0) &&
          map.setFeatureState(
            { source: "prefectures_data", id: hoverId },
            { hover: false }
          );
        hoverId = query[0].id;
        const coordinates = [lngLat.lng, lngLat.lat];
        map.getCanvas().style.cursor = "pointer";
        map.setFeatureState(
          { source: "prefectures_data", id: hoverId },
          { hover: true }
        );
        if (!isSatelliteStyle) {
          ReactDOM.render(
            <TooltipContent
              data={query[0].properties}
              rankings={prefectures.features}
            />,
            popupNode.current
          );
          popup.current
            .setLngLat(coordinates)
            .setDOMContent(popupNode.current)
            .addTo(map);
        }
      } else {
        map.setFeatureState(
          { source: "prefectures_data", id: hoverId },
          { hover: false }
        );
      }
    }
  };
  const mouseLeave = (map, { point, lngLat }) => {
    if (activeState === "default") {
      popup.current.remove();
      map.getCanvas().style.cursor = "";
    }
  };
  mapboxgl.accessToken = ACCESS_TOKEN;
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: DEFAULT_STYLE,
      ...DEFAULT_SETTINGS,
    });
    if (prefectures) {
      map.on("load", () => {
        addLayers(map, prefectures, activeState);
        const onZoom = () => {
          if (map.getZoom() > 7 && activeState === "default") {
            setActiveState("satellite");
          }
        };
        map.on("zoom", onZoom);
        map.on("mousemove", (e) => mouseMove(map, e));
        map.on("mouseleave", "prefectures", (e) => mouseLeave(map, e));
        map.on("click", ({ point, lngLat }) => {
          const isSatelliteStyle = map.getStyle().name === "Mapbox Satellite";
          //Fly on Click
          map.flyTo({
            center: [lngLat.lng, lngLat.lat],
            zoom: map.getZoom(),
            pitch: 0,
            bearing: 0,
            speed: 0.7,
          });

          if (!isSatelliteStyle) {
            const query = map.queryRenderedFeatures(point)[0];
            if (query && query.source === "prefectures_data") {
              // map.off("mousemove", (e) => mouseMove(map, e));
              // map.off("mouseleave", "prefectures", (e) => mouseLeave(map, e));
              popup.current.remove();
              map.removeLayer("prefectures");
              map.removeLayer("pref-outline");
              map.removeSource("prefectures_data");
              marker.setLngLat([lngLat.lng, lngLat.lat]).addTo(map);
              setActiveState("satellite");
              setActivePref(get(query, `properties`, null));
              setFilterValue(0);
              map.flyTo({
                center: [lngLat.lng, lngLat.lat],
                zoom: 7,
                pitch: 0,
                bearing: 0,
                speed: 0.7,
              });
            }
          } else if (isSatelliteStyle) {
            const query = map.queryRenderedFeatures(point)[0];
            marker.setLngLat([lngLat.lng, lngLat.lat]).addTo(map);
            setActivePref(get(query, `properties`, null));
          }
        });

        setMap(map);
      });
    }
    return () => map.remove();
  }, [!prefectures]);

  useEffect(() => {
    if (map) {
      const isSatelliteStyle = map.getStyle().name === "Mapbox Satellite";

      if (activeState === "default" && isSatelliteStyle) {
        map.setStyle(DEFAULT_STYLE);
        setTimeout(() => {
          setActiveState("default");
          addLayers(map, prefectures, activeState);
          map.on("mousemove", (e) => mouseMove(map, e));
          map.on("mouseleave", "prefectures", (e) => mouseLeave(map, e));
        }, 1000);
      } else if (activeState === "satellite" && !isSatelliteStyle) {
        map.setStyle(SATELLITE_STYLE);

        setTimeout(() => {
          addLayers(map, prefectures, activeState);
          map
            // .setPaintProperty("prefectures", "fill-opacity", 0)
            .setPaintProperty("pref-outline", "line-opacity", 1);
        }, 1000);
      }
    }
  }, [activeState]);
  useEffect(() => {
    if (map) {
      const isSatelliteStyle = map.getStyle().name === "Mapbox Satellite";
      removeLayers(map);
      addLayers(map, prefectures, activeState);
      setFilterValue(0);
      if (isSatelliteStyle) {
        map
          .setPaintProperty("prefectures", "fill-opacity", 0)
          .setPaintProperty("pref-outline", "line-opacity", 1);
      }
    }
  }, [prefectures]);
  useEffect(() => {
    if (map && map.getLayer("prefectures")) {
      map.setFilter("prefectures", [
        ">=",
        ["number", ["get", "cases"]],
        filterValue,
      ]);
    }
  }, [filterValue]);
  return (
    <>
      <div className={className} ref={mapContainer}></div>
      {activeState === "satellite" && <BackButton onClick={back} />}
      {/* {activeState === "default" && <Legend />} */}
      <div>
        <div ref={popupNode} />
        <div
          className="marker"
          ref={markerNode}
          style={{ display: activeState === "default" ? "none" : "block" }}
        />
      </div>
    </>
  );
})`
  width: 100%;
  height: 100vh;
  canvas {
    outline: none;
  }

  .mapboxgl-ctrl-top-right {
    left: 0;
    right: unset;
  }
  .mapboxgl-popup-tip {
    display: none;
  }
  .mapboxgl-popup-content {
    min-width: 220px;
    max-height: 300px;
    text-align: center;
    background: rgba(255, 255, 255, 0.9);
    padding: 10px 0 10px 0;
  }
  .button {
    transform: translate(50px, 0)
    z-index: 5000;
  }
  .marker {
    background-image: url(${JapanMarker});
    background-size: contain;
    width: 50px;
    height: 50px;
    background-repeat: no-repeat;
    ${({ activeState }) => (activeState === "default" ? "display: none;" : "")}
  }
`;

export default Map;
