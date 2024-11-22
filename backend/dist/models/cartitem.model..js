import { model, Schema } from "mongoose";
const CartItemSchema = new Schema({
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
//# sourceMappingURL=cartitem.model..js.map