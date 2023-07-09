import { Router } from "express";
import {
  createUser,
  getMe,
  loginUser,
  logoutUser,
  sayHiToUser,
} from "../controllers/authController";
import { authenticateToken } from "../middlewares/authMiddlewares";

const router = Router();

router.get("/sayhi", sayHiToUser);
router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/me", authenticateToken, getMe);
router.get("/logout", logoutUser)

export default router;
