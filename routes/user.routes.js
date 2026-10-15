import express from "express";
const userRouter = express.Router();
import userController from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth_middleware.js";
import { upload } from "../config/multer.js";

userRouter.route("/register")
.post(userController.registerUser)


userRouter.route("/login")
.post(userController.loginUser)

userRouter.route("/forget-password")
.post(userController.forgetPassword)

userRouter.route("/reset-password/:token")
.post(userController.resetPassword)

userRouter.route("/upload-image")
.post( protect ,  upload.single("image")   ,    userController.uploadProfileImage)


userRouter.route("/my-profile")
.get(   protect    ,   userController.getMyProfile)




export default userRouter;



