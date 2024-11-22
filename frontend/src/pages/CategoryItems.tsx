import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { getCategoryItems } from "../lib/actions";
import ItemCard from "../_market/components/ItemCard";
import { useAuth } from "../context/UseAuth";
import { Skeleton } from "../components/ui/skeleton";

const CategoryItems: React.FC = () => {
  const { token } = useAuth();
  const { id } = useParams();

  const { data: items, isPending } = useQuery({
    queryKey: ["category-items", id],
    queryFn: async () => {
      return await getCategoryItems(id);
    },
  });

  return (
    <section className="w-full flex flex-col gap-y-5">
      {isPending ? (
        Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="w-full rounded-lg h-24" />
        ))
      ) : items?.length === 0 ? (
        <div className="w-full flex items-center justify-center pt-12">
          <p className="font-semibold text-xl text-gray-950">
            No items in this category yet.
          </p>
        </div>
      ) : (
        items?.map((item: IItem) => (
          <ItemCard
            key={item._id}
            token={token}
            restaurantId={item.restaurantId._id}
            itemId={item._id}
            itemName={item.name}
            itemImage={item.imageUrl}
            itemPrice={item.price}
            itemDescription={item.description}
            isOutOfStock={item.isOutOfStock}
            isOnSale={item.isOnSale}
            salePercentage={item.salePercentage}
            isClosed={item.restaurantId.isClosed}
            isTimeout={item.restaurantId.isTimeout}
            isCategory
          />
        ))
      )}
    </section>
  );
};

export default CategoryItems;
