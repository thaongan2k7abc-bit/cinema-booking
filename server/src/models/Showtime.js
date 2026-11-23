import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true }, // = giờ bắt đầu + thời lượng phim (dùng để chặn chống giờ)
    normalPrice: { type: Number, required: true }, // giá ghế thường
    vipPrice: { type: Number, required: true }, // giá ghế VIP
  },
  { timestamps: true },
);

showtimeSchema.index({ room: 1, startTime: 1 });

export default mongoose.model("Showtime", showtimeSchema);
