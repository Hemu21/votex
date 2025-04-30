import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { EthProvider } from "./context";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EthProvider>
      <App />
    </EthProvider>
  </React.StrictMode>
);
