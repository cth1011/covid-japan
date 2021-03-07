import * as d3 from "d3";
import { TOTAL_METRICS } from "./constants";

export const formatThousands = d3.format(",");

export const transformStack = (d) =>
  d3.stack().keys(Object.keys(TOTAL_METRICS))(d);

export const toDate = (d) => {
  const e = d.toString();
  return new Date(`${e.slice(0, 4)}/${e.slice(4, 6)}/${e.slice(-2)}`);
};

export const formatUnit = d3.format(".2s");
