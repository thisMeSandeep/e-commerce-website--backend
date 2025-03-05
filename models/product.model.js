import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    stock: { type: Number, required: true },
    tags: [{ type: String }],
    brand: { type: String, },
    sku: { type: String, unique: true, required: true },
    weight: { type: Number, default: 0 },

    dimensions: {
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 },
      depth: { type: Number, default: 0 },
    },

    warrantyInformation: { type: String, default: "No warranty available" },
    shippingInformation: {
      type: String,
      default: "Ships in 3-5 business days",
    },
    availabilityStatus: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
    
    reviews: [
      {
        rating: Number,
        comment: String,
        date: Date,
        reviewerName: String,
        reviewerEmail: String,
      },
    ],

    returnPolicy: { type: String, default: "No return policy available" },
    minimumOrderQuantity: { type: Number, default: 1 },

    // MetaData optional only for dummy json products
    meta: {
      createdAt: { type: Date },
      updatedAt: { type: Date },
      barcode: { type: String },
      qrCode: { type: String },
    },

    images: [{ type: String }],
    thumbnail: { type: String, required: true },
  },
  { timestamps: true }
);

// Ensure meta data is only included for dummy data
productSchema.pre("save", function (next) {
  if (!this.meta || Object.keys(this.meta).length === 0) {
    this.meta = undefined;
  }
  next();
});

const ProductModel =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default ProductModel;
