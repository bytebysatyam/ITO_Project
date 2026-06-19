import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const COLORS = {
  navy: "#0D1B3E",
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

const STAGES = [
  "New Lead", "Lead Qualification", "Follow-Up", "Requirement Captured",
  "Quotation Required", "Quotation Pending Approval", "Quotation Approved",
  "Negotiation", "LOI / PO Pending", "Order Confirmed",
  "Dispatch Pending", "Payment Pending", "Closed Won", "Closed Lost",
];

const leadTypeColor = (type) => {
  if (type === "Hot") return COLORS.red;
  if (type === "Warm") return COLORS.orange;
  if (type === "Cold") return COLORS.blue;
  return COLORS.gray;
};

export default function EmployeeCRM() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [revealedFields, setRevealedFields] = useState({});

  // Follow-up form state
  const [followUp, setFollowUp] = useState({
    stage: "",
    followUpDate: "",
    followUpRemarks: "",
    callStatus: "",
    whatsappStatus: "",
    nextAction: "",
  });

  // Quotation form state
  const [quotation, setQuotation] = useState({
    productName: "",
    quantity: "",
    destination: "",
    customerExpectedPrice: "",
    proposedPrice: "",
    baseCost: "",
    logisticsBuffer: "",
    marginNote: "",
    paymentTerms: "",
    deliveryTerms: "",
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/leads");
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/login"); };

  const openLead = (lead) => {
    setSelectedLead(lead);
    setFollowUp({
      stage: lead.stage || "New Lead",
      followUpDate: lead.followUpDate ? lead.followUpDate.split("T")[0] : "",
      followUpRemarks: lead.followUpRemarks || "",
      callStatus: lead.callStatus || "",
      whatsappStatus: lead.whatsappStatus || "",
      nextAction: lead.nextAction || "",
    });
    setQuotation({
      productName: lead.product || "",
      quantity: lead.quantity || "",
      destination: lead.destination || "",
      customerExpectedPrice: "",
      proposedPrice: "",
      baseCost: "",
      logisticsBuffer: "",
      marginNote: "",
      paymentTerms: lead.paymentTerms || "",
      deliveryTerms: lead.deliveryTerms || "",
    });
    setShowQuotationForm(false);
    setRevealedFields({});
  };

  const handleSaveFollowUp = async () => {
    if (!followUp.followUpRemarks) return alert("Please add follow-up remarks");
    setSaving(true);
    try {
      await API.put(`/leads/${selectedLead._id}`, followUp);
      fetchLeads();
      alert("Follow-up saved!");
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReveal = async (field) => {
    try {
      const { data } = await API.post(`/leads/${selectedLead._id}/reveal`, { field });
      setRevealedFields((prev) => ({ ...prev, [field]: data.value }));
    } catch (err) {
      alert("Error revealing field");
    }
  };

  const handleSubmitQuotation = async () => {
    if (!quotation.proposedPrice) return alert("Enter proposed price");
    setSaving(true);
    try {
      await API.post("/quotations", {
        leadId: selectedLead._id,
        ...quotation,
        customerExpectedPrice: Number(quotation.customerExpectedPrice),
        proposedPrice: Number(quotation.proposedPrice),
        baseCost: Number(quotation.baseCost),
        logisticsBuffer: Number(quotation.logisticsBuffer),
      });
      alert("Quotation submitted for admin approval!");
      setShowQuotationForm(false);
      fetchLeads();
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  const maskMobile = (mobile) => mobile ? mobile.slice(0, 2) + "XXXXXX" + mobile.slice(-2) : "-";
  const maskEmail = (email) => {
    if (!email) return "-";
    const [u, domain] = email.split("@");
    return u.slice(0, 2) + "****@" + domain;
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: COLORS.navy, fontSize: 18, fontWeight: 600 }}>Loading CRM...</div>
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
            <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 14 }}>Employee CRM Portal</div>
            <div style={{ color: COLORS.gold, fontSize: 11 }}>{user?.department} Division</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>👤 {user?.name}</span>
          <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: COLORS.white, padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedLead ? "1fr 420px" : "1fr", gap: 24, padding: 24, maxWidth: 1400, margin: "0 auto" }}>
        {/* Lead Table */}
        <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 16 }}>
              My Assigned Leads ({leads.length})
            </div>
            <button onClick={fetchLeads} style={{ background: COLORS.navy, color: COLORS.white, border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
              Refresh
            </button>
          </div>

          {leads.length === 0 ? (
            <div style={{ textAlign: "center", padding: 64, color: COLORS.gray }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>No leads assigned yet</div>
              <div style={{ fontSize: 13, marginTop: 8 }}>Admin will assign leads to you</div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: COLORS.grayLight }}>
                    {["Product", "Company", "Quantity", "Destination", "Type", "Stage", "Follow-up Date", "Action"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: COLORS.gray, letterSpacing: "0.06em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <tr
                      key={lead._id}
                      onClick={() => openLead(lead)}
                      style={{
                        borderBottom: `1px solid ${COLORS.border}`,
                        background: selectedLead?._id === lead._id ? "#EFF6FF" : i % 2 === 0 ? COLORS.white : "#FAFAFA",
                        cursor: "pointer",
                      }}
                    >
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 600, color: COLORS.navy }}>{lead.product}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{lead.companyName || "-"}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{lead.quantity}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13 }}>{lead.destination}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: leadTypeColor(lead.leadType) + "20", color: leadTypeColor(lead.leadType), padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                          {lead.leadType}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: COLORS.gray }}>{lead.stage}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: lead.followUpDate && new Date(lead.followUpDate) < new Date() ? COLORS.red : COLORS.gray }}>
                        {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : "-"}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button style={{ background: COLORS.navy, color: COLORS.white, border: "none", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>
                          Open →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lead Detail Panel */}
        {selectedLead && (
          <div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden", height: "fit-content" }}>
            {/* Header */}
            <div style={{ background: COLORS.navy, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: COLORS.gold, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em" }}>Lead Detail</div>
                <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 15 }}>{selectedLead.product}</div>
              </div>
              <button onClick={() => setSelectedLead(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 18, cursor: "pointer" }}>✕</button>
            </div>

            <div style={{ padding: 20, maxHeight: "80vh", overflowY: "auto" }}>
              {/* Lead Type Badge */}
              <div style={{ marginBottom: 16 }}>
                <span style={{ background: leadTypeColor(selectedLead.leadType) + "20", color: leadTypeColor(selectedLead.leadType), padding: "4px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
                  {selectedLead.leadType} Lead
                </span>
              </div>

              {/* Basic Info */}
              <div style={{ background: COLORS.grayLight, borderRadius: 10, padding: 16, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 13, marginBottom: 12 }}>Customer Information</div>
                {[
                  { label: "Company", value: selectedLead.companyName || "-" },
                  { label: "Contact", value: selectedLead.contactPerson },
                  { label: "Quantity", value: selectedLead.quantity },
                  { label: "Destination", value: selectedLead.destination },
                  { label: "Payment Terms", value: selectedLead.paymentTerms || "-" },
                  { label: "Source", value: selectedLead.source },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                    <span style={{ color: COLORS.gray }}>{item.label}</span>
                    <span style={{ color: COLORS.navy, fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}

                {/* Masked Mobile */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: COLORS.gray }}>Mobile</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: COLORS.navy, fontWeight: 600, fontFamily: "monospace" }}>
                      {revealedFields.mobile || maskMobile(selectedLead.mobile)}
                    </span>
                    {!revealedFields.mobile && (
                      <button onClick={() => handleReveal("mobile")} style={{ background: COLORS.navy, color: COLORS.white, border: "none", padding: "2px 8px", borderRadius: 4, cursor: "pointer", fontSize: 10 }}>
                        Reveal
                      </button>
                    )}
                  </div>
                </div>

                {/* Masked Email */}
                {selectedLead.email && (
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                    <span style={{ color: COLORS.gray }}>Email</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: COLORS.navy, fontWeight: 600 }}>
                        {revealedFields.email || maskEmail(selectedLead.email)}
                      </span>
                      {!revealedFields.email && (
                        <button onClick={() => handleReveal("email")} style={{ background: COLORS.navy, color: COLORS.white, border: "none", padding: "2px 8px", borderRadius: 4, cursor: "pointer", fontSize: 10 }}>
                          Reveal
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Follow-up Form */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 13, marginBottom: 12 }}>Update Follow-up</div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, color: COLORS.gray, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Stage</label>
                  <select value={followUp.stage} onChange={(e) => setFollowUp({ ...followUp, stage: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13 }}>
                    {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, color: COLORS.gray, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Follow-up Date</label>
                  <input type="date" value={followUp.followUpDate} onChange={(e) => setFollowUp({ ...followUp, followUpDate: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, color: COLORS.gray, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Call Status</label>
                  <select value={followUp.callStatus} onChange={(e) => setFollowUp({ ...followUp, callStatus: e.target.value })}
                    style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13 }}>
                    <option value="">Select</option>
                    {["Called - Answered", "Called - Not Answered", "Callback Requested", "Not Reachable"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: 10 }}>
                  <label style={{ fontSize: 11, color: COLORS.gray, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Remarks *</label>
                  <textarea value={followUp.followUpRemarks} onChange={(e) => setFollowUp({ ...followUp, followUpRemarks: e.target.value })}
                    placeholder="What was discussed..." rows={3}
                    style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, resize: "vertical", boxSizing: "border-box" }} />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 11, color: COLORS.gray, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Next Action</label>
                  <input type="text" value={followUp.nextAction} onChange={(e) => setFollowUp({ ...followUp, nextAction: e.target.value })}
                    placeholder="What to do next..."
                    style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
                </div>

                <button onClick={handleSaveFollowUp} disabled={saving}
                  style={{ width: "100%", background: COLORS.navy, color: COLORS.white, border: "none", padding: 11, borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 10 }}>
                  {saving ? "Saving..." : "Save Follow-up"}
                </button>

                <button onClick={() => setShowQuotationForm(!showQuotationForm)}
                  style={{ width: "100%", background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, color: COLORS.navy, border: "none", padding: 11, borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  {showQuotationForm ? "Hide Quotation Form" : "Request Quotation →"}
                </button>
              </div>

              {/* Quotation Form */}
              {showQuotationForm && (
                <div style={{ background: "#FFFBEB", border: `1.5px solid ${COLORS.gold}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 13, marginBottom: 12 }}>Quotation Request</div>
                  {[
                    { key: "customerExpectedPrice", label: "Customer Expected Price (₹)" },
                    { key: "proposedPrice", label: "Proposed Price (₹) *" },
                    { key: "baseCost", label: "Base Cost (₹)" },
                    { key: "logisticsBuffer", label: "Logistics Buffer (₹)" },
                    { key: "marginNote", label: "Margin Note" },
                    { key: "paymentTerms", label: "Payment Terms" },
                    { key: "deliveryTerms", label: "Delivery Terms" },
                  ].map((f) => (
                    <div key={f.key} style={{ marginBottom: 10 }}>
                      <label style={{ fontSize: 11, color: COLORS.gray, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.label}</label>
                      <input type="text" value={quotation[f.key]} onChange={(e) => setQuotation({ ...quotation, [f.key]: e.target.value })}
                        style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
                    </div>
                  ))}
                  <button onClick={handleSubmitQuotation} disabled={saving}
                    style={{ width: "100%", background: COLORS.green, color: COLORS.white, border: "none", padding: 11, borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", marginTop: 8 }}>
                    {saving ? "Submitting..." : "Submit for Admin Approval"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
