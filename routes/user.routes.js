import express from "express";
import {
  getUserDataController,
  registerController,
} from "../controllers/user.controller.js";
import { loginController } from "../controllers/user.controller.js";
import { logoutController } from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.route("/register").post(registerController); //register route
userRouter.route("/login").post(loginController); // login route
userRouter.route("/logout").post(logoutController); // logout route
userRouter.route("/getUserData").get(authMiddleware, getUserDataController); //get user data controller

export default userRouter;
