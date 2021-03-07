import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import CovidData from "../state/CovidData";

const AreaChart = ({ color, title, value }) => {
  const container = useRef();
  const d3Container = useRef();
  const { historicalData } = CovidData.useContainer();

  useEffect(() => {
    if (historicalData) {
      const node = d3.select(container.current).style("width");
      const height = 70,
        width = node;
      const svgCanvas = d3
        .select(d3Container.current)
        .attr("width", width)
        .attr("height", height);

      const x = d3
        .scaleTime()
        .domain(d3.extent(historicalData, (d) => d.format_date))
        .range([0, parseFloat(node.split("px")[0])]);

      const y = d3
        .scaleLinear()
        .domain([0, d3.max(historicalData, (d) => d[value])])
        .range([height, 0]);
      const area = d3
        .area()
        .curve(d3.curveBasis)
        .x((d) => x(d.format_date))
        .y0(y(0))
        .y1((d) => y(d[value]));
      svgCanvas
        .select("text")
        .attr("transform", "translate(0,20)")
        .attr("font-size", "10px")
        .attr("fill", color)
        .attr("font-weight", "bold");
      svgCanvas
        .selectAll(".line")
        .data([historicalData])
        .join("path")
        .attr("class", "line")
        .attr("fill", color)
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("d", area);
    }
  }, [historicalData]);
  return (
    <div ref={container}>
      <svg ref={d3Container}>
        <text>{title}</text>
      </svg>
    </div>
  );
};

export default AreaChart;
