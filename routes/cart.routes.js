import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addItemToCartController,
  getCartItemsController,
} from "../controllers/cart.controller.js";

const cartRouter = express.Router();

cartRouter
  .route("/addItemToCart")
  .post(authMiddleware, addItemToCartController); //add item to cart

cartRouter.route("/getCartItems").get(authMiddleware, getCartItemsController); //get cart items

export default cartRouter;
