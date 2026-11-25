import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Movie from "./models/Movie.js";
import Room from "./models/Room.js";
import Showtime from "./models/Showtime.js";
import Booking from "./models/Booking.js";

await mongoose.connect(process.env.MONGO_URI);

await Promise.all([
  User.deleteMany(),
  Movie.deleteMany(),
  Room.deleteMany(),
  Showtime.deleteMany(),
  Booking.deleteMany(),
]);

// Người dùng (mật khẩu đều là 123456)
const hash = await bcrypt.hash("123456", 10);
await User.create([
  { name: "Admin", email: "admin@cinema.com", password: hash, role: "admin" },
  {
    name: "Thành viên A",
    email: "a@cinema.com",
    password: hash,
    role: "member",
  },
  {
    name: "Thành viên B",
    email: "b@cinema.com",
    password: hash,
    role: "member",
  },
]);

// Phòng chiếu: sơ đồ ghế sẽ được sinh từ rows và seatsPerRow
const rooms = await Room.create([
  { name: "Phòng 1", rows: 8, seatsPerRow: 10, vipRows: ["E", "F"] },
  { name: "Phòng 2", rows: 6, seatsPerRow: 8, vipRows: ["D"] },
]);

// Phim
const movies = await Movie.create([
  {
    title: "Phim mẫu 1",
    description: "Mô tả phim mẫu 1",
    genres: ["Hành động"],
    duration: 120,
    status: "now_showing",
    trailerUrl: "",
  },
  {
    title: "Phim mẫu 2",
    description: "Mô tả phim mẫu 2",
    genres: ["Hài", "Tình cảm"],
    duration: 100,
    status: "now_showing",
    trailerUrl: "",
  },
  {
    title: "Phim mẫu 3",
    description: "Mô tả phim mẫu 3",
    genres: ["Kinh dị"],
    duration: 95,
    status: "coming_soon",
    trailerUrl: "",
  },
]);

// Suất chiếu
const showtimes = [];
function addShowtime(movie, room, start) {
  showtimes.push({
    movie: movie._id,
    room: room._id,
    startTime: start,
    endTime: new Date(start.getTime() + movie.duration * 60000),
    normalPrice: 80000,
    vipPrice: 120000,
  });
}

// 4 suất mỗi ngày trong 3 ngày tới
const slots = [
  { movie: 0, room: 0, hour: 10 },
  { movie: 1, room: 1, hour: 14 },
  { movie: 0, room: 1, hour: 18 },
  { movie: 1, room: 0, hour: 19 },
];
for (let day = 1; day <= 3; day++) {
  for (const slot of slots) {
    const start = new Date();
    start.setDate(start.getDate() + day);
    start.setHours(slot.hour, 0, 0, 0);
    addShowtime(movies[slot.movie], rooms[slot.room], start);
  }
}

// Một suất bắt đầu sau 1 giờ nữa, để thử không hủy vé trước giờ chiếu 2 tiếng
addShowtime(movies[0], rooms[0], new Date(Date.now() + 60 * 60 * 1000));

await Showtime.create(showtimes);

console.log(
  "Seed xong. Tài khoản: admin@cinema.com, a@cinema.com, b@cinema.com (mật khẩu 123456)",
);
await mongoose.disconnect();
