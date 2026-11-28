import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/authSlice";

export default function Navbar() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(logout());
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/">Rạp phim mini</Link>
      {user && <Link to="/my-tickets">Vé của tôi</Link>}
      {user?.role === "admin" && <Link to="/admin">Quản trị</Link>}
      <span style={{ marginLeft: "auto" }} />
      {user ? (
        <>
          <Link to="/account">Xin chào, {user.name}</Link>
          <button onClick={handleLogout}>Đăng xuất</button>
        </>
      ) : (
        <>
          <Link to="/login">Đăng nhập</Link>
          <Link to="/register">Đăng ký</Link>
        </>
      )}
    </nav>
  );
}
