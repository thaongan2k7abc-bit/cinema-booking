import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:5000/api/movies";

interface Movie {
  _id: string;
  title: string;
  posterUrl?: string;
  genres: string[];
  duration: number;
  status?: string;
}

function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function MovieListPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(search);

  useEffect(() => {
    fetch(`${API}/genres`).then((r) => r.json()).then(setGenres).catch(() => {});
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (genre) params.set("genre", genre);
    if (date) params.set("date", date);
    if (status) params.set("status", status);

    const controller = new AbortController();
    setLoading(true);
    setError("");
    fetch(`${API}?${params}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setMovies)
      .catch((e) => {
        if (e?.name !== "AbortError") setError("Không tải được danh sách phim");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [debouncedSearch, genre, date, status]);

  const reset = () => {
    setSearch("");
    setGenre("");
    setDate("");
    setStatus("");
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Danh sách phim</h2>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <input placeholder="Tìm theo tên phim..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Tất cả thể loại</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="now_showing">Đang chiếu</option>
          <option value="coming_soon">Sắp chiếu</option>
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={reset}>Xóa lọc</button>
      </div>

      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && movies.length === 0 && <p>Không có phim phù hợp</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 20 }}>
        {movies.map((m) => (
          <Link key={m._id} to={`/movies/${m._id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
              {m.posterUrl ? (
                <img src={m.posterUrl} alt={m.title} style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }} />
              ) : (
                <div style={{ aspectRatio: "2/3", background: "#e5e7eb" }} />
              )}
              <div style={{ padding: 10 }}>
                <b>{m.title}</b>
                <div style={{ fontSize: 13, color: "#666" }}>
                  {m.genres?.join(", ")} • {m.duration} phút
                </div>
                <div style={{ fontSize: 12, color: m.status === "coming_soon" ? "#d97706" : "#16a34a" }}>
                  {m.status === "coming_soon" ? "Sắp chiếu" : "Đang chiếu"}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}