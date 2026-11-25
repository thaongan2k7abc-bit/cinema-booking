import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/">Rạp phim </Link>
      <Link to="/my-tickets">Vé của tôi</Link>
      <Link to="/admin">Quản trị</Link>
      <span style={{ marginLeft: "auto" }} />
      <Link to="/login">Đăng nhập</Link>
      <Link to="/register">Đăng ký</Link>
    </nav>
  );
}
