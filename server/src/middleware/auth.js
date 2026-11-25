import jwt from "jsonwebtoken";

// Dùng cho các route cần đăng nhập.
export function verifyToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập" });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res
      .status(401)
      .json({ message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn" });
  }
}

// Dùng sau verifyToken, cho các route chỉ admin được vào
export function isAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Bạn không có quyền thực hiện thao tác này" });
  }
  next();
}
