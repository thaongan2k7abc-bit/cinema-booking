import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import api from "../../api/axios";
import { useAppDispatch } from "../../store/hooks";
import { loginSuccess } from "../../store/authSlice";
import type { User } from "../../types";
import "./auth.css";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<{ token: string; user: User }>(
        "/auth/register",
        { name, email, password },
      );
      dispatch(loginSuccess(res.data)); // đăng ký xong tự đăng nhập luôn
      navigate("/");
    } catch (err) {
      setError(
        isAxiosError(err)
          ? (err.response?.data?.message ?? "Không thể đăng ký")
          : "Đã có lỗi xảy ra",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <h2>Đăng ký</h2>

      <label>
        Họ tên
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label>
        Mật khẩu (ít nhất 6 ký tự)
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      <label>
        Nhập lại mật khẩu
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />
      </label>

      {error && <div className="auth-error">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? "Đang đăng ký..." : "Đăng ký"}
      </button>

      <div className="auth-switch">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </div>
    </form>
  );
}
