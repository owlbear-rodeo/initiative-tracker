import React from "react";
import ReactDOM from "react-dom/client";
import ThemeProvider from "@mui/material/styles/ThemeProvider";

import { App } from "./App";
import "./index.css";
import { theme } from "./theme";
import { PluginGate } from "./PluginGate";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <PluginGate>
        <App />
      </PluginGate>
    </ThemeProvider>
  </React.StrictMode>
);
