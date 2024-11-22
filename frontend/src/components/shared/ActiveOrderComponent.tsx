import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

const ActiveOrderComponent: React.FC<{
  orderId: string;
  index: number;
  restaurantName: string;
  orderStatus: string;
}> = ({ orderId, index, restaurantName, orderStatus }) => {
  return (
    <Link
      to={`/orders/${orderId}`}
      className="p-4 shadow-md rounded-md flex flex-col items-start gap-y-3 hover:bg-gray-50 transition-all"
    >
      <div className="flex items-center gap-x-4">
        <p className="text-base font-bold text-gray-950">#{index + 1}</p>
        <p className="text-base font-semibold text-gray-950">
          {restaurantName}
        </p>
      </div>

      <span className="text-sm font-semibold text-gray-950 flex gap-x-2.5">
        status:{" "}
        <p
          className={cn(
            "text-sm font-bold capitalize",
            orderStatus === "pending"
              ? "text-yellow-500"
              : orderStatus === "accepted"
              ? "text-green-500"
              : "text-primary"
          )}
        >
          {orderStatus}
        </p>
      </span>
    </Link>
  );
};

export default ActiveOrderComponent;
