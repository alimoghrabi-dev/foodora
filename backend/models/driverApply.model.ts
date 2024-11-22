import { Schema, Document, model } from "mongoose";

export interface IDriverApply extends Document {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  licenseNumber: string;
  vehicleType: string;
  vehicleNumber: string;
  licenseType: string;
}

const driverApplySchema = new Schema<IDriverApply>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    vehicleType: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    licenseType: { type: String, required: true },
  },
  { timestamps: true }
);

const DriverApply = model("DriverApply", driverApplySchema);

export default DriverApply;
