import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ConditionManager from "./components/CategoryManager/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConditionManager />
  </React.StrictMode>
);
