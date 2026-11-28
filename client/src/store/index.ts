import { configureStore } from "@reduxjs/toolkit";
import seatReducer from "./seatSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    seats: seatReducer, // chức năng đặt vé: ghế đang chọn
    auth: authReducer, // chức năng tài khoản: người đang đăng nhập
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
