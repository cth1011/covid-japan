import React, { useRef } from "react";
import styled from "styled-components";

import { formatThousands } from "../utils";
import { TOTAL_METRICS } from "../constants";
import { METRIC_COLORS, red, blue } from "../colors";
import InlineBar from "./InlineBar";
import ScoreCard from "./ScoreCard";
import AreaChart from "./AreaChart";
import Divider from "./Divider";
import Slider from "./Slider";
import { Text, Box } from "grommet";
import CovidData from "../state/CovidData";
import MapState from "../state/MapState";
import { get } from "lodash";
import { quantile } from "d3";
import moment from "moment";
import { CircleInformation } from "grommet-icons";

const CaseBreakdown = styled(({ className }) => {
  const { latestTotal } = CovidData.useContainer();
  const d3Container = useRef();
  return (
    <div className={className}>
      <Text size="15px" weight="bold">
        Cases Breakdown
      </Text>
      <InlineBar
        data={latestTotal}
        ref={d3Container}
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
              {formatThousands(get(latestTotal, metric, 0))}
            </Text>
          </Box>
        ))}
      </Box>
    </div>
  );
})``;

const Sidebar = styled(({ className }) => {
  const { latestTotal } = CovidData.useContainer();
  const { activeState, filterValue } = MapState.useContainer();
  const indexN = Math.floor(quantile([0, 4], filterValue / 1001));
  const updateDate = get(latestTotal, "format_date", 0);
  return (
    <div className={className}>
      <Box className="title">
        <h1>Japan (日本)</h1>
        <Text size="13px">COVID-19 TRACKER</Text>
        <Text size="11px" className="update">
          Last Updated:{" "}
          {updateDate ? moment(updateDate).format("MMM D YYYY") : ""}
        </Text>
      </Box>
      <Divider />
      <div className="information">
        <ScoreCard
          title="Total Positive Cases"
          value={get(latestTotal, "positive", 0)}
          added={get(latestTotal, "new_cases", 0)}
          color={red}
        />

        <AreaChart color={red} title="Daily New Cases" value="new_cases" />
      </div>
      <Divider />
      <ScoreCard
        title="Total Tested"
        value={get(latestTotal, "pcr", 0)}
        added={get(latestTotal, "new_testing", "0")}
        color={blue}
      />
      <AreaChart color={blue} title="Daily Testing" value="new_testing" />
      <Divider />
      <CaseBreakdown />

      {activeState === "default" && (
        <>
          <Divider /> <Slider indexN={indexN} />
        </>
      )}
      <div>
        {" "}
        <Box flex className="placeholder" />
        <Box className="info" flex direction="row" gap="5px" width="180px">
          <CircleInformation size="13px" />
          <Text size="10px">
            Data was collected by volunteers and may not always align. Please
            refer to{" "}
            <a href="https://github.com/ryo-ma/covid19-japan-web-api#data-sources">
              this
            </a>{" "}
            for more information.
          </Text>
        </Box>
      </div>
    </div>
  );
})`
  height: 100%;
  width: 226px;
  background-color: white;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 100;
  padding: 0 20px;
  position: relative;
  box-shadow: 5px 3px 5px rgba(0, 0, 0, 0.05);
  .title {
  }
  .graph {
    padding: 10px 0;
  }
  h1 {
    margin-bottom: 0;
  }
  .info {
    margin-top: 20px;
    margin-bottom: 10px;
    @media screen and (min-height: 760px) {
      position: absolute;
      bottom: 10px;
    }
  }
  .update {
    font-style: italic;
  }
`;
export default Sidebar;
