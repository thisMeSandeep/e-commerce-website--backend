import express from "express";
import { registerController } from "../controllers/user.controller.js";
import { loginController } from "../controllers/user.controller.js";
import { logoutController } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.route("/register").post(registerController); //register route
userRouter.route("/login").post(loginController); // login route
userRouter.route("/logout").post(logoutController); // logout route

export default userRouter;
