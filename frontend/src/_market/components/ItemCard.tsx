/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from "react";
import { cn, formatPrice } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { useToast } from "../../components/ui/use-toast";
import { Loader2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/UseAuth";
import { addAndRemoveItemFromCart } from "../../lib/actions";
import { Skeleton } from "../../components/ui/skeleton";
import { useCartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const ItemCard: React.FC<{
  restaurantId?: string;
  itemId: string;
  itemName: string;
  itemImage: string;
  itemDescription: string;
  itemPrice: number;
  token: string | null;
  isOnSale?: boolean;
  salePercentage?: number | undefined;
  isOutOfStock: boolean;
  isClosed: boolean | undefined;
  isTimeout: boolean | undefined;
  isCategory?: boolean;
}> = ({
  restaurantId,
  itemId,
  itemName,
  itemImage,
  itemDescription,
  itemPrice,
  token,
  isOnSale,
  salePercentage,
  isOutOfStock,
  isClosed,
  isTimeout,
  isCategory,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { triggerAnimation } = useCartContext();

  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [isImageLoadedDialog, setIsImageLoadedDialog] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isItemInCart = user?.cartId?.some((cart) =>
    //@ts-ignore
    cart.cartItems.some((item) => item.itemId === itemId)
  );

  const [localIsInCart, setLocalIsInCart] = useState(isItemInCart);

  const { mutate: handleAddAndRemoveFromCartMutation, isPending } = useMutation(
    {
      mutationFn: async () => {
        await addAndRemoveItemFromCart(itemId, token);
      },
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ["auth-status"] });

        const previousAuthStatus = queryClient.getQueryData(["auth-status"]);

        queryClient.setQueryData(["auth-status"], (old: IUser) => {
          if (!old || !old.cartId) return old;

          const isItemInCart = user?.cartId?.some((cart) =>
            //@ts-ignore
            cart.cartItems.some((item) => item.itemId === itemId)
          );

          return {
            ...old,
            cartId: {
              ...old.cartId,
              cartItems: isItemInCart
                ? old.cartId?.some((cart) =>
                    //@ts-ignore
                    cart.cartItems.some((item) => item.itemId === itemId)
                  )
                : [...old.cartId, itemId],
            },
          };
        });

        return { previousAuthStatus };
      },
      onError: (err, variables, context) => {
        if (context?.previousAuthStatus) {
          queryClient.setQueryData(["auth-status"], context.previousAuthStatus);
        }

        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      },

      onSettled: () => {
        queryClient
          .invalidateQueries({ queryKey: ["auth-status"] })
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ["user-carts"] });
          });
      },
    }
  );

  const handleAddAndRemoveFromCart = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      return toast({
        title: "Login required",
        description: "Please login to add items to your cart",
        variant: "destructive",
      });
    }

    setLocalIsInCart((prev) => !prev);

    if (!isItemInCart) {
      const rect = e.currentTarget.getBoundingClientRect();
      triggerAnimation(rect.left + rect.width / 2, rect.top);
    }

    handleAddAndRemoveFromCartMutation();
  };

  return (
    <Dialog>
      <DialogTrigger disabled={isOutOfStock} asChild>
        <div
          id={itemId}
          onClick={() => {
            if (isCategory) {
              navigate(`/market/restaurant/${restaurantId}?item=${itemId}`);
            }
          }}
          style={{
            opacity: isOutOfStock ? 0.75 : 1,
          }}
          className={cn(
            "w-full relative flex items-center justify-between gap-x-4 p-2.5 rounded-lg transition duration-200",
            isOutOfStock
              ? "cursor-default"
              : "hover:shadow hover:shadow-black/15 hover:bg-gray-50 cursor-pointer"
          )}
        >
          <div className="flex gap-x-2.5">
            <div className="w-36 h-[85px] relative">
              {isClosed ? (
                <div className="absolute inset-0 rounded-lg backdrop-grayscale bg-black/50 flex items-center justify-center">
                  <p className="text-red-500 font-semibold text-base rotate-45">
                    Closed
                  </p>
                </div>
              ) : isTimeout ? (
                <div className="absolute inset-0 rounded-lg backdrop-grayscale bg-black/50 flex items-center justify-center">
                  <p className="text-red-500 font-medium text-[17px] rotate-45">
                    closed
                  </p>
                </div>
              ) : null}

              {!isImageLoaded && (
                <Skeleton className="w-full h-full rounded-lg" />
              )}

              <img
                src={itemImage}
                alt={itemName}
                loading="lazy"
                onLoad={() => setIsImageLoaded(true)}
                className={`w-full h-full object-cover rounded-lg ${
                  isImageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
            <div className="flex flex-col items-start justify-between">
              <div className="flex items-start flex-col gap-y-0.5">
                <p className="text-gray-950 font-semibold text-base">
                  {itemName}
                </p>
                <p className="text-sm font-medium text-neutral-700 line-clamp-2 max-w-full break-words">
                  {itemDescription}
                </p>
              </div>
              {!isOutOfStock ? (
                <div className="flex items-center gap-x-2">
                  <p
                    className={cn(
                      "text-primary text-base font-bold",
                      isOnSale && "line-through text-gray-950"
                    )}
                  >
                    {formatPrice(itemPrice)}
                  </p>

                  {isOnSale && salePercentage && (
                    <p className="text-primary text-lg font-bold">
                      {formatPrice(
                        itemPrice - (itemPrice * salePercentage) / 100
                      )}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-primary font-medium text-base">
                  Out of Stock
                </p>
              )}
            </div>
          </div>
          {!isOutOfStock && (
            <Button
              type="button"
              onClick={handleAddAndRemoveFromCart}
              disabled={isPending || isClosed || isTimeout}
              className="w-[165px] font-semibold px-8 py-5"
              variant={localIsInCart ? "outline" : "default"}
            >
              {isPending ? (
                <Loader2 size={21} className="animate-spin" />
              ) : localIsInCart ? (
                "Remove from cart"
              ) : (
                "Add to cart"
              )}
            </Button>
          )}
        </div>
      </DialogTrigger>
      <DialogContent
        aria-describedby={itemName}
        className="max-w-3xl rounded-lg max-h-[455px] overflow-y-auto"
      >
        <DialogTitle className="hidden"></DialogTitle>
        <div className="w-full flex items-center justify-end">
          <DialogClose className="p-1.5 rounded-full hover:bg-gray-100 transition ease-in duration-150">
            <X size={24} className="text-gray-950" />
          </DialogClose>
        </div>
        <div className="w-full flex justify-start items-center gap-x-6">
          <div className="w-[350px] h-56">
            {!isImageLoadedDialog && (
              <Skeleton className="w-full h-full rounded-lg" />
            )}
            <img
              src={itemImage}
              alt={itemName}
              loading="lazy"
              onLoad={() => setIsImageLoadedDialog(true)}
              className={`w-full h-full object-cover rounded-md ${
                isImageLoadedDialog ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          <div className="flex flex-col gap-y-2.5">
            <p className="text-gray-950 font-bold text-xl">{itemName}</p>
            <div className="flex items-center gap-x-2">
              <p
                className={cn(
                  "text-gray-950 font-semibold text-base",
                  isOnSale && "line-through"
                )}
              >
                {formatPrice(itemPrice)}
              </p>

              {isOnSale && salePercentage && (
                <p className="text-primary text-lg font-semibold">
                  {formatPrice(itemPrice - (itemPrice * salePercentage) / 100)}
                </p>
              )}
            </div>

            <Button
              type="button"
              onClick={handleAddAndRemoveFromCart}
              disabled={isPending || isClosed || isTimeout}
              className="font-semibold px-8 py-5"
              variant={localIsInCart ? "outline" : "default"}
            >
              {isPending ? (
                <Loader2 size={21} className="animate-spin" />
              ) : localIsInCart ? (
                "Remove from cart"
              ) : (
                "Add to cart"
              )}
            </Button>
          </div>
        </div>
        <hr />
        <div className="flex flex-col gap-y-1">
          <p className="text-gray-950 font-bold text-lg">Product Information</p>
          <p className="text-neutral-700 text-sm font-medium">
            {itemDescription}
          </p>
        </div>
        <hr />
        <div className="flex flex-col gap-y-4">
          <p className="text-gray-950 font-bold text-lg">More like this</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemCard;
