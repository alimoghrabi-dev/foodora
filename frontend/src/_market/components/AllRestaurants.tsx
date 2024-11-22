import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllRestaurants } from "../../lib/actions";
import RestaurantCard from "./RestaurantCard";
import { Skeleton } from "../../components/ui/skeleton";

const AllRestaurants: React.FC = () => {
  const { data: allRestaurants, isPending } = useQuery({
    queryKey: ["all-restaurants"],
    queryFn: () => {
      return getAllRestaurants();
    },
  });

  return (
    <div className="w-full flex flex-col gap-y-4">
      <h2 className="text-2xl primary-text font-semibold">All Restaurants</h2>
      <div className="w-full grid grid-cols-4 gap-4">
        {isPending
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-y-4">
                <Skeleton className="w-full h-56 rounded-xl bg-neutral-200" />
                <div className="flex flex-col gap-y-2">
                  <Skeleton className="w-36 h-4 rounded-full bg-neutral-200" />
                  <Skeleton className="w-20 h-4 rounded-full bg-neutral-200" />
                </div>
              </div>
            ))
          : allRestaurants?.map((restaurant: IRestaurant) => (
              <RestaurantCard
                key={restaurant._id}
                id={restaurant?._id}
                imageUrl={restaurant?.imageUrl}
                name={restaurant?.name}
                deliveryTime={restaurant?.deliveryTime}
                rating={restaurant?.rating}
                cuisine={restaurant?.cuisine}
                isOnSale={restaurant?.isOnSale}
                salePercentage={restaurant?.salePercentage}
                isClosed={restaurant?.isClosed}
                isTimeout={restaurant?.isTimeout}
              />
            ))}
      </div>
    </div>
  );
};

export default AllRestaurants;
