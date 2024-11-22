import { Schema, Document, model } from "mongoose";

export interface IApply extends Document {
  restaurantName: string;
  description: string;
  email: string;
  phoneNumber: string;
  address: string;
  isRejected: boolean;
  isApproved: boolean;
}

const ApplySchema = new Schema<IApply>(
  {
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
  },
  { timestamps: true }
);

const Apply = model("Apply", ApplySchema);

export default Apply;
