import express from "express";
import { getProductsController ,getSingleProductController } from "../controllers/product.controller.js";

const productRouter = express.Router();

productRouter.route("/get-products").get(getProductsController);
productRouter.route("/get-products/:id").get(getSingleProductController);

export default productRouter;
