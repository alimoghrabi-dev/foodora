import React from "react";
import { Button } from "../components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleRestaurant } from "../lib/actions";
import { useAuth } from "../context/useAuth";
import { useToast } from "../components/ui/use-toast";
import { Loader2 } from "lucide-react";
import DaysOfTheWeekOpeningHours from "../components/DaysOfTheWeekOpeningHours";

const OpeningHours: React.FC = () => {
  const { token, admin } = useAuth();
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { mutate: toggleRestaurantMutation, isPending } = useMutation({
    mutationFn: async ({ isOpening }: { isOpening: boolean }) => {
      await toggleRestaurant(token);

      return { isOpening };
    },
    onSuccess: ({ isOpening }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-status"] });

      toast({
        title: `Store ${isOpening ? "re-opened" : "closed"}`,
        description: `Store has been ${
          isOpening ? "re-opened" : "closed"
        } successfully`,
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Something went wrong while closing store",
        variant: "destructive",
      });
    },
  });

  return (
    <section className="w-full flex flex-col gap-y-5 px-4 md:px-8">
      <div className="w-full pt-5 flex items-center justify-center gap-x-8">
        <p className="text-base font-semibold text-gray-950">
          Want to close or open the store sooner ?
        </p>

        <Button
          variant={admin?.isClosed ? "default" : "outline"}
          disabled={isPending}
          onClick={() =>
            toggleRestaurantMutation({
              isOpening: admin?.isClosed ? true : false,
            })
          }
          className="w-[118px] h-[34px] rounded-lg"
        >
          {isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : admin?.isClosed ? (
            "Re-open Store"
          ) : (
            "Close Store"
          )}
        </Button>
      </div>
      <hr />

      <DaysOfTheWeekOpeningHours
        token={token}
        adminOpeningHours={admin?.openingHours}
      />
    </section>
  );
};

export default OpeningHours;
