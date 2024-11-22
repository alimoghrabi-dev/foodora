import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getRestaurantCuisines } from "../../lib/actions";
import { Skeleton } from "../../components/ui/skeleton";

const Cuisines: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: cuisines, isPending } = useQuery({
    queryKey: ["cuisines"],
    queryFn: async () => {
      return await getRestaurantCuisines();
    },
  });

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  const handleCuisineClick = (cuisine: string) => {
    if (searchParams.get("cuisine") === cuisine) {
      searchParams.delete("cuisine");
    } else {
      searchParams.set("cuisine", cuisine);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="relative w-full px-8">
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2"
        onClick={scrollLeft}
      >
        <ChevronLeft size={18} />
      </button>
      <div
        className="flex gap-x-4 overflow-x-scroll scrollbar-hide w-full"
        ref={scrollRef}
      >
        {isPending ? (
          <Skeleton className="w-full bg-neutral-200/50 h-8 rounded-full" />
        ) : (
          cuisines?.map((cuisine: string, index: number) => (
            <div
              key={index}
              onClick={() => handleCuisineClick(cuisine)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium cursor-pointer hover:opacity-75 transition-all",
                searchParams.get("cuisine") === cuisine
                  ? "bg-primary text-white"
                  : "bg-neutral-200/50 text-gray-950"
              )}
            >
              {cuisine}
            </div>
          ))
        )}
      </div>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2"
        onClick={scrollRight}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Cuisines;
