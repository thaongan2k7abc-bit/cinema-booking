import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RequireAuth from "./components/RequireAuth";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AccountPage from "./pages/auth/AccountPage";
import MovieListPage from "./pages/movies/MovieListPage";
import MovieDetailPage from "./pages/movies/MovieDetailPage";
import SeatSelectionPage from "./pages/booking/SeatSelectionPage";
import MyTicketsPage from "./pages/tickets/MyTicketsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<MovieListPage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <AccountPage />
              </RequireAuth>
            }
          />
          <Route
            path="/showtimes/:id/seats"
            element={
              <RequireAuth>
                <SeatSelectionPage />
              </RequireAuth>
            }
          />
          <Route
            path="/my-tickets"
            element={
              <RequireAuth>
                <MyTicketsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/*"
            element={
              <RequireAuth adminOnly>
                <AdminDashboardPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<h2>404 - Không tìm thấy trang</h2>} />
        </Routes>
      </main>
    </>
  );
}
