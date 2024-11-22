import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllApplies } from "../../lib/actions";
import { useAuth } from "../../context/UseAuth";
import ApplyContainer from "../components/ApplyContainer";
import { Loader2 } from "lucide-react";

const Applies: React.FC = () => {
  const { token } = useAuth();

  const { data: applies, isPending } = useQuery({
    queryKey: ["applies"],
    queryFn: async () => {
      return await getAllApplies(token);
    },
  });

  return (
    <div className="w-full h-full">
      {isPending ? (
        <div className="w-full flex items-center justify-center mt-24">
          <Loader2 size={72} className="primary-text opacity-85 animate-spin" />
        </div>
      ) : applies?.data?.length > 0 ? (
        <div className="w-full flex flex-col gap-4">
          {applies?.data?.map((apply: Apply, index: number) => (
            <ApplyContainer
              key={index}
              index={index}
              id={apply._id}
              restaurantName={apply.restaurantName}
              email={apply.email}
              phoneNumber={apply.phoneNumber}
              description={apply.description}
              createdAt={apply.createdAt}
              token={token}
            />
          ))}
        </div>
      ) : (
        <p className="pt-12 text-2xl sm:text-3xl font-semibold text-gray-950 text-center">
          No applies at this moment
        </p>
      )}
    </div>
  );
};

export default Applies;
