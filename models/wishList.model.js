import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const WishListModel =
  mongoose.models.WishList || mongoose.model("WishList", wishListSchema);

export default WishListModel; 
