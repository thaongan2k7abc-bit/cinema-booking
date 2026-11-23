import { configureStore } from "@reduxjs/toolkit";
import seatReducer from "./seatSlice";

export const store = configureStore({
  reducer: {
    seats: seatReducer, // chức năng đặt vé: ghế đang chọn
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
