import express from "express";
import {
  addItemsToWishlist,
  getWishListItems,
  removeItemFromWishlist,
} from "../controllers/wishlist.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const wishListRouter = express.Router();

wishListRouter.route("/add-Items").post(authMiddleware, addItemsToWishlist); // Add item to wishlist
wishListRouter.route("/get-Items").get(authMiddleware, getWishListItems); // Get all wishlist items
wishListRouter.route("/remove-Items/:id").delete(authMiddleware, removeItemFromWishlist); // Remove item from wishlist

export default wishListRouter;
