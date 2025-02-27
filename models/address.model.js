import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    country: { type: String, required: true },
    mobile: { type: Number, required: true },
  },
  { timestamps: true }
);

const AddressModel =
  mongoose.models.Address || mongoose.model("Address", addressSchema);

export default AddressModel;
