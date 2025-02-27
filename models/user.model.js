import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: "" },
    // Reference to address model
    address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],

    // Reference to cart model
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cart" }],

    // Reference to wishList model
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "WishList" }],

    // Reference to order model
    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],

    lastLoginDate: { type: String, default: null },

    accountStatus: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
