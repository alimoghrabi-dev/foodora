import { Schema, model } from "mongoose";
const ApplySchema = new Schema({
    restaurantName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    isRejected: {
        type: Boolean,
        default: false,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
const Apply = model("Apply", ApplySchema);
export default Apply;
//# sourceMappingURL=apply.model.js.map