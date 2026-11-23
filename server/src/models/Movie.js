import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    genres: [{ type: String }], // ví dụ: ['Hành động', 'Hài']
    duration: { type: Number, required: true }, // phút
    posterUrl: { type: String, default: "" },
    trailerUrl: { type: String, default: "" }, // link YouTube
    releaseDate: { type: Date },
    status: {
      type: String,
      enum: ["now_showing", "coming_soon"],
      default: "coming_soon",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Movie", movieSchema);
