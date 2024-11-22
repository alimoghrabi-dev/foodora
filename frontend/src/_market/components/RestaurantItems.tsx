import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { Fragment, useEffect } from "react";
import { getRestaurantCategories } from "../../lib/actions";
import RestaurantCategoryWithItems from "./RestaurantCategoryWithItems";
import { Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";

const RestaurantItems: React.FC<{
  id: string | undefined;
  token: string | null;
  isOnSale?: boolean;
  salePercentage?: number | undefined;
  isClosed: boolean | undefined;
  isTimeout: boolean | undefined;
}> = ({ id, token, isOnSale, salePercentage, isClosed, isTimeout }) => {
  const queryClient = useQueryClient();
  const location = useLocation();

  useEffect(() => {
    if (id) {
      queryClient.invalidateQueries({
        queryKey: ["restaurant-categories", id],
      });
    }
  }, [id, queryClient, location.pathname]);

  const { data: categories, isPending } = useQuery({
    queryKey: ["restaurant-categories", id],
    queryFn: async () => {
      return await getRestaurantCategories(id, token);
    },
    enabled: !!id,
  });

  return isPending ? (
    <div className="w-full flex items-center justify-center py-8">
      <Loader2 size={64} className="text-primary opacity-85 animate-spin" />
    </div>
  ) : (
    <div className="w-full flex flex-col gap-y-6">
      {categories?.map((category: ICategory, index: number) => (
        <Fragment key={index}>
          <RestaurantCategoryWithItems
            id={id}
            categoryName={category.name}
            categoryId={category._id}
            token={token}
            isOnSale={isOnSale}
            salePercentage={salePercentage}
            isClosed={isClosed}
            isTimeout={isTimeout}
          />

          {index !== categories?.length - 1 && <hr />}
        </Fragment>
      ))}
    </div>
  );
};

export default RestaurantItems;
