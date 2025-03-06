import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  codOrderController,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/order.controller.js";

const orderRouter = express.Router();

orderRouter.route("/cod-order").post(authMiddleware, codOrderController); //cod order
orderRouter.route("/create-order").post(authMiddleware, createRazorpayOrder); // create order
orderRouter.route("/verify-payment").post(authMiddleware, verifyRazorpayPayment); //verify payment
export default orderRouter;
