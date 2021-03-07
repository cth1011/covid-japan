import { useState, useEffect } from "react";
import { createContainer } from "unstated-next";
import PREFECTURES_GEOJSON from "../prefectures.json";

import { sortBy } from "lodash";
import { toDate } from "../utils";
import * as d3 from "d3";
import axios from "axios";
import api from "./api";

const useCovidData = () => {
  const callAPI = () => {
    axios
      .all([
        api.get(
          "https://covid19-japan-web-api.now.sh/api/v1/total?history=true"
        ),
        api.get("https://covid19-japan-web-api.now.sh/api/v1/prefectures"),
      ])
      .then(
        axios.spread((history, pref) => {
          setPrefectures({
            ...PREFECTURES_GEOJSON,
            features: PREFECTURES_GEOJSON.features.map((feature, i) => {
              const matchedPref = pref.data.find(
                (d) => d.name_en.trim() === feature.properties.ADM1_EN.trim()
              );
              return {
                ...feature,
                id: i,
                properties: {
                  ...feature.properties,
                  ...matchedPref,
                  death: matchedPref.deaths,
                },
              };
            }),
          });

          const historical_data = sortBy(history.data, "date").map(
            (point, i) => {
              return {
                ...point,
                new_cases:
                  i !== 0 ? point.positive - history.data[i - 1].positive : 0,
                new_testing: i !== 0 ? point.pcr - history.data[i - 1].pcr : 0,
                format_date: toDate(point.date),
              };
            }
          );
          setHistoricalData(historical_data);
          setLatestTotal(
            historical_data.find(
              (d) => d.date === d3.max(historical_data, (d) => d.date)
            )
          );
        })
      );
  };
  useEffect(() => {
    callAPI();
    const interval = setInterval(() => {
      callAPI();
    }, 7200000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const [prefectures, setPrefectures] = useState();
  const [historicalData, setHistoricalData] = useState();
  const [latestTotal, setLatestTotal] = useState();
  return {
    prefectures,
    latestTotal,
    historicalData,
  };
};

const CovidData = createContainer(useCovidData);

export default CovidData;
