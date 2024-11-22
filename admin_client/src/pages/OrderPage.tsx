import React, { Fragment } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptAndReadyOrder, getOrderById } from "../lib/actions";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import { cn, formatPrice } from "../lib/utils";

const OrderPage: React.FC = () => {
  const { token } = useAuth();
  const { id: orderId } = useParams();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: order, isPending } = useQuery({
    queryKey: ["order-id"],
    queryFn: async () => {
      return await getOrderById(token, orderId);
    },
  });

  const { mutate: acceptAndReadyMutation, isPending: isMutating } = useMutation(
    {
      mutationFn: async () => {
        await acceptAndReadyOrder(token, orderId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["orders"] });
        queryClient.invalidateQueries({ queryKey: ["order-id"] });

        navigate("/orders");
      },
    }
  );

  console.log(order);

  return isPending ? (
    <div className="w-full flex items-center justify-center py-28">
      <Loader2 size={52} className="animate-spin text-primary/75" />
    </div>
  ) : (
    <div className="w-full flex flex-col gap-y-4 p-4 md:p-8">
      <div className="w-full flex items-center justify-between gap-x-4 px-4">
        <p className="text-gray-950 font-semibold text-lg">
          Order #{order?.orderNumber}
        </p>

        {order?.orderStatus === "pending" ? (
          <Button
            size={"sm"}
            onClick={() => acceptAndReadyMutation()}
            disabled={isMutating}
            className="bg-yellow-500 hover:bg-yellow-500/75 px-4"
          >
            Confirm
          </Button>
        ) : order?.orderStatus === "accepted" ? (
          <Button
            size={"sm"}
            onClick={() => acceptAndReadyMutation()}
            disabled={isMutating}
            className="bg-green-500 hover:bg-green-500/75 px-4"
          >
            Ready
          </Button>
        ) : (
          <Button size={"sm"} disabled className="px-4">
            Ready
          </Button>
        )}
      </div>
      <hr />
      <div className="w-full flex flex-col gap-4">
        {order?.items?.map((item: ICartItem, index: number) => (
          <Fragment key={item._id}>
            <div className="w-full flex items-start gap-x-2.5">
              <div className="w-52 h-32">
                <img
                  src={item.itemId.imageUrl}
                  alt={item.itemId.name}
                  className="w-full h-full object-cover object-center rounded-md"
                />
              </div>
              <div className="flex flex-col justify-between h-32 py-0.5">
                <div className="flex flex-col gap-y-2">
                  <div className="flex items-center gap-x-4">
                    <p className="text-gray-950 font-semibold text-base">
                      {item.itemId.name}
                    </p>
                    <p className="text-primary font-bold text-lg">
                      x{item.quantity}
                    </p>
                  </div>
                  <p className="max-w-md break-words font-medium text-xs text-neutral-700 line-clamp-2">
                    {item.itemId.description}
                  </p>
                </div>
                <div className="flex items-center gap-x-2.5">
                  {order?.restaurantId?.isOnSale ? (
                    <p className="text-primary font-semibold text-lg">
                      {formatPrice(
                        item?.price -
                          (item?.price * order?.restaurantId?.salePercentage) /
                            100
                      )}
                    </p>
                  ) : null}
                  <p
                    className={cn(
                      "text-base font-semibold text-gray-950",
                      order?.restaurantId?.isOnSale && "line-through"
                    )}
                  >
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>
            </div>

            {index !== order?.items.length - 1 && <hr />}
          </Fragment>
        ))}
      </div>
      <hr />
      <div className="w-full flex items-center px-4">
        <div className="flex flex-col gap-y-0.5">
          <p className="text-[13px] font-medium text-neutral-600">
            {order?.items?.length}{" "}
            {order?.items?.length === 1 ? "item" : "items"}
          </p>
          <span className="flex items-center gap-x-2.5 text-base font-semibold text-gray-950">
            Total Price:{" "}
            <p className="text-primary">{formatPrice(order?.totalPrice)}</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
