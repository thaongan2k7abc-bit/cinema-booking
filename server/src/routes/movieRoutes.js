import { Router } from "express";
import mongoose from "mongoose";
import Movie from "../models/Movie.js";
import Showtime from "../models/Showtime.js";

const router = Router();

router.get("/ping", (req, res) => res.json({ feature: "movies" }));

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function dayRange(dateStr) {
  const start = new Date(`${dateStr}T00:00:00`);
  if (isNaN(start)) return null;
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

// Danh sách thể loại (đặt trước "/:id")
router.get("/genres", async (req, res) => {
  try {
    const genres = await Movie.distinct("genres");
    res.json(genres.sort());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Danh sách phim: ?search=&genre=&date=&status=
router.get("/", async (req, res) => {
  try {
    const { search, genre, date, status } = req.query;
    const filter = {};

    if (search && search.trim()) {
      filter.title = { $regex: escapeRegex(search.trim()), $options: "i" };
    }
    if (genre) filter.genres = genre;
    if (status) filter.status = status; // now_showing | coming_soon

    if (date) {
      const range = dayRange(date);
      if (!range) return res.status(400).json({ message: "Ngày không hợp lệ" });
      const movieIds = await Showtime.distinct("movie", {
        startTime: { $gte: range.start, $lt: range.end },
      });
      filter._id = { $in: movieIds };
    }

    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Chi tiết phim
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Không tìm thấy phim" });
    }
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Không tìm thấy phim" });
    res.json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Suất chiếu của phim: ?date=
router.get("/:id/showtimes", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Không tìm thấy phim" });
    }
    const filter = { movie: req.params.id, startTime: { $gte: new Date() } };

    if (req.query.date) {
      const range = dayRange(req.query.date);
      if (!range) return res.status(400).json({ message: "Ngày không hợp lệ" });
      filter.startTime = {
        $gte: new Date(Math.max(range.start, Date.now())),
        $lt: range.end,
      };
    }

    const showtimes = await Showtime.find(filter).populate("room", "name").sort({ startTime: 1 });
    res.json(showtimes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;