import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addItemToCartController,
  getCartItemsController,
  removeItemFromCartController,
} from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter
  .route("/addItemToCart")
  .post(authMiddleware, addItemToCartController); //add item to cart

cartRouter.route("/getCartItems").get(authMiddleware, getCartItemsController); //get cart items
cartRouter
  .route("/removeItem/:id")
  .delete(authMiddleware, removeItemFromCartController); //remove item from cart

export default cartRouter;
