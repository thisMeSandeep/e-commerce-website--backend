import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addItemToCartController,
  getCartItemsController,
  removeItemFromCartController,
} from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter
  .route("/add-Item-ToCart")
  .post(authMiddleware, addItemToCartController); //add item to cart

cartRouter.route("/get-Cart-Items").get(authMiddleware, getCartItemsController); //get cart items
cartRouter
  .route("/remove-Item/:id")
  .delete(authMiddleware, removeItemFromCartController); //remove item from cart

export default cartRouter;
