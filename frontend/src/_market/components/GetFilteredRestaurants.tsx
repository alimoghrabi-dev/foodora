import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getRestaurantByCuisine } from "../../lib/actions";
import { Loader2 } from "lucide-react";
import RestaurantCard from "./RestaurantCard";

const GetFilteredRestaurants: React.FC<{
  cusine: string | null;
}> = ({ cusine }) => {
  const { data: restaurants, isPending } = useQuery({
    queryKey: ["filtered-restaurants", cusine],
    queryFn: async () => {
      return await getRestaurantByCuisine(cusine);
    },
    enabled: !!cusine,
  });

  return isPending ? (
    <div className="w-full flex items-center justify-center py-12">
      <Loader2 size={70} className="text-primary opacity-85 animate-spin" />
    </div>
  ) : (
    <div className="w-full grid grid-cols-3 gap-8">
      {restaurants?.map((restaurant: IRestaurant) => (
        <RestaurantCard
          key={restaurant?._id}
          id={restaurant?._id}
          imageUrl={restaurant?.imageUrl}
          name={restaurant?.name}
          rating={restaurant?.rating}
          deliveryTime={restaurant?.deliveryTime}
          description={restaurant?.description}
          isOnSale={restaurant?.isOnSale}
          salePercentage={restaurant?.salePercentage}
          isClosed={restaurant?.isClosed}
          isTimeout={restaurant?.isTimeout}
        />
      ))}
    </div>
  );
};

export default GetFilteredRestaurants;
