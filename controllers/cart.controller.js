import CartModel from "../models/cart.model.js";

// add to cart
export const addItemToCartController = async (req, res) => {
  try {
    const userId = req.id; // Get user ID from auth middleware
    const { quantity, title, price, thumbnail, productId } = req.body;

    if (
      !userId ||
      !productId ||
      !title ||
      !price ||
      !thumbnail ||
      !quantity ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Item cannot be added to cart.",
      });
    }

    // Check if the product already exists
    let cartItem = await CartModel.findOne({ userId, title });

    if (cartItem) {
      cartItem.quantity += quantity; // Update quantity
      await cartItem.save();
    } else {
      await CartModel.create({
        userId,
        productId,
        quantity,
        title,
        price,
        thumbnail,
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

// get cart items
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

    return res.status(200).json({
      success: true,
      message: "Cart data fetched successfully",
      cart: cartItems,
    });
  } catch (err) {
    console.error("Cart Fetch Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Remove item from cart
export const removeItemFromCartController = async (req, res) => {
  try {
    const userId = req.id; 
    const { id } = req.params; 
    if (!userId || !id) {
      return res.status(400).json({
        success: false,
        message: "Item cannot be removed.",
      });
    }

    const deletedItem = await CartModel.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item removed",
    });
  } catch (err) {
    console.error("Remove Cart Item Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while removing the item from the cart.",
    });
  }
};
