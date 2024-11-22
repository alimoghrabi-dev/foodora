import { Schema, model } from "mongoose";
const driverApplySchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    vehicleType: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    licenseType: { type: String, required: true },
}, { timestamps: true });
const DriverApply = model("DriverApply", driverApplySchema);
export default DriverApply;
//# sourceMappingURL=driverApply.model.js.map