import multer from "multer";
import * as userService from "../services/userService.js";

const handleError = (res, error) => {
  if (error instanceof userService.AppError) {
    return res.status(error.status).json({
      message: error.message,
      ...(error.data || {}),
    });
  }
  res.status(400).json({
    message: "error",
    error: error?.message || error,
  });
};

const signUp = async (req, res) => {
  try {
    const result = await userService.signUpUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, error);
  }
};

const requestNewOTP = async (req, res) => {
  try {
    const result = await userService.requestNewOTP(req.body);
    res.status(200).json({ message: "success", data: result });
  } catch (error) {
    handleError(res, error);
  }
};

const verifyUser = async (req, res) => {
  try {
    const result = await userService.verifyUserAccount(req.body);
    res.status(200).json({
      message: "Account verified successfully.",
      ...result,
    });
  } catch (error) {
    if (error instanceof userService.AppError) {
      return res.status(error.status).json({
        message: error.message,
        ...(error.data || {}),
      });
    }
    res.status(500).json({ error: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const result = await userService.signInUser(req.body);
    res.status(200).json({
      message: "You are successfully Logined",
      ...result,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof userService.AppError) {
      return res.status(error.status).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

const protectRoute = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Not Authorized, no token" });
  }

  try {
    const user = await userService.verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    handleError(res, error);
  }
};

const forgeetPassword = async (req, res) => {
  try {
    const result = await userService.requestPasswordReset(req.body);
    res.status(200).json({
      status: "success",
      message: "OTP sent to your email!",
      email: result.email,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const verifyResetPassword = async (req, res) => {
  try {
    await userService.verifyPasswordResetCode(req.body);
    res.status(200).json({ message: "You can reset Your Password Now" });
  } catch (error) {
    handleError(res, error);
  }
};

const resetPassword = async (req, res) => {
  try {
    await userService.resetUserPassword(req.body);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await userService.updateUserPassword(req.user, currentPassword, newPassword);
    res.status(200).json({
      status: "success",
      message: "password changed successfully",
    });
  } catch (error) {
    if (error instanceof userService.AppError) {
      return res.status(error.status).json({
        status: "failed",
        message: error.message,
      });
    }
    res.status(400).json({ status: "failed", message: error.message });
  }
};

// Multer storage
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `User-${req.user.id}-${Date.now()}.${ext}`);
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image , please upload an image", 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const updateMe = async (req, res) => {
  try {
    const newUser = await userService.updateUserData(req.user.id, req.body, req.file?.filename);
    res.status(200).json({
      status: "success",
      data: newUser,
    });
  } catch (error) {
    if (error instanceof userService.AppError) {
       return res.status(error.status).json({
         status: "failed",
         message: error.message,
       });
    }
    res.status(400).json({ status: "failed", message: error.message });
  }
};

const deleteMe = async (req, res) => {
  try {
    await userService.deleteUserData(req.user.id);
    res.status(204).json({
      message: "success",
      data: null,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getMe = async (req, res) => {
  try {
    // req.user is already populated by protectRoute middleware
    res.status(200).json({
      status: "success",
      data: req.user,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export {
  signUp,
  verifyUser,
  requestNewOTP,
  signIn,
  protectRoute,
  forgeetPassword,
  verifyResetPassword,
  resetPassword,
  updatePassword,
  updateMe,
  deleteMe,
  getMe,
  upload,
};
