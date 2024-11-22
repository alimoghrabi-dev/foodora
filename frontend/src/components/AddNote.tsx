import React, { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCartItemNote } from "../lib/actions";
import { useToast } from "./ui/use-toast";

const AddNote: React.FC<{
  token: string | null;
  cartItemId: string | undefined;
  itemName: string;
}> = ({ token, cartItemId, itemName }) => {
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { mutate: addNote, isPending } = useMutation({
    mutationFn: async () => {
      await addCartItemNote(token, input, cartItemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      setIsOpen(false);
      setInput(null);

      toast({
        title: `Note added successfully for ${itemName}`,
        className:
          "bg-green-500 text-white text-3xl font-semibold ring-0 border-none",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Something went wrong while adding note for ${itemName}`,
        variant: "destructive",
      });
    },
  });

  return isOpen ? (
    <div className="w-72 relative">
      <textarea
        rows={2}
        value={input || ""}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border placeholder:font-normal pr-5 placeholder:text-gray-600 border-gray-300/90 rounded-sm px-2 py-1.5 text-sm font-medium hover:border-gray-500 outline-none focus:border-primary/75 transition-all"
        placeholder="Add a Note"
        style={{ resize: "none" }}
      />
      <X
        size={16}
        onClick={() => setIsOpen(false)}
        className="text-red-600 absolute right-1 top-1.5 hover:opacity-85 transition cursor-pointer"
      />
      <button
        disabled={!input || isPending}
        onClick={() => addNote()}
        className="absolute right-1 bottom-2.5 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <Check
          size={17}
          className="text-green-600 hover:opacity-85 transition"
        />
      </button>
    </div>
  ) : (
    <button
      onClick={() => setIsOpen(true)}
      className="self-start flex items-center px-0 gap-x-1 font-medium text-sm hover:bg-transparent text-primary/95 hover:text-gray-800/85 transition-all"
    >
      <Plus size={16} />
      Add Note
    </button>
  );
};

export default AddNote;
