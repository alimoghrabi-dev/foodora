import { Schema, model } from "mongoose";
const CartSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    vehicleType: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    licenseType: { type: String, required: true },
}, { timestamps: true });
const Cart = model("Cart", CartSchema);
export default Cart;
//# sourceMappingURL=driver.model.js.map