import express from "express";
import {
  addItemsToWishlist,
  getWishListItems,
  removeItemFromWishlist,
} from "../controllers/wishlist.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const wishListRouter = express.Router();

wishListRouter.route("/addItems").post(authMiddleware, addItemsToWishlist); // Add item to wishlist
wishListRouter.route("/getItems").get(authMiddleware, getWishListItems); // Get all wishlist items
wishListRouter
  .route("/removeItems/:id")
  .delete(authMiddleware, removeItemFromWishlist); // Remove item from wishlist

export default wishListRouter;
