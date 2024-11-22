import React, { useState } from "react";
import { useAuth } from "../context/UseAuth";
import { useQuery } from "@tanstack/react-query";
import { getUserCarts } from "../lib/actions";
import { EmptyCart } from "../assets/icons/icons";
import { buttonVariants } from "../components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";

const Cart: React.FC = () => {
  const { token } = useAuth();

  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  const {
    data: carts,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ["user-carts"],
    queryFn: async () => {
      return await getUserCarts(token);
    },
    enabled: !!token,
  });

  return (
    <section className="flex flex-col gap-y-16 py-12 px-4 md:px-12 lg:px-24 xl:px-36">
      <h1 className="text-4xl font-semibold text-gray-950 lilita_one_font">
        My Carts
      </h1>
      <div className="w-full flex flex-col gap-y-8">
        {isPending || isFetching ? (
          <div className="w-full flex items-center justify-center py-16">
            <Loader2 size={68} className="text-primary/85 animate-spin" />
          </div>
        ) : carts?.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center gap-y-6">
            <img
              src={EmptyCart}
              alt="empty-cart"
              width={98}
              height={98}
              className="object-contain"
            />
            <div className="flex flex-col items-center justify-center gap-y-2.5">
              <p className="text-xl font-semibold text-gray-950">
                No items in your Cart yet.
              </p>
              <Link
                to="/market"
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className: "border-gray-950/20 font-semibold",
                })}
              >
                Order now
              </Link>
            </div>
          </div>
        ) : (
          carts?.map((cart: ICart) => (
            <Link
              to={`/cart/${cart._id}`}
              key={cart._id}
              className="w-full flex justify-between items-center border border-gray-200/60 bg-gray-50/25 p-4 rounded-sm hover:shadow-md hover:opacity-90 transition-all"
            >
              <div className="flex gap-x-4">
                <div className="w-52 h-36 flex-shrink-0">
                  {!isImageLoaded && (
                    <Skeleton className="w-full h-full rounded-lg" />
                  )}

                  <img
                    src={cart?.restaurantId?.imageUrl}
                    alt="cart-item"
                    loading="lazy"
                    onLoad={() => setIsImageLoaded(true)}
                    className={`object-cover w-full h-full object-center rounded-sm ${
                      isImageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
                <div className="flex flex-col justify-between h-36 py-1.5">
                  <div className="flex flex-col gap-y-2.5">
                    <h2 className="text-2xl font-semibold text-gray-950">
                      {cart?.restaurantId?.name}
                    </h2>
                    <p className="text-sm font-medium text-neutral-600 line-clamp-3 max-w-[70%] break-words">
                      {cart?.restaurantId?.description}
                    </p>
                  </div>
                  {cart?.restaurantId?.isOnSale && (
                    <p className="text-primary/85 font-semibold text-sm flex gap-x-2 items-center">
                      <ArrowRight size={17} className="mt-px" />
                      {cart?.restaurantId?.salePercentage}% OFF
                    </p>
                  )}
                </div>
              </div>
              <div className="size-12 flex items-center justify-center bg-primary rounded-full flex-shrink-0">
                <p className="text-lg font-semibold text-white">
                  {cart?.cartItems?.length}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default Cart;
