import User from "../models/user.model.js";
import { verifyToken } from "../utils/generateTokens.js";
import logger from "../utils/logger.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const userId = await verifyToken(token);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(`Error in protect route: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized - User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized - User is not an admin" });
    }

    next();
  } catch (error) {
    logger.error(`Error in require user: ${error.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
