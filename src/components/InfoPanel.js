import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { Box, Text } from "grommet";

import MapState from "../state/MapState";
import Divider from "./Divider";
import InlineBar from "./InlineBar";

import { METRIC_COLORS, grey } from "../colors";
import { formatThousands } from "../utils";
import { TOTAL_METRICS } from "../constants";

const CaseBreakdown = styled(({ className, data }) => {
  const infoContainer = useRef();
  return (
    <div className={className}>
      <Text size="12px" color={grey} weight="bold">
        Cases Breakdown
      </Text>
      <InlineBar
        data={data}
        ref={infoContainer}
        className="graph"
        height={15}
      />
      <Box flex direction="row" justify="between" alignContent="center">
        {Object.keys(TOTAL_METRICS).map((metric) => (
          <Box key={metric}>
            <Text
              size="12px"
              color={METRIC_COLORS[metric]}
              weight="bold"
              className="metric"
            >
              {TOTAL_METRICS[metric]}
            </Text>
            <Text size="12px" className="metric">
              {formatThousands(data[metric])}
            </Text>
          </Box>
        ))}
      </Box>
    </div>
  );
})`
  padding-bottom: 15px;
`;

const InfoPanel = styled(({ className }) => {
  const { geocoder, map, activeState, activePref } = MapState.useContainer();
  useEffect(() => {
    map && document.getElementById("geocoder").appendChild(geocoder.onAdd(map));
  }, [map]);
  return (
    <div className={className}>
      <div id="geocoder" />
      {activeState === "satellite" && activePref && (
        <>
          <Divider pad="2px 0 15px 0" />

          <Text size="28px" weight="bold" className="region">
            {activePref.name_en} ({activePref.name_ja})
          </Text>
          <CaseBreakdown data={activePref} />
          <Box flex direction="row" pad={{ bottom: "10px" }}>
            <Box direction="column" width="50%">
              <Text size="13px">Cases</Text>
              <Text size="28px" weight="bold">
                {formatThousands(activePref.cases)}
              </Text>
            </Box>
            <Box direction="column" width="50%">
              <Text size="13px">Tested</Text>
              <Text size="28px" weight="bold">
                {formatThousands(activePref.pcr)}
              </Text>
            </Box>
          </Box>
          <Box flex direction="column">
            <Text size="13px">Population</Text>
            <Text size="28px" weight="bold">
              {formatThousands(activePref.population)}
            </Text>
          </Box>
        </>
      )}
    </div>
  );
})`
  position: absolute;
  padding: 10px 20px;
  width: 240px;
  min-height: 38x;
  z-index: 100;
  background-color: white;
  transform: translate(255px, 10px);
  border-radius: 10px;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
  #geocoder {
    min-height: 36px;
  }
  .mapboxgl-ctrl-geocoder {
    box-shadow: none;
  }
  input:focus {
    outline: 0;
  }
  .graph {
    padding: 10px 0;
  }
  .region {
    line-height: 0px;
  }
`;
export default InfoPanel;
