import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../store/hooks";

interface Props {
  children: ReactNode;
  adminOnly?: boolean; // true: chỉ admin được vào
}

export default function RequireAuth({ children, adminOnly = false }: Props) {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    // chưa đăng nhập: chuyển sang trang đăng nhập
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (adminOnly && user.role !== "admin") {
    return <h2>Bạn không có quyền truy cập trang này</h2>;
  }

  return <>{children}</>;
}
