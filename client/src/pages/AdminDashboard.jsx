import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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
        <div style={{ color: COLORS.gray, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>
          {label}
        </div>
        <div style={{ color: COLORS.navy, fontSize: 32, fontWeight: 800 }}>{value ?? 0}</div>
      </div>
      <div style={{ fontSize: 28 }}>{icon}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [leads, setLeads] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [assignUserId, setAssignUserId] = useState("");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [statsRes, leadsRes, quotationsRes, usersRes] = await Promise.all([
        API.get("/leads/stats"),
        API.get("/leads"),
        API.get("/quotations"),
        API.get("/auth/users"),
      ]);
      setStats(statsRes.data);
      setLeads(leadsRes.data);
      setQuotations(quotationsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const handleApprove = async (id) => {
    const price = prompt("Enter approved price:");
    if (!price) return;
    try {
      await API.put(`/quotations/${id}/approve`, { approvedPrice: Number(price) });
      fetchAll();
      alert("Quotation approved!");
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;
    try {
      await API.put(`/quotations/${id}/reject`, { reason });
      fetchAll();
      alert("Quotation rejected!");
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  const handleAssign = async (leadId) => {
    if (!assignUserId) return alert("Select an employee first");
    try {
      await API.put(`/leads/${leadId}/assign`, { userId: assignUserId });
      fetchAll();
      setSelectedLead(null);
      alert("Lead assigned!");
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  const handleSuspend = async (userId) => {
    try {
      await API.put(`/auth/users/${userId}/suspend`);
      fetchAll();
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  const pieData = [
    { name: "Hot", value: stats.hot || 0 },
    { name: "Warm", value: stats.warm || 0 },
    { name: "Cold", value: stats.cold || 0 },
    { name: "Incomplete", value: stats.incomplete || 0 },
  ];
  const pieColors = ["#DC2626", "#EA580C", "#2563EB", "#6B7280"];

  const barData = [
    { name: "AI Leads", value: stats.aiLeads || 0 },
    { name: "Website", value: stats.websiteLeads || 0 },
  ];

  const maskMobile = (mobile) => mobile ? mobile.slice(0, 2) + "XXXXXX" + mobile.slice(-2) : "-";
  const maskEmail = (email) => {
    if (!email) return "-";
    const [user, domain] = email.split("@");
    return user.slice(0, 2) + "****@" + domain;
  };

  const leadTypeColor = (type) => {
    if (type === "Hot") return COLORS.red;
    if (type === "Warm") return COLORS.orange;
    if (type === "Cold") return COLORS.blue;
    return COLORS.gray;
  };

  const tabStyle = (tab) => ({
    padding: "10px 20px",
    background: activeTab === tab ? COLORS.navy : "transparent",
    color: activeTab === tab ? COLORS.white : COLORS.gray,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
  });

  if (loading) return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: COLORS.navy, fontSize: 18, fontWeight: 600 }}>Loading Admin Dashboard...</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Top Navbar */}
      <div style={{ background: COLORS.navy, padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 13, color: COLORS.navy }}>
            ITO
          </div>
          <div>
            <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 14 }}>Admin Command Center</div>
            <div style={{ color: COLORS.gold, fontSize: 11 }}>India Trade Overseas</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>👤 {user?.name}</span>
          <button onClick={() => navigate("/dispatch")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: COLORS.white, padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
            🚛 Dispatch & Payment
          </button>
          <button onClick={() => navigate("/security")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: COLORS.white, padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
            🔐 Security
          </button>
          <button onClick={() => navigate("/documents")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: COLORS.white, padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
  📁 Documents
</button>
          <button onClick={() => navigate("/")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: COLORS.white, padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
            🌐 Website
          </button>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: COLORS.white, padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: 32, maxWidth: 1400, margin: "0 auto" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, background: COLORS.white, padding: 6, borderRadius: 10, border: `1px solid ${COLORS.border}`, width: "fit-content" }}>
          {["overview", "leads", "quotations", "users"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(tab)}>
              {tab === "overview" ? "📊 Overview" : tab === "leads" ? "📋 Leads" : tab === "quotations" ? "📄 Quotations" : "👥 Users"}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <>
            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
              <StatCard label="Total Leads" value={stats.total} color={COLORS.navy} icon="📋" />
              <StatCard label="Today's Leads" value={stats.today} color={COLORS.gold} icon="📅" />
              <StatCard label="Hot Leads" value={stats.hot} color={COLORS.red} icon="🔥" />
              <StatCard label="Warm Leads" value={stats.warm} color={COLORS.orange} icon="🌤️" />
              <StatCard label="Cold Leads" value={stats.cold} color={COLORS.blue} icon="❄️" />
              <StatCard label="Pending Follow-up" value={stats.pendingFollowUp} color="#7C3AED" icon="⏰" />
              <StatCard label="AI Leads" value={stats.aiLeads} color={COLORS.green} icon="🤖" />
              <StatCard label="Website Leads" value={stats.websiteLeads} color={COLORS.navy} icon="🌐" />
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24 }}>
                <div style={{ fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>Lead Classification</div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24 }}>
                <div style={{ fontWeight: 700, color: COLORS.navy, marginBottom: 16 }}>Lead Sources</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={COLORS.gold} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* LEADS TAB */}
        {activeTab === "leads" && (
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 16 }}>All Leads ({leads.length})</div>
              <button onClick={fetchAll} style={{ background: COLORS.navy, color: COLORS.white, border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                Refresh
              </button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: COLORS.grayLight }}>
                    {["Product", "Company", "Contact", "Mobile", "Quantity", "Type", "Stage", "Source", "Action"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: COLORS.gray, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <tr key={lead._id} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? COLORS.white : "#FAFAFA" }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: COLORS.navy }}>{lead.product}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: COLORS.charcoal }}>{lead.companyName || "-"}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{lead.contactPerson}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "monospace" }}>{maskMobile(lead.mobile)}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{lead.quantity}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: leadTypeColor(lead.leadType) + "20", color: leadTypeColor(lead.leadType), padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                          {lead.leadType}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: COLORS.gray }}>{lead.stage}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12 }}>{lead.source}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <button
                          onClick={() => setSelectedLead(lead)}
                          style={{ background: COLORS.navy, color: COLORS.white, border: "none", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {leads.length === 0 && (
                <div style={{ textAlign: "center", padding: 48, color: COLORS.gray }}>No leads yet. Submit from website to see here.</div>
              )}
            </div>
          </div>
        )}

        {/* QUOTATIONS TAB */}
        {activeTab === "quotations" && (
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 16 }}>Quotation Approvals ({quotations.length})</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: COLORS.grayLight }}>
                    {["Product", "Quantity", "Destination", "Proposed Price", "Status", "Requested By", "Action"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: COLORS.gray, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {quotations.map((q, i) => (
                    <tr key={q._id} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? COLORS.white : "#FAFAFA" }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: COLORS.navy }}>{q.productName}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{q.quantity}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{q.destination}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700 }}>₹{q.proposedPrice}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          background: q.status === "Approved" ? "#DCFCE7" : q.status === "Rejected" ? "#FEE2E2" : "#FEF3C7",
                          color: q.status === "Approved" ? COLORS.green : q.status === "Rejected" ? COLORS.red : "#D97706",
                          padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700,
                        }}>
                          {q.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{q.requestedBy?.name}</td>
                      <td style={{ padding: "12px 16px", display: "flex", gap: 8 }}>
                        {q.status === "Pending Approval" && (
                          <>
                            <button onClick={() => handleApprove(q._id)} style={{ background: COLORS.green, color: COLORS.white, border: "none", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>
                              Approve
                            </button>
                            <button onClick={() => handleReject(q._id)} style={{ background: COLORS.red, color: COLORS.white, border: "none", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {quotations.length === 0 && (
                <div style={{ textAlign: "center", padding: 48, color: COLORS.gray }}>No quotations yet.</div>
              )}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}` }}>
              <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 16 }}>User Management ({users.length})</div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: COLORS.grayLight }}>
                    {["Name", "Email", "Role", "Department", "Status", "Last Login", "Action"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: COLORS.gray, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u._id} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? COLORS.white : "#FAFAFA" }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: COLORS.navy }}>{u.name}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{u.email}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: u.role === "admin" ? COLORS.gold + "30" : "#DBEAFE", color: u.role === "admin" ? "#92400E" : COLORS.blue, padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{u.department}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: u.isActive ? "#DCFCE7" : "#FEE2E2", color: u.isActive ? COLORS.green : COLORS.red, padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                          {u.isActive ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: COLORS.gray }}>
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        {u.role !== "admin" && (
                          <button onClick={() => handleSuspend(u._id)} style={{ background: u.isActive ? COLORS.red : COLORS.green, color: COLORS.white, border: "none", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>
                            {u.isActive ? "Suspend" : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Assign Lead Modal */}
      {selectedLead && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: COLORS.white, borderRadius: 16, padding: 32, width: 400 }}>
            <h3 style={{ color: COLORS.navy, marginBottom: 16 }}>Assign Lead</h3>
            <p style={{ color: COLORS.gray, fontSize: 13, marginBottom: 20 }}>
              Assigning: <strong>{selectedLead.product}</strong> — {selectedLead.contactPerson}
            </p>
            <select
              value={assignUserId}
              onChange={(e) => setAssignUserId(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, marginBottom: 16 }}
            >
              <option value="">Select Employee</option>
              {users.filter((u) => u.role === "employee").map((u) => (
                <option key={u._id} value={u._id}>{u.name} — {u.department}</option>
              ))}
            </select>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => handleAssign(selectedLead._id)} style={{ flex: 1, background: COLORS.navy, color: COLORS.white, border: "none", padding: 12, borderRadius: 8, cursor: "pointer", fontWeight: 700 }}>
                Assign
              </button>
              <button onClick={() => setSelectedLead(null)} style={{ flex: 1, background: COLORS.grayLight, color: COLORS.navy, border: "none", padding: 12, borderRadius: 8, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
