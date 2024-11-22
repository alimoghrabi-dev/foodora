import { Document, model, Schema } from "mongoose";

export interface ICartItem extends Document {
  itemId: Schema.Types.ObjectId;
  cartId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  quantity: number;
  note: string;
  price: number;
}

const CartItemSchema = new Schema<ICartItem>({
  itemId: {
    type: Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  note: {
    type: String,
  },
  price: {
    type: Number,
  },
});

const CartItem = model("CartItem", CartItemSchema);

export default CartItem;
