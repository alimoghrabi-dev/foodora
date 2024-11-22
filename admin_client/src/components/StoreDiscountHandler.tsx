import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyDiscount } from "../lib/actions";
import { useToast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";

const StoreDiscountHandler: React.FC<{
  token: string | null;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ token, setIsOpen }) => {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const [discount, setDiscount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { mutate: applyDiscountMutation, isPending } = useMutation({
    mutationFn: async () => {
      await applyDiscount(token, discount);
    },
    onSuccess: () => {
      setIsOpen(false);

      toast({
        title: "Discount Applied",
        description: `${discount}% discount applied successfully.`,
      });

      setDiscount(null);
      setError(null);

      queryClient.invalidateQueries({ queryKey: ["admin-status"] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to apply discount.",
      });
    },
  });

  const handleClick = () => {
    if (!discount || discount < 5) {
      setError("Please enter a valid discount (at least 5%)");
      return;
    }

    applyDiscountMutation();
  };

  useEffect(() => {
    if (discount) {
      if (discount >= 5) {
        setError(null);
      }
    }
  }, [discount]);

  return (
    <>
      <div className="w-full flex gap-2">
        <Input
          type="number"
          min={5}
          onChange={(e) => setDiscount(Number(e.target.value))}
          placeholder="Enter Store Discount"
          className="flex-1 hover:border-primary/40 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all focus-visible:border-primary"
        />
        <Button
          disabled={!discount || isPending}
          className="w-fit"
          onClick={handleClick}
        >
          {isPending ? <Loader2 size={16} className="animate-spin" /> : "Apply"}
        </Button>
      </div>
      {error && <p className="text-red-500 font-medium text-sm">{error}</p>}
    </>
  );
};

export default StoreDiscountHandler;
