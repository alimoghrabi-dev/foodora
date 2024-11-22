import { Schema, Document, model } from "mongoose";

export interface IOrder extends Document {
  items: Schema.Types.ObjectId[];
  restaurantId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  checkoutType: string;
  totalPrice: number;
  orderStatus: string;
  orderNumber: number;
}

const OrderSchema = new Schema<IOrder>(
  {
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "CartItem",
      },
    ],
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    checkoutType: {
      type: String,
      enum: ["cash-on-delivery", "which-money"],
    },
    totalPrice: {
      type: Number,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "accepted", "ready", "delivering", "delivered"],
    },
    orderNumber: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Order = model("Order", OrderSchema);

export default Order;
