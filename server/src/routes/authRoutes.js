import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

function createToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

function toUserJson(user) {
  return { _id: user._id, name: user.name, email: user.email, role: user.role };
}

// POST /api/auth/register - Đăng ký
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
  }

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    return res.status(409).json({ message: "Email này đã được đăng ký" });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });

  res.status(201).json({ token: createToken(user), user: toUserJson(user) });
});

// POST /api/auth/login - Đăng nhập
router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  const ok = user && (await bcrypt.compare(password, user.password));
  if (!ok) {
    return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
  }

  res.json({ token: createToken(user), user: toUserJson(user) });
});

// GET /api/auth/me - Xem thông tin tài khoản đang đăng nhập
router.get("/me", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: "Không tìm thấy tài khoản" });
  }
  res.json({ user: toUserJson(user) });
});

export default router;
