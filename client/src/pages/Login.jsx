import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data);
      if (data.role === "admin") navigate("/admin");
      else navigate("/crm");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0D1B3E 0%, #1A2D5A 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 16,
        padding: 40,
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52,
            background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
            borderRadius: 10,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900, fontSize: 18, color: "#0D1B3E",
            marginBottom: 12,
          }}>ITO</div>
          <h2 style={{ color: "#0D1B3E", fontWeight: 800, fontSize: 22 }}>
            India Trade Overseas
          </h2>
          <p style={{ color: "#6B7280", fontSize: 13, marginTop: 4 }}>
            Staff Login Portal
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#FEE2E2", color: "#DC2626",
            padding: "10px 14px", borderRadius: 8,
            fontSize: 13, marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{
              width: "100%", padding: "11px 14px",
              border: "1.5px solid #E5E7EB", borderRadius: 8,
              fontSize: 14, outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%", padding: "11px 14px",
              border: "1.5px solid #E5E7EB", borderRadius: 8,
              fontSize: 14, outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
            color: "#0D1B3E", border: "none",
            padding: "13px", borderRadius: 8,
            fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login →"}
        </button>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <a href="/" style={{ color: "#6B7280", fontSize: 13 }}>
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}