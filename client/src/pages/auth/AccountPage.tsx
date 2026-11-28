import { useState } from "react";
import type { FormEvent } from "react";
import { isAxiosError } from "axios";
import api from "../../api/axios";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updateUser } from "../../store/authSlice";
import type { User } from "../../types";
import "./auth.css";

function getErrorMessage(err: unknown, fallback: string) {
  return isAxiosError(err)
    ? (err.response?.data?.message ?? fallback)
    : "Đã có lỗi xảy ra";
}

export default function AccountPage() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [name, setName] = useState(user?.name ?? "");
  const [nameMsg, setNameMsg] = useState("");
  const [nameError, setNameError] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  async function handleSaveName(e: FormEvent) {
    e.preventDefault();
    setNameMsg("");
    setNameError("");
    try {
      const res = await api.put<{ user: User }>("/auth/me", { name });
      dispatch(updateUser(res.data.user));
      setNameMsg("Đã cập nhật họ tên");
    } catch (err) {
      setNameError(getErrorMessage(err, "Không thể cập nhật"));
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setPwMsg("");
    setPwError("");

    if (newPassword !== confirm) {
      setPwError("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      await api.put("/auth/me/password", { oldPassword, newPassword });
      setPwMsg("Đổi mật khẩu thành công");
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err) {
      setPwError(getErrorMessage(err, "Không thể đổi mật khẩu"));
    }
  }

  if (!user) return null;

  return (
    <>
      <form className="auth-card" onSubmit={handleSaveName}>
        <h2>Tài khoản của tôi</h2>

        <label>
          Email
          <input value={user.email} disabled />
        </label>

        <label>
          Vai trò
          <input
            value={user.role === "admin" ? "Quản trị viên" : "Thành viên"}
            disabled
          />
        </label>

        <label>
          Họ tên
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        {nameError && <div className="auth-error">{nameError}</div>}
        {nameMsg && <div className="auth-success">{nameMsg}</div>}

        <button type="submit">Lưu họ tên</button>
      </form>

      <form className="auth-card" onSubmit={handleChangePassword}>
        <h2>Đổi mật khẩu</h2>

        <label>
          Mật khẩu hiện tại
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </label>

        <label>
          Mật khẩu mới (ít nhất 6 ký tự)
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>

        <label>
          Nhập lại mật khẩu mới
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </label>

        {pwError && <div className="auth-error">{pwError}</div>}
        {pwMsg && <div className="auth-success">{pwMsg}</div>}

        <button type="submit">Đổi mật khẩu</button>
      </form>
    </>
  );
}
