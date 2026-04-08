import express from "express";
import { protectRoute } from "../controllers/userController.js";
import { getCurrentQRUuid } from "../controllers/qrController.js";

const router = express.Router();

// Protected route
router.get("/current", protectRoute, getCurrentQRUuid);

export default router;

