import express from "express";
const router = express.Router();
import {
  signUp,
  signIn,
  verifyUser,
  requestNewOTP,
  protectRoute,
  forgeetPassword,
  verifyResetPassword,
  resetPassword,
  updateMe,
  updatePassword,
  deleteMe,
  getMe,
  upload,
} from "../controllers/userController.js";

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.post("/verifyUser", verifyUser);
router.post("/requestNewOTP", requestNewOTP);
router.post("/forgetPassword", forgeetPassword);
router.post("/verifyResetPassword", verifyResetPassword);
router.post("/resetPassword", resetPassword);

// Protected routes
router.use(protectRoute);

router.get("/me", getMe);
router.patch("/updatePassword", updatePassword);
router.patch("/updateMe", upload.single("photo"), updateMe);
router.delete("/deleteMe", deleteMe);

export default router;
