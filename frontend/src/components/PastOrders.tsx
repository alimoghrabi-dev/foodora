import React from "react";
import { getPastOrders } from "../lib/actions";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const PastOrders: React.FC<{ token: string | null }> = ({ token }) => {
  const { data: pastOrders, isPending } = useQuery({
    queryKey: ["past-orders"],
    queryFn: async () => {
      return await getPastOrders(token);
    },
  });

  return isPending ? (
    <div className="w-full flex items-center justify-center py-5">
      <Loader2 size={42} className="text-primary opacity-85 animate-spin" />
    </div>
  ) : pastOrders?.length === 0 ? (
    <div className="w-full flex items-center justify-start">
      <p className="text-neutral-700 text-[15px] font-medium">
        Oops, looks like you haven't placed any orders yet.
      </p>
    </div>
  ) : (
    <div></div>
  );
};

export default PastOrders;
