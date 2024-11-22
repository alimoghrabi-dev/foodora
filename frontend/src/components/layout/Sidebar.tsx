import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllCategories } from "../../lib/actions";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "../../lib/utils";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const { data: categories, isPending } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return await getAllCategories();
    },
  });

  return (
    <div className="fixed left-0 h-screen w-52 bg-white sidebar-shadow z-40 flex flex-col items-center gap-y-4 pt-6 pb-4">
      <div className="w-full flex flex-col items-center justify-center gap-y-2.5">
        <Link to="/market">
          <h2 className="text-2xl font-bold text-gray-950 lilita_one_font">
            foodora market
          </h2>
        </Link>
        <div className="border border-primary text-xs font-medium w-fit px-2 py-1 rounded-md bg-white primary-text hover:text-white hover:bg-primary transition-all">
          Shop and fee information
        </div>
      </div>
      <hr className="w-[85%]" />
      <div className="w-full h-full flex flex-col gap-y-2 px-4 overflow-y-auto">
        {isPending
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-8 rounded-lg" />
            ))
          : categories?.map((category: ICategory) => {
              const isActive =
                location.pathname === `/market/category/${category._id}`;

              return (
                <Link
                  to={`/market/category/${category._id}`}
                  key={category._id}
                  className={cn(
                    "w-full flex items-center justify-start gap-x-2 px-2 rounded-lg py-1 transition-all",
                    isActive ? "bg-primary" : "hover:bg-neutral-200/40 group"
                  )}
                >
                  <ChevronRight
                    size={16}
                    className={cn(
                      " mt-0.5",
                      isActive
                        ? "text-white"
                        : "text-neutral-800 group-hover:opacity-90"
                    )}
                  />
                  <p
                    className={cn(
                      " font-medium text-sm capitalize",
                      isActive
                        ? "text-white"
                        : "text-gray-950 group-hover:opacity-90"
                    )}
                  >
                    {category.name}
                  </p>
                </Link>
              );
            })}
      </div>
    </div>
  );
};

export default Sidebar;
