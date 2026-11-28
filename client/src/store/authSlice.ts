import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
}

// Khi mở lại web, lấy thông tin đăng nhập đã lưu trong trình duyệt
function loadInitialState(): AuthState {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) return { token, user: JSON.parse(user) as User };
  } catch {
    // bỏ qua nếu trình duyệt không cho đọc
  }
  return { token: null, user: null };
}

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialState(),
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
export const { loginSuccess, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;
