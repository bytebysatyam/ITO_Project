import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const COLORS = {
  navy: "#0D1B3E",
  navyLight: "#1A2D5A",
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  white: "#FFFFFF",
  cream: "#FAF8F3",
  gray: "#6B7280",
  grayLight: "#F3F4F6",
  border: "#E5E7EB",
  green: "#16A34A",
  red: "#DC2626",
  orange: "#EA580C",
  blue: "#2563EB",
  purple: "#7C3AED",
};

const severityColor = (severity) => {
  if (severity === "Critical") return COLORS.red;
  if (severity === "High") return COLORS.orange;
  if (severity === "Medium") return COLORS.blue;
  return COLORS.gray;
};

const actionColor = (action) => {
  if (["Failed Login", "Unauthorized Access", "Export Attempt"].includes(action)) return COLORS.red;
  if (["Mobile Reveal", "Email Reveal", "Document Download"].includes(action)) return COLORS.orange;
  if (["Login", "Lead Create"].includes(action)) return COLORS.green;
  return COLORS.blue;
};

const StatCard = ({ label, value, color, icon }) => (
  <div style={{
    background: COLORS.white,
    border: `1.5px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: "20px 24px",
    borderLeft: `4px solid ${color}`,
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ color: COLORS.gray, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
        <div style={{ color: COLORS.navy, fontSize: 28, fontWeight: 800 }}>{value ?? 0}</div>
      </div>
      <div style={{ fontSize: 26 }}>{icon}</div>
    </div>
  </div>
);

export default function SecurityDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const FILTERS = ["All", "Login", "Failed Login", "Mobile Reveal", "Email Reveal", "Unauthorized Access", "Document View", "Export Attempt"];

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [logsRes, statsRes] = await Promise.all([
        API.get("/logs"),
        API.get("/logs/stats"),
      ]);
      setLogs(logsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = filter === "All" ? logs : logs.filter((l) => l.action === filter);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: COLORS.navy, fontSize: 18, fontWeight: 600 }}>Loading Security Dashboard...</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Navbar */}
      <div style={{ background: COLORS.navy, padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: COLORS.navy }}>
            ITO
          </div>
          <div>
            <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 14 }}>Security Dashboard</div>
            <div style={{ color: COLORS.gold, fontSize: 11 }}>India Trade Overseas — Admin Only</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => navigate("/admin")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: COLORS.white, padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
            ← Admin
          </button>
          <button onClick={() => { logout(); navigate("/login"); }} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: COLORS.white, padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: 32, maxWidth: 1400, margin: "0 auto" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 28 }}>
          <StatCard label="Total Events" value={stats.total} color={COLORS.navy} icon="📋" />
          <StatCard label="Today's Events" value={stats.today} color={COLORS.blue} icon="📅" />
          <StatCard label="Failed Logins" value={stats.failedLogins} color={COLORS.red} icon="🔐" />
          <StatCard label="Data Reveals" value={stats.reveals} color={COLORS.orange} icon="👁️" />
          <StatCard label="Unauthorized" value={stats.unauthorized} color={COLORS.red} icon="🚫" />
          <StatCard label="Critical Events" value={stats.critical} color={COLORS.red} icon="⚠️" />
          <StatCard label="High Severity" value={stats.high} color={COLORS.orange} icon="🔔" />
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "7px 16px",
                background: filter === f ? COLORS.navy : COLORS.white,
                color: filter === f ? COLORS.white : COLORS.gray,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 20,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {f}
            </button>
          ))}
          <button
            onClick={fetchAll}
            style={{ padding: "7px 16px", background: COLORS.gold, color: COLORS.navy, border: "none", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 700, marginLeft: "auto" }}
          >
            Refresh
          </button>
        </div>

        {/* Logs Table */}
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 16 }}>
              Activity Logs ({filteredLogs.length})
            </div>
            {filter !== "All" && (
              <span style={{ background: COLORS.navy + "15", color: COLORS.navy, padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600 }}>
                Filtered: {filter}
              </span>
            )}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: COLORS.grayLight }}>
                  {["Time", "User", "Action", "Description", "IP Address", "Severity"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: COLORS.gray, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, i) => (
                  <tr key={log._id} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? COLORS.white : "#FAFAFA" }}>
                    <td style={{ padding: "12px 16px", fontSize: 12, color: COLORS.gray, whiteSpace: "nowrap" }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13 }}>
                      <div style={{ fontWeight: 600, color: COLORS.navy }}>{log.user?.name || "Unknown"}</div>
                      <div style={{ fontSize: 11, color: COLORS.gray }}>{log.userEmail}</div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: actionColor(log.action) + "20", color: actionColor(log.action), padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 13, color: COLORS.gray, maxWidth: 300 }}>
                      {log.description}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: 12, fontFamily: "monospace", color: COLORS.gray }}>
                      {log.ipAddress || "-"}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: severityColor(log.severity) + "20", color: severityColor(log.severity), padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                        {log.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLogs.length === 0 && (
              <div style={{ textAlign: "center", padding: 48, color: COLORS.gray }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
                <div style={{ fontWeight: 600 }}>No activity logs yet</div>
                <div style={{ fontSize: 13, marginTop: 4 }}>Logs will appear as users perform actions</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
