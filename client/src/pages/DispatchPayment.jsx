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

const DISPATCH_STATUSES = ["Pending", "Truck Assigned", "Loading", "In Transit", "Delivered", "Issue Raised", "Closed"];
const PAYMENT_STATUSES = ["Not Started", "Advance Received", "Partial", "Due", "Overdue", "Paid", "Disputed"];
const PAYMENT_MODES = ["NEFT", "RTGS", "Cheque", "Cash", "LC", "DD", "UPI"];

const statusColor = (status) => {
  const map = {
    "Pending": COLORS.orange,
    "Truck Assigned": COLORS.blue,
    "Loading": COLORS.purple,
    "In Transit": COLORS.blue,
    "Delivered": COLORS.green,
    "Issue Raised": COLORS.red,
    "Closed": COLORS.gray,
    "Not Started": COLORS.gray,
    "Advance Received": COLORS.blue,
    "Partial": COLORS.orange,
    "Due": COLORS.orange,
    "Overdue": COLORS.red,
    "Paid": COLORS.green,
    "Disputed": COLORS.red,
  };
  return map[status] || COLORS.gray;
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

export default function DispatchPayment() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dispatch");
  const [dispatches, setDispatches] = useState([]);
  const [payments, setPayments] = useState([]);
  const [leads, setLeads] = useState([]);
  const [dispatchStats, setDispatchStats] = useState({});
  const [paymentStats, setPaymentStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showDispatchForm, setShowDispatchForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedDispatch, setSelectedDispatch] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [dispatchForm, setDispatchForm] = useState({
    lead: "", product: "", quantity: "", destination: "",
    loadingPoint: "", route: "", sizeGrade: "",
    truckNumber: "", driverName: "", driverContact: "",
    transporterName: "", freightRate: "",
    loadingDate: "", dispatchDate: "", expectedDeliveryDate: "",
    dispatchStatus: "Pending", deliveryTerms: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    lead: "", dispatch: "",
    totalOrderValue: "", advanceAmount: "",
    paymentStatus: "Not Started", paymentMode: "",
    dueDate: "", followUpRemark: "",
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [dispRes, payRes, leadRes, dStatsRes, pStatsRes] = await Promise.all([
        API.get("/dispatch"),
        API.get("/payments"),
        API.get("/leads"),
        API.get("/dispatch/stats/summary"),
        API.get("/payments/stats/summary"),
      ]);
      setDispatches(dispRes.data);
      setPayments(payRes.data);
      setLeads(leadRes.data);
      setDispatchStats(dStatsRes.data);
      setPaymentStats(pStatsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDispatch = async () => {
    if (!dispatchForm.lead || !dispatchForm.product || !dispatchForm.quantity || !dispatchForm.destination) {
      return alert("Please fill Lead, Product, Quantity and Destination");
    }
    try {
      await API.post("/dispatch", dispatchForm);
      alert("Dispatch created successfully!");
      setShowDispatchForm(false);
      setDispatchForm({ lead: "", product: "", quantity: "", destination: "", loadingPoint: "", route: "", sizeGrade: "", truckNumber: "", driverName: "", driverContact: "", transporterName: "", freightRate: "", loadingDate: "", dispatchDate: "", expectedDeliveryDate: "", dispatchStatus: "Pending", deliveryTerms: "" });
      fetchAll();
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  const handleUpdateDispatch = async (id, updates) => {
    try {
      await API.put(`/dispatch/${id}`, updates);
      fetchAll();
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  const handleCreatePayment = async () => {
    if (!paymentForm.lead || !paymentForm.totalOrderValue) {
      return alert("Please fill Lead and Total Order Value");
    }
    try {
      await API.post("/payments", paymentForm);
      alert("Payment entry created!");
      setShowPaymentForm(false);
      setPaymentForm({ lead: "", dispatch: "", totalOrderValue: "", advanceAmount: "", paymentStatus: "Not Started", paymentMode: "", dueDate: "", followUpRemark: "" });
      fetchAll();
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  const handleUpdatePayment = async (id, updates) => {
    try {
      await API.put(`/payments/${id}`, updates);
      fetchAll();
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  const tabStyle = (tab) => ({
    padding: "10px 20px",
    background: activeTab === tab ? COLORS.navy : "transparent",
    color: activeTab === tab ? COLORS.white : COLORS.gray,
    border: "none", borderRadius: 8,
    cursor: "pointer", fontWeight: 600, fontSize: 13,
  });

  const inputStyle = {
    width: "100%", padding: "9px 12px",
    border: `1.5px solid ${COLORS.border}`,
    borderRadius: 8, fontSize: 13,
    boxSizing: "border-box", outline: "none",
  };

  const labelStyle = {
    fontSize: 11, color: COLORS.gray,
    display: "block", marginBottom: 4,
    textTransform: "uppercase", letterSpacing: "0.06em",
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: COLORS.navy, fontSize: 18, fontWeight: 600 }}>Loading...</div>
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
            <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 14 }}>Dispatch & Payment Tracking</div>
            <div style={{ color: COLORS.gold, fontSize: 11 }}>India Trade Overseas</div>
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
          <StatCard label="Total Dispatches" value={dispatchStats.total} color={COLORS.navy} icon="🚛" />
          <StatCard label="Pending" value={dispatchStats.pending} color={COLORS.orange} icon="⏳" />
          <StatCard label="In Transit" value={dispatchStats.inTransit} color={COLORS.blue} icon="🛣️" />
          <StatCard label="Delivered" value={dispatchStats.delivered} color={COLORS.green} icon="✅" />
          <StatCard label="Overdue Payments" value={paymentStats.overdue} color={COLORS.red} icon="⚠️" />
          <StatCard label="Paid Orders" value={paymentStats.paid} color={COLORS.green} icon="💰" />
          <StatCard label="Outstanding (₹)" value={paymentStats.totalOutstanding?.toLocaleString()} color={COLORS.purple} icon="📊" />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, background: COLORS.white, padding: 6, borderRadius: 10, border: `1px solid ${COLORS.border}`, width: "fit-content" }}>
          <button onClick={() => setActiveTab("dispatch")} style={tabStyle("dispatch")}>🚛 Dispatch Tracking</button>
          <button onClick={() => setActiveTab("payment")} style={tabStyle("payment")}>💰 Payment Tracking</button>
        </div>

        {/* DISPATCH TAB */}
        {activeTab === "dispatch" && (
          <div>
            {/* Add Dispatch Button */}
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowDispatchForm(!showDispatchForm)}
                style={{ background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, color: COLORS.navy, border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                + New Dispatch Entry
              </button>
            </div>

            {/* Dispatch Form */}
            {showDispatchForm && (
              <div style={{ background: COLORS.white, border: `1.5px solid ${COLORS.border}`, borderRadius: 12, padding: 28, marginBottom: 24 }}>
                <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 16, marginBottom: 20 }}>New Dispatch Entry</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Select Lead *</label>
                    <select value={dispatchForm.lead} onChange={(e) => setDispatchForm({ ...dispatchForm, lead: e.target.value })} style={inputStyle}>
                      <option value="">Select Lead</option>
                      {leads.map((l) => <option key={l._id} value={l._id}>{l.product} — {l.contactPerson} ({l.companyName || "N/A"})</option>)}
                    </select>
                  </div>
                  {[
                    { key: "product", label: "Product *" },
                    { key: "quantity", label: "Quantity *" },
                    { key: "destination", label: "Destination *" },
                    { key: "loadingPoint", label: "Loading Point" },
                    { key: "sizeGrade", label: "Size / Grade" },
                    { key: "route", label: "Route" },
                    { key: "truckNumber", label: "Truck Number" },
                    { key: "driverName", label: "Driver Name" },
                    { key: "driverContact", label: "Driver Contact" },
                    { key: "transporterName", label: "Transporter Name" },
                    { key: "freightRate", label: "Freight Rate (₹)" },
                    { key: "deliveryTerms", label: "Delivery Terms" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label style={labelStyle}>{f.label}</label>
                      <input type="text" value={dispatchForm[f.key]} onChange={(e) => setDispatchForm({ ...dispatchForm, [f.key]: e.target.value })} style={inputStyle} />
                    </div>
                  ))}
                  {[
                    { key: "loadingDate", label: "Loading Date" },
                    { key: "dispatchDate", label: "Dispatch Date" },
                    { key: "expectedDeliveryDate", label: "Expected Delivery" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label style={labelStyle}>{f.label}</label>
                      <input type="date" value={dispatchForm[f.key]} onChange={(e) => setDispatchForm({ ...dispatchForm, [f.key]: e.target.value })} style={inputStyle} />
                    </div>
                  ))}
                  <div>
                    <label style={labelStyle}>Dispatch Status</label>
                    <select value={dispatchForm.dispatchStatus} onChange={(e) => setDispatchForm({ ...dispatchForm, dispatchStatus: e.target.value })} style={inputStyle}>
                      {DISPATCH_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                  <button onClick={handleCreateDispatch} style={{ background: COLORS.navy, color: COLORS.white, border: "none", padding: "11px 28px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
                    Create Dispatch
                  </button>
                  <button onClick={() => setShowDispatchForm(false)} style={{ background: COLORS.grayLight, color: COLORS.navy, border: "none", padding: "11px 28px", borderRadius: 8, cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Dispatch Table */}
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}` }}>
                <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 16 }}>All Dispatches ({dispatches.length})</div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: COLORS.grayLight }}>
                      {["Product", "Company", "Quantity", "Destination", "Truck No.", "Driver", "Dispatch Date", "Status", "Update Status"].map((h) => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: COLORS.gray, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dispatches.map((d, i) => (
                      <tr key={d._id} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? COLORS.white : "#FAFAFA" }}>
                        <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: COLORS.navy }}>{d.product}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13 }}>{d.lead?.companyName || "-"}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13 }}>{d.quantity}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13 }}>{d.destination}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, fontFamily: "monospace" }}>{d.truckNumber || "-"}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13 }}>{d.driverName || "-"}</td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: COLORS.gray }}>
                          {d.dispatchDate ? new Date(d.dispatchDate).toLocaleDateString() : "-"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: statusColor(d.dispatchStatus) + "20", color: statusColor(d.dispatchStatus), padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                            {d.dispatchStatus}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <select
                            value={d.dispatchStatus}
                            onChange={(e) => handleUpdateDispatch(d._id, { dispatchStatus: e.target.value })}
                            style={{ padding: "5px 8px", border: `1px solid ${COLORS.border}`, borderRadius: 6, fontSize: 12, cursor: "pointer" }}
                          >
                            {DISPATCH_STATUSES.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {dispatches.length === 0 && (
                  <div style={{ textAlign: "center", padding: 48, color: COLORS.gray }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🚛</div>
                    <div style={{ fontWeight: 600 }}>No dispatches yet</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>Click "New Dispatch Entry" to add one</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PAYMENT TAB */}
        {activeTab === "payment" && (
          <div>
            {/* Add Payment Button */}
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setShowPaymentForm(!showPaymentForm)}
                style={{ background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, color: COLORS.navy, border: "none", padding: "10px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                + New Payment Entry
              </button>
            </div>

            {/* Payment Form */}
            {showPaymentForm && (
              <div style={{ background: COLORS.white, border: `1.5px solid ${COLORS.border}`, borderRadius: 12, padding: 28, marginBottom: 24 }}>
                <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 16, marginBottom: 20 }}>New Payment Entry</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Select Lead *</label>
                    <select value={paymentForm.lead} onChange={(e) => setPaymentForm({ ...paymentForm, lead: e.target.value })} style={inputStyle}>
                      <option value="">Select Lead</option>
                      {leads.map((l) => <option key={l._id} value={l._id}>{l.product} — {l.contactPerson} ({l.companyName || "N/A"})</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Link Dispatch (optional)</label>
                    <select value={paymentForm.dispatch} onChange={(e) => setPaymentForm({ ...paymentForm, dispatch: e.target.value })} style={inputStyle}>
                      <option value="">Select Dispatch</option>
                      {dispatches.map((d) => <option key={d._id} value={d._id}>{d.product} — {d.destination} ({d.dispatchStatus})</option>)}
                    </select>
                  </div>
                  {[
                    { key: "totalOrderValue", label: "Total Order Value (₹) *" },
                    { key: "advanceAmount", label: "Advance Amount (₹)" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label style={labelStyle}>{f.label}</label>
                      <input type="number" value={paymentForm[f.key]} onChange={(e) => setPaymentForm({ ...paymentForm, [f.key]: e.target.value })} style={inputStyle} />
                    </div>
                  ))}
                  <div>
                    <label style={labelStyle}>Payment Status</label>
                    <select value={paymentForm.paymentStatus} onChange={(e) => setPaymentForm({ ...paymentForm, paymentStatus: e.target.value })} style={inputStyle}>
                      {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Payment Mode</label>
                    <select value={paymentForm.paymentMode} onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })} style={inputStyle}>
                      <option value="">Select</option>
                      {PAYMENT_MODES.map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Due Date</label>
                    <input type="date" value={paymentForm.dueDate} onChange={(e) => setPaymentForm({ ...paymentForm, dueDate: e.target.value })} style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: "span 3" }}>
                    <label style={labelStyle}>Follow-up Remark</label>
                    <input type="text" value={paymentForm.followUpRemark} onChange={(e) => setPaymentForm({ ...paymentForm, followUpRemark: e.target.value })} style={inputStyle} placeholder="Payment follow-up note..." />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                  <button onClick={handleCreatePayment} style={{ background: COLORS.navy, color: COLORS.white, border: "none", padding: "11px 28px", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>
                    Create Payment Entry
                  </button>
                  <button onClick={() => setShowPaymentForm(false)} style={{ background: COLORS.grayLight, color: COLORS.navy, border: "none", padding: "11px 28px", borderRadius: 8, cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Payment Table */}
            <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}` }}>
                <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 16 }}>All Payments ({payments.length})</div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: COLORS.grayLight }}>
                      {["Company", "Product", "Total Value", "Advance", "Balance", "Mode", "Due Date", "Status", "Update"].map((h) => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: COLORS.gray, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr key={p._id} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? COLORS.white : "#FAFAFA" }}>
                        <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: COLORS.navy }}>{p.lead?.companyName || p.lead?.contactPerson || "-"}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13 }}>{p.lead?.product || "-"}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 700 }}>₹{p.totalOrderValue?.toLocaleString()}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: COLORS.green }}>₹{p.advanceAmount?.toLocaleString()}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13, color: p.balanceAmount > 0 ? COLORS.red : COLORS.green, fontWeight: 600 }}>₹{p.balanceAmount?.toLocaleString()}</td>
                        <td style={{ padding: "12px 16px", fontSize: 13 }}>{p.paymentMode || "-"}</td>
                        <td style={{ padding: "12px 16px", fontSize: 12, color: p.dueDate && new Date(p.dueDate) < new Date() ? COLORS.red : COLORS.gray }}>
                          {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : "-"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ background: statusColor(p.paymentStatus) + "20", color: statusColor(p.paymentStatus), padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
                            {p.paymentStatus}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <select
                            value={p.paymentStatus}
                            onChange={(e) => handleUpdatePayment(p._id, { paymentStatus: e.target.value })}
                            style={{ padding: "5px 8px", border: `1px solid ${COLORS.border}`, borderRadius: 6, fontSize: 12, cursor: "pointer" }}
                          >
                            {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {payments.length === 0 && (
                  <div style={{ textAlign: "center", padding: 48, color: COLORS.gray }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>💰</div>
                    <div style={{ fontWeight: 600 }}>No payment entries yet</div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>Click "New Payment Entry" to add one</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
