import React from "react";
import styled from "styled-components";

const Divider = styled(({ className, info }) => (
  <div className={className}>
    <hr className="line" />{" "}
  </div>
))`
  opacity: 0.5;
  padding: ${({ pad }) => pad || "3px 0 11px 0"};
`;

export default Divider;
