import React from "react";
import Map from "./components/Map";
import Sidebar from "./components/Sidebar";
import InfoPanel from "./components/InfoPanel";
import styled from "styled-components";

const App = styled(({ className }) => {
  return (
    <div className={className}>
      <Sidebar />
      <InfoPanel />
      <Map />
    </div>
  );
})`
  font-family: Source Sans Pro, sans-serif;
  position: relative;
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  margin: 0;
  overflow: hidden;
  div::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: rgba(0, 0, 0, 0.3);
  }
  div::-webkit-scrollbar {
    width: 5px;
    background-color: rgba(0, 0, 0, 0.3);
  }
  div::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #f5f5f5;
  }
`;

export default App;
