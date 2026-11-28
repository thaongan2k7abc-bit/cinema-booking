import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API = "http://localhost:5000/api/movies";

function getYoutubeId(url?: string) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

const today = () => new Date().toLocaleDateString("en-CA");

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState<any>(null);
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [date, setDate] = useState(today());
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/${id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setMovie)
      .catch(() => setError("Không tìm thấy phim"));
  }, [id]);

  useEffect(() => {
    fetch(`${API}/${id}/showtimes?date=${date}`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setShowtimes)
      .catch(() => setShowtimes([]));
  }, [id, date]);

  if (error) return <p style={{ padding: 24, color: "red" }}>{error}</p>;
  if (!movie) return <p style={{ padding: 24 }}>Đang tải...</p>;

  const ytId = getYoutubeId(movie.trailerUrl);

  return (
    <div style={{ padding: 24 }}>
      <Link to="/movies">← Quay lại danh sách</Link>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 16 }}>
        {movie.posterUrl && <img src={movie.posterUrl} alt={movie.title} style={{ width: 240, borderRadius: 8 }} />}
        <div style={{ flex: 1, minWidth: 260 }}>
          <h2>{movie.title}</h2>
          <p><b>Thể loại:</b> {movie.genres?.join(", ")}</p>
          <p><b>Thời lượng:</b> {movie.duration} phút</p>
          <p><b>Trạng thái:</b> {movie.status === "coming_soon" ? "Sắp chiếu" : "Đang chiếu"}</p>
          <p>{movie.description}</p>
        </div>
      </div>

      {ytId && (
        <div style={{ marginTop: 24 }}>
          <h3>Trailer</h3>
          <iframe
            width="560"
            height="315"
            style={{ maxWidth: "100%" }}
            src={`https://www.youtube.com/embed/${ytId}`}
            title="Trailer"
            allowFullScreen
          />
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <h3>Suất chiếu</h3>
        <input type="date" value={date} min={today()} onChange={(e) => setDate(e.target.value)} />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          {showtimes.length === 0 && <p>Không có suất chiếu trong ngày này</p>}
          {showtimes.map((s) => (
            <Link
              key={s._id}
              to={`/booking/${s._id}`}
              style={{ border: "1px solid #999", borderRadius: 6, padding: "8px 14px", textDecoration: "none" }}
            >
              <b>{new Date(s.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</b>
              <div style={{ fontSize: 12 }}>
                {s.room?.name} • {s.price?.toLocaleString()}đ
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}