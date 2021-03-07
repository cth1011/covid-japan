import React from "react";
import styled from "styled-components";
import MapState from "../state/MapState";
import { Text, Box } from "grommet";
import * as colors from "../colors";

const Slider = styled(({ className, indexN }) => {
  const { filterValue, setFilterValue } = MapState.useContainer();

  return (
    <div className={className}>
      <Text size="15px" weight="bold">
        Insights on Japan
      </Text>
      <div className="content">
        I want to see{" "}
        {filterValue ? (
          <>
            prefectures with at least{" "}
            <Text className="legend" weight="bold" size="13px">
              {filterValue} cases{" "}
            </Text>
          </>
        ) : (
          "all of the prefectures"
        )}
      </div>
      <input
        className="slider"
        type="range"
        min="0"
        max="1000"
        value={filterValue}
        onChange={({ target }) => setFilterValue(parseInt(target.value))}
      />
      <Box flex direction="row" justify="between">
        <Text size="12px">0</Text>
        <Text size="12px">1,000+</Text>
      </Box>
    </div>
  );
})`
  font-size: 14px;
  .content {
    margin-top: 5px;
  }
  .legend {
    padding: 1px 5px;
    border-radius: 5px;
    transition: 0.5s;
    background-color: ${({ indexN }) => colors.cases[indexN]};
  }
  input[type="range"] {
    width: 100%;
    height: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: 0.5s;
  }
  input[type="range"],
  input[type="range"]::-webkit-slider-runnable-track,
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
  }
  input[type="range"]:focus {
    outline: 0;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    width: 200px;
    height: 10px;
    border: 1px solid #000;
    border-radius: 5px;

    background-image: linear-gradient(
      to right,
      ${colors.cases[0]} 0%,
      ${colors.cases[0]} 25%,
      ${colors.cases[1]} 25%,
      ${colors.cases[1]} 50%,
      ${colors.cases[2]} 50%,
      ${colors.cases[2]} 75%,
      ${colors.red} 75%,
      ${colors.red} 100%
    );
  }
  input[type="range"]::-webkit-slider-thumb {
    position: relative;
    height: 20px;
    width: 15px;
    margin-top: -6px;
    background: ${({ indexN }) => colors.cases[indexN]};
    border-radius: 5px;
    border: 1px solid black;
  }
  input[type="range"]::-webkit-slider-thumb::before {
    position: absolute;
    content: "";
    height: 10px; /* equal to height of runnable track */
    width: 500px; /* make this bigger than the widest range input element */
    left: -502px; /* this should be -2px - width */
    top: 8px; /* don't change this */
    background: rgba(0, 0, 0, 1);
  }

  .slider {
    width: 100%;
    margin-top: 10px;
    transition: 0.5s;
  }
`;

export default Slider;
