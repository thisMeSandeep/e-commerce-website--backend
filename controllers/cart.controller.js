import CartModel from "../models/cart.model.js";
import UserModel from "../models/user.model.js"; 
import ProductModel from "../models/product.model.js";

// Add item to cart controller
export const addItemToCartController = async (req, res) => {
  try {
    const userId = req.id; // Get user ID from auth middleware
    const { quantity, productId } = req.body;

    if (!userId || !productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid request. Item cannot be added to cart.",
      });
    }

    // Check if the product already exists
    let cartItem = await CartModel.findOne({ userId, productId });

    if (cartItem) {
      cartItem.quantity = cartItem.quantity + quantity; // Update quantity if product already exists
      await cartItem.save();
    } else {
      cartItem = await CartModel.create({ userId, productId, quantity }); // Create a new cart item

      // Update the user's cart field
      await UserModel.findByIdAndUpdate(userId, {
        $addToSet: { cart: cartItem._id },
      });
    }
    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
    });
  } catch (err) {
    console.error("Cart Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while adding the item to the cart",
    });
  }
};

// get cart item
export const getCartItemsController = async (req, res) => {
  try {
    const userId = req.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Fetch cart items for the user
    const cartItems = await CartModel.find({ userId });

    //product Id
    const productIds = [...new Set(cartItems.map((item) => item.productId))];

    // Fetch  required product data
    const products = await ProductModel.find(
      { _id: { $in: productIds } },
      "_id title thumbnail" //  fetch _id, title, and thumbnail
    );

    const productMap = {};
    products.forEach((product) => {
      productMap[product._id] = product;
    });

    const cartWithProducts = cartItems.map((item) => ({
      _id: item._id,
      quantity: item.quantity,
      product: productMap[item.productId] || null,
    }));
    return res.status(200).json({
      success: true,
      message: "Cart data fetched successfully",
      cart: cartWithProducts,
    });
  } catch (err) {
    console.error("Cart Fetch Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
