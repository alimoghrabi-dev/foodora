import { Schema, model } from "mongoose";
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    googleId: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    nickname: {
        type: String,
    },
    password: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    phoneNumber: {
        type: String,
    },
    cartId: [
        {
            type: Schema.Types.ObjectId,
            ref: "Cart",
        },
    ],
}, { timestamps: true });
const User = model("User", UserSchema);
export default User;
//# sourceMappingURL=user.model.js.map