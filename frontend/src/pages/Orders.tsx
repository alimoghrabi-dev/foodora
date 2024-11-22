import React from "react";
import ActiveOrders from "../components/ActiveOrders";
import PastOrders from "../components/PastOrders";
import { useAuth } from "../context/UseAuth";

const Orders: React.FC = () => {
  const { token } = useAuth();

  return (
    <div className="w-full flex flex-col gap-y-8 px-4 md:px-8 lg:px-12 py-12">
      <div className="flex flex-col justify-start gap-y-4">
        <h2 className="text-gray-950 font-bold lilita_one_font text-2xl">
          Active orders
        </h2>
        <ActiveOrders token={token} />
      </div>
      <hr />
      <div className="flex flex-col justify-start gap-y-4">
        <h2 className="text-gray-950 font-bold lilita_one_font text-2xl">
          Past orders
        </h2>
        <PastOrders token={token} />
      </div>
    </div>
  );
};

export default Orders;
