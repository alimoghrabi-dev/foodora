import React, { createContext, useContext, useState } from "react";
import FloatingNumber from "../components/ui/FloatingNumber";
import { changeCartItemQuantity } from "../lib/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CartContextType {
  cartIconPosition: { x: number; y: number } | null;
  setCartIconPosition: (position: { x: number; y: number }) => void;
  triggerAnimation: (startX: number, startY: number) => void;
  mutateQuantity: (params: {
    itemId: string;
    token: string | null;
    newQuantity: number;
  }) => void;
  isChangingQuantity: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartIconPosition, setCartIconPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const queryClient = useQueryClient();

  const triggerAnimation = (startX: number, startY: number) => {
    if (cartIconPosition) {
      setStartPosition({ x: startX, y: startY });
      setIsAnimating(true);
    }
  };

  const { mutate: mutateQuantity, isPending: isChangingQuantity } = useMutation(
    {
      mutationFn: async (params: {
        itemId: string;
        token: string | null;
        newQuantity: number;
      }) => {
        const { itemId, token, newQuantity } = params;
        await changeCartItemQuantity(itemId, token, newQuantity);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["auth-status"],
        });
        queryClient.invalidateQueries({
          queryKey: ["cart"],
        });
      },
    }
  );

  return (
    <CartContext.Provider
      value={{
        cartIconPosition,
        setCartIconPosition,
        triggerAnimation,
        mutateQuantity,
        isChangingQuantity,
      }}
    >
      {children}
      {isAnimating && cartIconPosition && (
        <FloatingNumber
          startX={startPosition.x}
          startY={startPosition.y}
          endX={cartIconPosition.x}
          endY={cartIconPosition.y}
          onAnimationEnd={() => setIsAnimating(false)}
        />
      )}
    </CartContext.Provider>
  );
};
