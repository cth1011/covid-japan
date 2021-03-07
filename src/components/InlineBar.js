import React, { useEffect, forwardRef, useRef } from "react";
import * as d3 from "d3";

import styled from "styled-components";
import { METRIC_COLORS } from "../colors";
import { transformStack } from "../utils";
const InlineBar = styled(
  forwardRef(({ className, data, height = 5, tooltip }, ref) => {
    const container = useRef();
    useEffect(() => {
      if (data) {
        const isArr = Array.isArray(data) ? data : [data];
        const transformedData = transformStack(isArr);

        const node = d3.select(container.current).style("width");
        const width = node || "220px";
        const svgCanvas = d3
          .select(ref.current)
          .attr("width", width)
          .attr("height", height);
        const total =
          data.severe + data.hospitalize + data.discharge + data.death;
        svgCanvas.transition().duration(300);
        const x = d3.scaleLinear().domain([0, 1]).range([0, width]);

        svgCanvas
          .selectAll("rect")
          .data(transformedData)
          .join("rect")
          .attr("fill", (d) => METRIC_COLORS[d.key])
          .attr("y", 0)

          .attr("height", height)
          .transition()
          .duration(200)
          .attr("x", (d) => x(d[0][0] / total))
          .attr("width", (d) => x((d[0][1] - d[0][0]) / total));
      }
    }, [data]);

    return (
      <div ref={container}>
        <svg className={className} ref={ref} />
      </div>
    );
  })
)`
  width: 100%;
  display: flex;
  ${({ tooltip }) =>
    tooltip
      ? `  
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
  `
      : ``}
`;

export default InlineBar;
