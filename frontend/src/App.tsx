import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import {
  Home,
  Apply,
  Profile,
  Subscription,
  RestaurantRegistration,
  Market,
  RestaurantPage,
  Cart,
  RestaurantCart,
  Orders,
  CategoryItems,
  NotFound,
  DriverApply,
} from "./pages/pages";
import RootLayout from "./components/layout/RootLayout";
import { useAuth } from "./context/UseAuth";
import MarketLayout from "./_market/MarketLayout";
import { Loader2 } from "lucide-react";
import AdminLayout from "./_admin/AdminLayout";
import AdminDashboard from "./_admin/pages/AdminDashboard";
import Applies from "./_admin/pages/Applies";
import OrderPage from "./pages/OrderPage";
import { useQueryClient } from "@tanstack/react-query";

const App: React.FC = () => {
  const { user, token, isPending } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get("google_token");

    if (tokenFromUrl) {
      localStorage.setItem("tokenInfo", JSON.stringify(tokenFromUrl));
      window.history.replaceState({}, document.title, "/");

      window.location.reload();
    }
  }, [location.search, queryClient]);

  if (isPending && location.pathname.includes("/market")) {
    return (
      <div className="absolute w-full h-screen bg-white z-[150] flex items-center justify-center">
        <Loader2 size={87} className="primary-text opacity-85 animate-spin" />
      </div>
    );
  }

  if (isPending && location.pathname.includes("/admin")) {
    return (
      <div className="absolute w-full h-screen bg-white z-[150] flex items-center justify-center">
        <Loader2 size={87} className="primary-text opacity-85 animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/apply/driver" element={<DriverApply />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cart/:id" element={<RestaurantCart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderPage />} />
        <Route path="/*" element={<NotFound />} />

        <Route element={<MarketLayout />}>
          <Route path="/market" element={<Market />} />
          <Route path="/market/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/market/category/:id" element={<CategoryItems />} />
        </Route>
      </Route>

      {token && user?.isAdmin && (
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/dashboard/applies" element={<Applies />} />
        </Route>
      )}

      <Route path="/register-restaurant" element={<RestaurantRegistration />} />
    </Routes>
  );
};

export default App;
