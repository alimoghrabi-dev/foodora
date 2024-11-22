import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getActiveOrders } from "../lib/actions";
import { Loader2 } from "lucide-react";
import ActiveOrderComponent from "./shared/ActiveOrderComponent";

const ActiveOrders: React.FC<{ token: string | null }> = ({ token }) => {
  const { data: activeOrders, isPending } = useQuery({
    queryKey: ["active-orders"],
    queryFn: async () => {
      return await getActiveOrders(token);
    },
  });

  return isPending ? (
    <div className="w-full flex items-center justify-center py-5">
      <Loader2 size={42} className="text-primary opacity-85 animate-spin" />
    </div>
  ) : activeOrders?.length === 0 ? (
    <div className="w-full flex items-center justify-start">
      <p className="text-neutral-700 text-[15px] font-medium">
        You have no active orders.
      </p>
    </div>
  ) : (
    <div className="w-full flex flex-wrap gap-4">
      {activeOrders.map((order: IOrder, index: number) => (
        <ActiveOrderComponent
          key={index}
          orderId={order._id}
          index={index}
          restaurantName={order.restaurantId.name}
          orderStatus={order.orderStatus}
        />
      ))}
    </div>
  );
};

export default ActiveOrders;
