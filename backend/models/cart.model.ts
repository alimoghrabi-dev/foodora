import { Schema, Document, model } from "mongoose";

export interface ICart extends Document {
  userId: Schema.Types.ObjectId;
  restaurantId: Schema.Types.ObjectId;
  cartItems: Schema.Types.ObjectId[];
}

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    cartItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "CartItem",
      },
    ],
  },
  { timestamps: true }
);

const Cart = model("Cart", CartSchema);

export default Cart;
