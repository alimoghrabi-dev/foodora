import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { getNewRestaurants } from "../../lib/actions";
import RestaurantCard from "./RestaurantCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Skeleton } from "../../components/ui/skeleton";

const NewOnFoodora: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);

  const { data: restaurants, isPending } = useQuery({
    queryKey: ["new-restaurants"],
    queryFn: async () => {
      return await getNewRestaurants();
    },
  });

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      updateScrollButtons();
      scrollRef.current.addEventListener("scroll", updateScrollButtons);
      return () => {
        if (scrollRef.current) {
          scrollRef.current.removeEventListener("scroll", updateScrollButtons);
        }
      };
    }
  }, [restaurants]);

  useEffect(() => {
    updateScrollButtons();
  }, [restaurants]);

  return (
    <div
      className={cn(
        "flex-col gap-y-4",
        isPending ? "hidden" : restaurants?.length > 0 ? "flex" : "hidden"
      )}
    >
      <h2 className="text-2xl primary-text font-semibold">New on Foodora</h2>
      <div className="relative w-full">
        <button
          className={cn(
            "absolute left-2 top-1/2 transform -translate-y-1/2 bg-primary z-40 rounded-full p-1.5 hover:opacity-95 transition",
            canScrollLeft ? "block" : "hidden"
          )}
          onClick={scrollLeft}
        >
          <ChevronLeft size={21} className="text-white" />
        </button>

        <div
          ref={scrollRef}
          className="w-full flex gap-x-4 overflow-x-auto scrollbar-hide"
        >
          {isPending ? (
            <>
              <Skeleton className="rounded-xl bg-neutral-200 h-[275px] w-[375px]" />
              <Skeleton className="rounded-xl bg-neutral-200 h-[275px] w-[375px]" />
              <Skeleton className="rounded-xl bg-neutral-200 h-[275px] w-[375px]" />
            </>
          ) : (
            restaurants?.map((item: IRestaurant) => (
              <RestaurantCard
                key={item._id}
                id={item._id}
                imageUrl={item.imageUrl}
                name={item.name}
                rating={item.rating}
                deliveryTime={item.deliveryTime}
                cuisine={item.cuisine}
                isOnSale={item.isOnSale}
                salePercentage={item.salePercentage}
                isClosed={item.isClosed}
                isTimeout={item.isTimeout}
              />
            ))
          )}
        </div>

        <button
          className={cn(
            "absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary z-40 rounded-full p-1.5 hover:opacity-95 transition",
            canScrollRight ? "block" : "hidden"
          )}
          onClick={scrollRight}
        >
          <ChevronRight size={21} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default NewOnFoodora;
