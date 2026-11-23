import routes from "./routes/index.js";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Đường dẫn thử để biết server còn sống
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Đường dẫn không tồn tại
app.use("/api", routes);
app.use((req, res) => {
  res.status(404).json({ message: "Không tìm thấy đường dẫn" });
});

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Lỗi máy chủ" });
});

export default app;
