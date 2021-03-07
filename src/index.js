import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import CovidData from "./state/CovidData";
import MapState from "./state/MapState";
ReactDOM.render(
  <React.StrictMode>
    <CovidData.Provider>
      <MapState.Provider>
        <App />
      </MapState.Provider>
    </CovidData.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
