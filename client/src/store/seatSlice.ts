import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Tối đa 8 ghế mỗi lần đặt
const MAX_SEATS = 8;

interface SeatState {
  selected: string[]; // ví dụ: ['A1', 'A2']
}

const initialState: SeatState = { selected: [] };

const seatSlice = createSlice({
  name: "seats",
  initialState,
  reducers: {
    toggleSeat(state, action: PayloadAction<string>) {
      const seat = action.payload;
      if (state.selected.includes(seat)) {
        state.selected = state.selected.filter((s) => s !== seat);
      } else if (state.selected.length < MAX_SEATS) {
        state.selected.push(seat);
      }
    },
    clearSeats(state) {
      state.selected = [];
    },
  },
});

export const { toggleSeat, clearSeats } = seatSlice.actions;
export default seatSlice.reducer;
