import { X } from "lucide-react";
import React, { useState } from "react";
import { cn } from "../lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCartItemNote } from "../lib/actions";
import { useToast } from "./ui/use-toast";

const NoteFetcher: React.FC<{
  note: string | null;
  token: string | null;
  cartItemId: string | undefined;
  itemName: string;
}> = ({ note, token, cartItemId, itemName }) => {
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { mutate: removeNote, isPending } = useMutation({
    mutationFn: async () => {
      await removeCartItemNote(token, cartItemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      setIsOpen(false);

      toast({
        title: `Note removed successfully for ${itemName}`,
        className:
          "bg-green-500 text-white text-3xl font-semibold ring-0 border-none",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Something went wrong while removing note for ${itemName}`,
        variant: "destructive",
      });
    },
  });

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="flex items-center gap-x-2"
    >
      <p className="text-sm font-medium text-primary">Note:</p>
      <p className="text-gray-700 font-medium text-sm max-w-xs line-clamp-2 break-words">
        {note}
      </p>

      <button
        disabled={isPending}
        onClick={() => removeNote()}
        className={cn(
          "transition-all duration-300 transform disabled:opacity-40 disabled:cursor-not-allowed",
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-0 pointer-events-none"
        )}
      >
        <X
          size={16}
          className="text-red-600 hover:opacity-85 transition mt-0.5"
        />
      </button>
    </div>
  );
};

export default NoteFetcher;
