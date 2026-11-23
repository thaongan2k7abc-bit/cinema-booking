export interface User {
  _id: string;
  name: string;
  email: string;
  role: "member" | "admin";
}

export interface Movie {
  _id: string;
  title: string;
  description: string;
  genres: string[];
  duration: number; // phút
  posterUrl: string;
  trailerUrl: string;
  releaseDate?: string;
  status: "now_showing" | "coming_soon";
}

export interface Room {
  _id: string;
  name: string;
  rows: number;
  seatsPerRow: number;
  vipRows: string[];
}

export interface Showtime {
  _id: string;
  movie: string | Movie;
  room: string | Room;
  startTime: string;
  endTime: string;
  normalPrice: number;
  vipPrice: number;
}

export interface Booking {
  _id: string;
  user: string;
  showtime: string | Showtime;
  seats: string[];
  totalPrice: number;
  status: "confirmed" | "cancelled";
  cancelledAt?: string;
}
