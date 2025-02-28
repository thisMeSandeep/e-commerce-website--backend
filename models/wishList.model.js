import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stockStatus: {
      type: String,
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
