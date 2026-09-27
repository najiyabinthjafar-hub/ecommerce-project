import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />

    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2000,
      }}
    />
  </StrictMode>
);