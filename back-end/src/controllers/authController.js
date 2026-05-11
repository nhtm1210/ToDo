import jwt from "jsonwebtoken";
import User from "../models/User.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

export const register = async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập username, email và mật khẩu" });
    }
    if (username.length < 3 || username.length > 30) {
      return res
        .status(400)
        .json({ message: "Username phải có từ 3 đến 30 ký tự" });
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ message: "Email không hợp lệ" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Username hoặc email đã được sử dụng" });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      username,
      email,
      passwordHash,
      displayName: displayName || username,
    });

    const token = signToken(user._id);
    res.status(201).json({ token, user: user.toPublicJSON() });
  } catch (error) {
    console.error("Lỗi khi gọi register", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập username/email và mật khẩu" });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier },
      ],
    });

    if (!user || !(await user.verifyPassword(password))) {
      return res
        .status(401)
        .json({ message: "Thông tin đăng nhập không chính xác" });
    }

    const token = signToken(user._id);
    res.status(200).json({ token, user: user.toPublicJSON() });
  } catch (error) {
    console.error("Lỗi khi gọi login", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getMe = async (req, res) => {
  res.status(200).json({ user: req.user.toPublicJSON() });
};
