import express from "express";
import { getStats } from "../controllers/statsController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getStats);

export default router;
