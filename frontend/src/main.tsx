import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import { QueryProvider } from "./context/QueryProvider.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import "./index.css";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <App />
          </CartProvider>
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
