import { Routes, Route, Navigate } from "react-router-dom";
import ClientLogin from "./pages/login";
import AdminDashboard from "./pages/adminDash";
import ClientDashboard from "./pages/userDash";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ClientLogin />} />
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
      <Route path="/dashboard/client" element={<ClientDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
