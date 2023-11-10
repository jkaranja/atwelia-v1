import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "react-toastify/dist/ReactToastify.css";

import React from "react";

import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import "./styles/mui.css";

import "react-phone-input-2/lib/style.css";

import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { Provider } from "react-redux";
import store from "./app/store";

if (process.env.NODE_ENV === "production") disableReactDevTools();

//debugger; // TO INSPECT THE PAGE BEFORE 1ST RENDER// PAUSES RENDERING

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
