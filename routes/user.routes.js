import express from "express";
import {
  getUserDataController,
  registerController,
  updateUserInfoController,
  loginController,
  logoutController,
  addUserAddressController,
  deleteAddressController,
  getAddressesController,
} from "../controllers/user.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../config/multer.js";

const userRouter = express.Router();

userRouter.route("/register").post(registerController); //register route
userRouter.route("/login").post(loginController); // login route
userRouter.route("/logout").post(logoutController); // logout route
userRouter.route("/getUserData").get(authMiddleware, getUserDataController); //get user data controller
userRouter.patch(
  "/update-data",
  authMiddleware,
  upload.single("avatar"),
  updateUserInfoController
); //update user data
userRouter.route("/add-address").post(authMiddleware, addUserAddressController); //add address
userRouter
  .route("/delete-address/:id")
  .delete(authMiddleware, deleteAddressController); // Delete user address

userRouter.route("/get-address").get(authMiddleware, getAddressesController); // Get user address


export default userRouter;
