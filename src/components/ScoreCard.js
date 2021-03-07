import React from "react";
import styled from "styled-components";

import { formatThousands } from "../utils";
import { Text, Box } from "grommet";

const ScoreCard = styled(({ className, title, value, added = 0, color }) => (
  <div className={className}>
    <Text size="15px" weight="bold">
      {title}
    </Text>
    <Box className="container" flex direction="row">
      <Box>
        <Text weight="bold" size="32px" color={color}>
          {formatThousands(value)}
        </Text>{" "}
      </Box>
      <Box>
        <Text className="new-label" weight="bold" size="11px">
          +{formatThousands(added)}
        </Text>
      </Box>
    </Box>
  </div>
))`
  .container {
    align-items: center;
  }
  .new-label {
    margin-left: 5px;
    padding: 4px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
`;

export default ScoreCard;
