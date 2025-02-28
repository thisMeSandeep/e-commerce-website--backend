import WishListModel from "../models/wishList.model.js";

// add items to wish list
export const addItemsToWishlist = async (req, res) => {
  const userId = req.id;
  const { productId, title, thumbnail, price, stockStatus } = req.body;

  try {
    if (!productId || !title || !thumbnail || !price || !stockStatus) {
      return res.status(400).json({
        success: false,
        message: "Item cannot be added wishlist",
      });
    }

    // item is already in this user's wishlist
    const existingItem = await WishListModel.findOne({ productId, userId });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Item already in wishlist",
      });
    }

    // Add item to wishlist
    await WishListModel.create({
      productId,
      userId,
      title,
      thumbnail,
      price,
      stockStatus,
    });

    return res.status(201).json({
      success: true,
      message: "Item added to wishlist",
    });
  } catch (err) {
    console.error("Wishlist Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// get wishlist items

export const getWishListItems = async (req, res) => {
  const userId = req.id;
  try {
    // get items
    const items = await WishListModel.find({ userId });

    if (!items || items.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No items in wishlist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Items found",
      items,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// remove wishlist item

export const removeItemFromWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.id;

    const removedItem = await WishListModel.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!removedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in your wishlist",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item removed from wishlist",
    });
  } catch (err) {
    console.error("Wishlist Remove Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
