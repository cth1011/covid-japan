import React, { useRef } from "react";
import { formatThousands, formatUnit } from "../utils";
import styled from "styled-components";
import { Text, Box } from "grommet";
import { orderBy } from "lodash";
import InlineBar from "./InlineBar";
const TooltipContent = styled(({ className, data, rankings }) => {
  const { name_en, name_ja, cases, pcr } = data;
  const d3Tooltip = useRef();
  const formatPrefectures = orderBy(
    rankings.map((d) => d.properties),
    "cases",
    ["desc"]
  );
  let rank = "";
  if (rankings) {
    const ranking =
      formatPrefectures.map((pref) => pref.name_en).indexOf(name_en) + 1;

    switch (ranking) {
      case 1:
        rank = `${ranking}st`;
        break;
      case 2:
        rank = `${ranking}nd`;
        break;
      case 3:
        rank = `${ranking}rd`;
        break;
      default:
        rank = `${ranking}th`;
    }
  }

  return (
    <div className={className}>
      <Box>
        <Text weight="bold" size="18px">
          {name_en} ({name_ja})
        </Text>
        <Text size="10px">{rank} out of 47 highest cases </Text>
      </Box>
      <Box pad="small" flex direction="row" justify="around">
        <Box>
          <Text size="24px" weight="bold">
            {formatThousands(cases)}
          </Text>
          <Text size="12px">Cases</Text>
        </Box>
        <Box className="border" />
        <Box>
          <Text size="24px" weight="bold">
            {formatUnit(pcr)}
          </Text>
          <Text size="12px">Tested</Text>
        </Box>
      </Box>
      <Text size="9px" className="details">
        Click for more details.
      </Text>
      <InlineBar
        className={"tooltip-graph"}
        data={data}
        ref={d3Tooltip}
        height={8}
        tooltip
      />
    </div>
  );
})`
  opacity: ${({ visible }) => visible};
  .border {
    border-right: 1px solid rgba(0, 0, 0, 0.3);
  }
  .details {
    color: rgba(0, 0, 0, 0.5);
    font-style: italic;
  }
  .tooltip-graph {
  }
`;

export default TooltipContent;
