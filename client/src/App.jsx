import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeCRM from "./pages/EmployeeCRM";
import DispatchPayment from "./pages/DispatchPayment";
import SecurityDashboard from "./pages/SecurityDashboard";
import DocumentVault from "./pages/DocumentVault";
import Website from "./pages/Website";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Website />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/crm" element={
            <ProtectedRoute>
              <EmployeeCRM />
            </ProtectedRoute>
          } />
          <Route path="/dispatch" element={
            <ProtectedRoute adminOnly={true}>
              <DispatchPayment />
            </ProtectedRoute>
          } />
          <Route path="/security" element={
            <ProtectedRoute adminOnly={true}>
              <SecurityDashboard />
            </ProtectedRoute>
          } />
          <Route path="/documents" element={
            <ProtectedRoute>
              <DocumentVault />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
