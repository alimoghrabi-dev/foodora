import React from "react";
import Cuisines from "../_market/components/Cuisines";
import { useSearchParams } from "react-router-dom";
import NewOnFoodora from "../_market/components/NewOnFoodora";
import GetFilteredRestaurants from "../_market/components/GetFilteredRestaurants";
import AllRestaurants from "../_market/components/AllRestaurants";
import OnSaleRestaurants from "../_market/components/OnSaleRestaurants";

const Market: React.FC = () => {
  const [searchParams] = useSearchParams();

  return (
    <section className="w-full space-y-6">
      <Cuisines />
      <div className="w-full h-px bg-black/10" />
      {searchParams.get("cuisine") ? (
        <GetFilteredRestaurants cusine={searchParams.get("cuisine")} />
      ) : (
        <div className="w-full flex flex-col gap-y-8">
          <NewOnFoodora />
          <OnSaleRestaurants />
          <AllRestaurants />
        </div>
      )}
    </section>
  );
};

export default Market;
