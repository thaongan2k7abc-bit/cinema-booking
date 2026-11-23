import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    rows: { type: Number, required: true, min: 1, max: 26 }, // số hàng (A, B, C...)
    seatsPerRow: { type: Number, required: true, min: 1 }, // số ghế mỗi hàng
    vipRows: [{ type: String }], // ví dụ: ['D', 'E'] là các hàng VIP
  },
  { timestamps: true },
);

export default mongoose.model("Room", roomSchema);
