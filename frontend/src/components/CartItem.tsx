import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn, formatPrice } from "../lib/utils";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addAndRemoveItemFromCart } from "../lib/actions";
import { useCartContext } from "../context/CartContext";
import { Skeleton } from "./ui/skeleton";
import AddNote from "./AddNote";
import NoteFetcher from "./NoteFetcher";

const CartItem: React.FC<{
  cartItemId: string;
  token: string | null;
  itemId: string;
  itemCategoryId: string;
  restaurantId: string;
  restaurantOnSale: boolean;
  restaurantSalePercentage: number | undefined;
  itemName: string;
  itemImage: string;
  itemPrice: number;
  initialQuantity: number;
  updateTotalPrice: (itemId: string, newQuantity: number) => void;
  note: string | null;
  isOutOfStock: boolean;
}> = ({
  cartItemId,
  token,
  itemId,
  itemCategoryId,
  restaurantId,
  restaurantOnSale,
  restaurantSalePercentage,
  itemName,
  itemImage,
  itemPrice,
  initialQuantity,
  updateTotalPrice,
  note,
  isOutOfStock,
}) => {
  const { mutateQuantity, isChangingQuantity } = useCartContext();

  const queryClient = useQueryClient();
  const location = useLocation();

  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await addAndRemoveItemFromCart(itemId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-status"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["user-carts"] });
      queryClient.invalidateQueries({
        queryKey: ["restaurant-by-id", restaurantId],
      });
      queryClient.invalidateQueries({
        queryKey: ["restaurant-items", itemCategoryId],
      });
    },
  });

  const handleIncreaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateTotalPrice(itemId, newQuantity);
    mutateQuantity({
      itemId,
      token,
      newQuantity,
    });
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateTotalPrice(itemId, newQuantity);
      mutateQuantity({
        itemId,
        token,
        newQuantity,
      });
    }
  };

  useEffect(() => {
    if (isOutOfStock) {
      mutate();
    }
  }, [isOutOfStock, mutate, location.pathname]);

  return (
    <div className="w-full h-32 flex items-start gap-x-4">
      <div className="w-60 h-full flex-shrink-0">
        {!isImageLoaded && <Skeleton className="w-full h-full rounded-lg" />}

        <img
          src={itemImage}
          alt={itemName}
          loading="lazy"
          onLoad={() => setIsImageLoaded(true)}
          className={cn(
            "w-full h-full object-cover object-center rounded-md shadow-md",
            isImageLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
      <div className="w-full h-full flex justify-between py-0.5">
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col gap-y-1">
            <Link
              to={`/market/restaurant/${restaurantId}?item=${itemId}`}
              className="text-lg font-semibold text-gray-950"
            >
              {itemName}
            </Link>

            {note ? (
              <NoteFetcher
                note={note}
                token={token}
                cartItemId={cartItemId}
                itemName={itemName}
              />
            ) : (
              <AddNote
                token={token}
                cartItemId={cartItemId}
                itemName={itemName}
              />
            )}
          </div>
          <div className="flex gap-x-2 items-center">
            <p
              className={cn(
                "text-primary text-base font-semibold",
                restaurantOnSale && "line-through font-medium text-gray-950"
              )}
            >
              {formatPrice(itemPrice)}
            </p>
            {restaurantOnSale && restaurantSalePercentage && (
              <p className="text-primary text-base font-semibold">
                {formatPrice(
                  itemPrice - (itemPrice * restaurantSalePercentage) / 100
                )}
              </p>
            )}
          </div>
        </div>
        <div className="self-end flex flex-col gap-y-2.5">
          <div className="flex items-center gap-x-4">
            <Button
              type="button"
              onClick={handleDecreaseQuantity}
              disabled={isPending || quantity === 1 || isChangingQuantity}
              variant="outline"
              className="rounded-md h-9"
            >
              <Minus size={18} />
            </Button>
            <span className="text-gray-950 font-semibold text-base">
              {quantity}
            </span>
            <Button
              type="button"
              onClick={handleIncreaseQuantity}
              disabled={isPending || isChangingQuantity}
              variant="outline"
              className="rounded-md h-9"
            >
              <Plus size={18} />
            </Button>
          </div>
          <Button
            type="button"
            onClick={() => mutate()}
            disabled={isPending}
            variant="outline"
            className="gap-x-2 w-full rounded-md h-9 hover:bg-primary hover:border-primary hover:text-white"
          >
            <Minus size={18} />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
