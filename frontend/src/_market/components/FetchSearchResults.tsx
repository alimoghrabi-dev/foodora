import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getSearchResults } from "../../lib/actions";
import { Loader2 } from "lucide-react";
import { cn, formatPrice } from "../../lib/utils";
import { Skeleton } from "../../components/ui/skeleton";

const FetchSearchResults: React.FC<{
  search: string | null;
}> = ({ search }) => {
  const [isRestaurantImageLoaded, setIsRestaurantImageLoaded] =
    useState<boolean>(false);
  const [isItemImageLoaded, setIsItemImageLoaded] = useState<boolean>(false);

  const { data: results, isPending } = useQuery({
    queryKey: ["search-results", search],
    queryFn: async () => {
      return await getSearchResults(search);
    },
    enabled: !!search,
  });

  return (
    <div className="inset-x-0 absolute max-h-[450px] top-[120%] rounded-md shadow shadow-black/15 bg-white/[0.965] backdrop-blur-xl z-20 overflow-y-auto p-4 space-y-4">
      {isPending ? (
        <div className="w-full flex items-center justify-center py-12">
          <Loader2 size={52} className="animate-spin text-primary/75" />
        </div>
      ) : results?.restaurants && results?.restaurants.length > 0 ? (
        <div className="flex flex-col gap-y-4">
          <h3 className="text-primary font-medium text-base">Restaurants</h3>
          <div className="flex flex-col gap-y-2.5">
            {results?.restaurants.map((restaurant: IRestaurant) => (
              <Link
                to={`/market/restaurant/${restaurant._id}`}
                key={restaurant._id}
                className="w-full  relative flex gap-x-2.5 items-start hover:shadow hover:bg-gray-50 transition p-1.5 rounded-sm"
              >
                {restaurant?.isClosed ? (
                  <div className="absolute inset-0 bg-gray-950/15 backdrop-grayscale rounded-lg flex items-center justify-center">
                    <p className="font-semibold text-base text-primary bg-black/50 backdrop-blur-sm">
                      Currently Closed
                    </p>
                  </div>
                ) : restaurant?.isTimeout ? (
                  <div className="absolute inset-0 bg-gray-950/15 backdrop-grayscale rounded-lg flex items-center justify-center">
                    <p className="font-semibold text-base text-primary bg-white/75 backdrop-blur-lg px-2 py-1 rounded-sm">
                      Currently Closed
                    </p>
                  </div>
                ) : null}

                <div className="w-28 h-16 flex-shrink-0">
                  {!isRestaurantImageLoaded && (
                    <Skeleton className="w-full h-full rounded-sm" />
                  )}

                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name.charAt(0)}
                    loading="lazy"
                    onLoad={() => setIsRestaurantImageLoaded(true)}
                    className={`w-full h-full object-cover object-center rounded-sm ${
                      isRestaurantImageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
                <div className="flex flex-col gap-y-1">
                  <div className="flex items-center gap-x-2.5">
                    <h4 className="text-gray-950 font-semibold text-sm">
                      {restaurant.name}
                    </h4>

                    {restaurant.isOnSale && (
                      <div className="rounded-sm text-white font-medium text-[10px] h-fit bg-primary px-2 py-[1px]">
                        {restaurant?.salePercentage}% Off
                      </div>
                    )}
                  </div>

                  <p className="text-gray-700 font-medium text-xs max-w-[50%] line-clamp-2">
                    {restaurant.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      {results?.items && results?.items.length > 0 && <hr />}
      {results?.items && results?.items.length > 0 ? (
        <div className="flex flex-col gap-y-4">
          <h3 className="text-primary font-medium text-base">Items</h3>
          <div className="flex flex-col gap-y-2.5">
            {results?.items.map((item: IItem) => (
              <Link
                to={`/market/restaurant/${item?.restaurantId._id}?item=${item._id}`}
                key={item._id}
                className={cn(
                  "w-full flex gap-x-2.5 items-start hover:shadow hover:bg-gray-50 transition p-1.5 rounded-sm",
                  item.isOutOfStock ? "opacity-60" : ""
                )}
              >
                <div className="w-28 h-16 flex-shrink-0">
                  {!isItemImageLoaded && (
                    <Skeleton className="w-full h-full rounded-sm" />
                  )}

                  <img
                    src={item.imageUrl}
                    alt={item.name.charAt(0)}
                    loading="lazy"
                    onLoad={() => setIsItemImageLoaded(true)}
                    className={`w-full h-full object-cover object-center rounded-sm ${
                      isItemImageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
                <div className="flex-1 flex gap-y-1 flex-col justify-between">
                  <div className="flex-1 flex flex-col gap-y-1">
                    <h4 className="text-gray-950 font-semibold text-sm">
                      {item.name}
                    </h4>
                    <p className="text-gray-700 font-medium text-xs max-w-[50%] line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                  {item.isOutOfStock ? (
                    <p className="text-primary font-semibold text-sm">
                      Out of Stock
                    </p>
                  ) : (
                    <div className="flex gap-x-2">
                      <p
                        className={cn(
                          "text-xs font-medium",
                          item.restaurantId.isOnSale
                            ? "text-gray-700 line-through"
                            : "text-primary font-semibold"
                        )}
                      >
                        {formatPrice(item.price)}
                      </p>
                      {item.restaurantId.isOnSale && (
                        <p className="text-primary font-semibold text-xs">
                          {formatPrice(
                            item.price -
                              (item.price * item.restaurantId.salePercentage) /
                                100
                          )}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      {results?.items?.length === 0 && results?.restaurants.length === 0 && (
        <div className="w-full flex items-center justify-center py-12">
          <h3 className="text-gray-950 font-semibold text-lg">
            No results matched your search
          </h3>
        </div>
      )}
    </div>
  );
};

export default FetchSearchResults;
