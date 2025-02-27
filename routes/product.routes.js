import express from "express";
import { getProductsController } from "../controllers/product.controller.js";

const productRouter = express.Router();

productRouter.route("/get-products").get(getProductsController);

export default productRouter;
