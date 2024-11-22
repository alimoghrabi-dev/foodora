import { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  googleId: string;
  email: string;
  isEmailVerified: boolean;
  isAdmin: boolean;
  nickname: string;
  password: string;
  dateOfBirth: Date;
  phoneNumber: string;
  cartId: Schema.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
  {
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
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

export default User;
