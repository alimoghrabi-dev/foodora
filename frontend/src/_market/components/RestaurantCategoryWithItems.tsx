import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getRestaurantItems } from "../../lib/actions";
import ItemCard from "./ItemCard";
import { Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";

const RestaurantCategoryWithItems: React.FC<{
  id: string | undefined;
  categoryName: string | undefined;
  categoryId: string | undefined;
  token: string | null;
  isOnSale?: boolean;
  salePercentage?: number | undefined;
  isClosed: boolean | undefined;
  isTimeout: boolean | undefined;
}> = ({
  id,
  categoryName,
  categoryId,
  token,
  isOnSale,
  salePercentage,
  isClosed,
  isTimeout,
}) => {
  const queryClient = useQueryClient();
  const location = useLocation();

  useEffect(() => {
    if (id && categoryId) {
      queryClient.invalidateQueries({
        queryKey: ["restaurant-items", categoryId],
      });
    }
  }, [id, categoryId, queryClient, location.pathname]);

  const { data: items, isPending } = useQuery({
    queryKey: ["restaurant-items", categoryId],
    queryFn: async () => {
      return await getRestaurantItems(id, categoryId, token);
    },
  });

  return isPending ? (
    <div className="w-full flex items-center justify-center py-8">
      <Loader2 size={64} className="text-primary opacity-85 animate-spin" />
    </div>
  ) : (
    <div className="flex flex-col gap-y-4">
      <h2 className="font-semibold text-gray-950 text-2xl">{categoryName}</h2>
      <div className="flex flex-col gap-y-2.5">
        {items?.length === 0 && (
          <p className="text-gray-950 font-medium text-base">
            No items found for this category.
          </p>
        )}
        {items?.map((item: IItem) => (
          <ItemCard
            key={item._id}
            itemId={item._id}
            itemName={item.name}
            itemImage={item.imageUrl}
            itemDescription={item.description}
            itemPrice={item.price}
            token={token}
            isOnSale={isOnSale}
            salePercentage={salePercentage}
            isOutOfStock={item.isOutOfStock}
            isClosed={isClosed}
            isTimeout={isTimeout}
          />
        ))}
      </div>
    </div>
  );
};

export default RestaurantCategoryWithItems;
