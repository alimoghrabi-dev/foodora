import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, buttonVariants } from "../components/ui/button";
import { useAuth } from "../context/UseAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNewOrder, getUserCartItems } from "../lib/actions";
import CartItem from "../components/CartItem";
import { Loader2 } from "lucide-react";
import { formatPrice } from "../lib/utils";
import { useCartContext } from "../context/CartContext";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Skeleton } from "../components/ui/skeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { useToast } from "../components/ui/use-toast";

const RestaurantCart: React.FC = () => {
  const { token } = useAuth();
  const { isChangingQuantity } = useCartContext();
  const { toast } = useToast();

  const { id: cartId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!token) {
      navigate("/market");
    }
  }, [navigate, token]);

  const [cartItemsState, setCartItemsState] = useState<ICartItem[]>([]);
  const [paymentMethod, setPaymentMethod] =
    useState<string>("cash-on-delivery");

  const {
    data: cart,
    isPending,
    isFetching,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const items = await getUserCartItems(token, cartId);
      setCartItemsState(items?.cartItems);

      return items;
    },
    enabled: !!cartId,
  });

  useEffect(() => {
    if (!isPending && !isFetching) {
      if (cart?.cartItems?.length === 0 || !cart) {
        navigate("/cart");
      }
    }
  }, [cart, cart?.cartItems, isFetching, isPending, navigate]);

  const updateTotalPrice = (itemId: string, newQuantity: number) => {
    setCartItemsState((prevItems) =>
      prevItems.map((item) =>
        item.itemId._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const totalPrice =
    cartItemsState
      ?.map((item: ICartItem) => {
        const itemPrice = item?.itemId?.restaurantId?.salePercentage
          ? item.price * (1 - item?.itemId?.restaurantId?.salePercentage / 100)
          : item.price;

        return itemPrice * item.quantity;
      })
      .reduce((a: number, b: number) => a + b, 0) || 0;

  const { mutate: checkoutAndOrder, isPending: isOrdering } = useMutation({
    mutationFn: async () => {
      const newOrder = await createNewOrder(
        token,
        cart?.restaurantId,
        cartId,
        paymentMethod,
        totalPrice
      );

      return newOrder.orderId;
    },
    onSuccess: (orderId) => {
      queryClient.invalidateQueries({ queryKey: ["auth-status"] });

      toast({
        title: "New Order created successfully",
        className:
          "bg-green-500 text-white text-3xl font-semibold ring-0 border-none",
      });

      navigate(`/orders/${orderId}`);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  return (
    <section className="flex flex-col gap-y-12 py-12 px-4 md:px-12 lg:px-24 xl:px-36">
      {isPending ? (
        <Skeleton className="w-72 h-12 bg-gray-100 rounded-lg" />
      ) : (
        <h1 className="text-4xl font-semibold text-gray-950 lilita_one_font">
          <span className="text-primary">{cart?.restaurantName}'s </span>Cart
        </h1>
      )}

      {isPending || isFetching ? (
        <div className="w-full flex items-center justify-center py-16">
          <Loader2 size={68} className="text-primary/85 animate-spin" />
        </div>
      ) : (
        cart?.cartItems?.length > 0 && (
          <div className="w-full flex gap-x-4">
            <div className="flex-1 flex flex-col gap-y-6">
              {cart?.cartItems?.map((item: ICartItem, index: number) => (
                <Fragment key={index}>
                  <CartItem
                    token={token}
                    cartItemId={item._id}
                    itemId={item.itemId._id}
                    itemCategoryId={item.itemId.category}
                    restaurantId={item.itemId.restaurantId._id}
                    restaurantOnSale={item.itemId.restaurantId.isOnSale}
                    restaurantSalePercentage={
                      item.itemId.restaurantId.salePercentage
                    }
                    itemName={item.itemId.name}
                    itemImage={item.itemId.imageUrl}
                    itemPrice={item.itemId.price}
                    initialQuantity={item.quantity}
                    updateTotalPrice={updateTotalPrice}
                    note={item.note}
                    isOutOfStock={item.itemId.isOutOfStock}
                  />
                  {index !== cart?.cartItems?.length - 1 && (
                    <div className="w-full h-px bg-black/10" />
                  )}
                </Fragment>
              ))}
            </div>
            <div className="flex items-start gap-x-6">
              <div className="h-full w-px bg-black/10" />
              <div className="flex flex-col gap-y-2.5">
                <p className="text-neutral-700 font-medium text-xs text-end">
                  {cart?.cartItems?.length}{" "}
                  {cart?.cartItems?.length === 1 ? "item" : "items"}
                </p>
                <div className="w-full flex flex-col items-end py-1.5">
                  <RadioGroup
                    defaultValue={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value)}
                  >
                    <div className="flex items-center justify-end space-x-2">
                      <Label
                        htmlFor="cash-on-delivery"
                        className="cursor-pointer"
                      >
                        Cash on Delivery
                      </Label>
                      <RadioGroupItem
                        value="cash-on-delivery"
                        id="cash-on-delivery"
                      />
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                      <Label htmlFor="wich-money" className="cursor-pointer">
                        Which Money
                      </Label>
                      <RadioGroupItem value="wich-money" id="wich-money" />
                    </div>
                  </RadioGroup>
                </div>
                <div className="flex items-center justify-between gap-x-3">
                  <p className="text-gray-950 font-semibold text-sm">
                    Subtotal
                  </p>
                  <p className="text-neutral-700 font-medium text-sm">
                    {isPending || isChangingQuantity ? (
                      <Loader2
                        size={16}
                        className="animate-spin text-gray-950/85"
                      />
                    ) : (
                      formatPrice(totalPrice)
                    )}
                  </p>
                </div>
                <div className="flex gap-x-2.5">
                  <Link
                    to="/market"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Continue Shopping
                  </Link>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        disabled={
                          isChangingQuantity ||
                          isOrdering ||
                          cart?.isRestaurantClosed ||
                          cart?.isRestaurantTimeout
                        }
                      >
                        Checkout
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-lg">
                      <DialogHeader>
                        <DialogTitle>
                          Are you sure you want to proceed to checkout?
                        </DialogTitle>
                      </DialogHeader>
                      <DialogFooter className="w-full grid grid-cols-2 gap-2">
                        <DialogClose
                          className={buttonVariants({ variant: "outline" })}
                        >
                          Cancel
                        </DialogClose>
                        <Button
                          disabled={
                            isChangingQuantity ||
                            isOrdering ||
                            cart?.isRestaurantClosed ||
                            cart?.isRestaurantTimeout
                          }
                          onClick={() => checkoutAndOrder()}
                        >
                          {isOrdering ? (
                            <Loader2 size={17} className="animate-spin" />
                          ) : (
                            "Proceed"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                {cart?.isRestaurantClosed ? (
                  <div className="w-full flex items-center justify-center text-sm font-semibold text-primary">
                    Restaruant is currently closed
                  </div>
                ) : cart?.isRestaurantTimeout ? (
                  <div className="w-full flex items-center justify-center text-sm font-semibold text-primary">
                    Restaruant is currently closed
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )
      )}
    </section>
  );
};

export default RestaurantCart;
