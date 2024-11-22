import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext.tsx";
import "./index.css";
import { QueryProvider } from "./context/QueryProvider.tsx";
import axios from "axios";
import { Toaster } from "./components/ui/toaster.tsx";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AdminProvider>
          <Toaster />
          <App />
        </AdminProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
