import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import MarketSearchBar from "./components/MarketSearchBar";

const MarketLayout: React.FC = () => {
  return (
    <>
      <Sidebar />
      <main className="max-w-[calc(100vw-208px)] ml-auto px-12 py-6 space-y-4">
        <MarketSearchBar />
        <Outlet />
      </main>
    </>
  );
};

export default MarketLayout;
