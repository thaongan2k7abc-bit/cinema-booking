import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "http://localhost:5000/api/movies"; // sửa theo port server của bạn

interface Movie {
  _id: string;
  title: string;
  poster?: string;
  genre: string[];
  duration: number;
}

// Debounce: chờ người dùng ngừng gõ 300ms mới gọi API
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(search);

  // Lấy danh sách thể loại 1 lần
  useEffect(() => {
    fetch(`${API}/genres`).then((r) => r.json()).then(setGenres).catch(() => {});
  }, []);

  // Lấy phim mỗi khi bộ lọc đổi
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (genre) params.set("genre", genre);
    if (date) params.set("date", date);

    const controller = new AbortController(); // tránh kết quả cũ ghi đè kết quả mới
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
  }, [debouncedSearch, genre, date]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Danh sách phim</h2>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
        <input
          placeholder="Tìm theo tên phim..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={genre} onChange={(e) => setGenre(e.target.value)}>
          <option value="">Tất cả thể loại</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={() => { setSearch(""); setGenre(""); setDate(""); }}>Xóa lọc</button>
      </div>

      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && movies.length === 0 && <p>Không có phim phù hợp</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 20 }}>
        {movies.map((m) => (
          <Link key={m._id} to={`/movies/${m._id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
              {m.poster ? (
                <img src={m.poster} alt={m.title} style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover" }} />
              ) : (
                <div style={{ aspectRatio: "2/3", background: "#e5e7eb" }} />
              )}
              <div style={{ padding: 10 }}>
                <b>{m.title}</b>
                <div style={{ fontSize: 13, color: "#666" }}>
                  {m.genre?.join(", ")} • {m.duration} phút
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}