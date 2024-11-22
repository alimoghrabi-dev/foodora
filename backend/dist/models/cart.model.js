import { Schema, model } from "mongoose";
const CartSchema = new Schema({
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
}, { timestamps: true });
const Cart = model("Cart", CartSchema);
export default Cart;
//# sourceMappingURL=cart.model.js.map