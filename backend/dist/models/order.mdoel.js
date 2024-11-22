import { Schema, model } from "mongoose";
const OrderSchema = new Schema({
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
}, { timestamps: true });
const Order = model("Order", OrderSchema);
export default Order;
//# sourceMappingURL=order.mdoel.js.map