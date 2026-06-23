import { useState, useEffect, useRef } from "react";
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

const DOC_TYPES = ["LOI", "PO", "GST", "PAN", "Lab Report", "Invoice", "Delivery Proof", "Payment Proof", "Weighment Slip", "Dispatch Proof", "Quotation PDF", "Other"];

const fileIcon = (type) => {
  if (type === ".pdf") return "📄";
  if ([".jpg", ".jpeg", ".png"].includes(type)) return "🖼️";
  if ([".doc", ".docx"].includes(type)) return "📝";
  if ([".xlsx", ".xls"].includes(type)) return "📊";
  return "📁";
};

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

const docTypeColor = (type) => {
  const map = {
    "LOI": COLORS.blue, "PO": COLORS.green, "Invoice": COLORS.orange,
    "Payment Proof": COLORS.green, "Lab Report": COLORS.blue,
    "GST": COLORS.navy, "PAN": COLORS.navy,
  };
  return map[type] || COLORS.gray;
};

export default function DocumentVault() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadForm, setUploadForm] = useState({ documentType: "LOI", leadId: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [docsRes, leadsRes] = await Promise.all([
        API.get("/documents"),
        API.get("/leads"),
      ]);
      setDocuments(docsRes.data);
      setLeads(leadsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) return alert("File size must be under 10MB");
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("documentType", uploadForm.documentType);
      if (uploadForm.leadId) formData.append("leadId", uploadForm.leadId);

      await API.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Document uploaded successfully!");
      setSelectedFile(null);
      setShowUploadForm(false);
      setUploadForm({ documentType: "LOI", leadId: "" });
      fetchAll();
    } catch (err) {
      alert("Upload failed: " + err.response?.data?.message);
    } finally {
      setUploading(false);
    }
  };

  const handleView = async (doc) => {
    try {
      const response = await fetch(`http://localhost:5000/api/documents/${doc.id}/view`, {
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem("ito_user")).token}` },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      alert("Error viewing document");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await API.delete(`/documents/${id}`);
      fetchAll();
    } catch (err) {
      alert("Error: " + err.response?.data?.message);
    }
  };

  const filteredDocs = filter === "All" ? documents : documents.filter((d) => d.documentType === filter);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: COLORS.navy, fontSize: 18, fontWeight: 600 }}>Loading Document Vault...</div>
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
            <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 14 }}>Document Vault</div>
            <div style={{ color: COLORS.gold, fontSize: 11 }}>India Trade Overseas — Secure Storage</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate(user?.role === "admin" ? "/admin" : "/crm")} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: COLORS.white, padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
            ← Back
          </button>
          <button onClick={() => { logout(); navigate("/login"); }} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: COLORS.white, padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding: 32, maxWidth: 1400, margin: "0 auto" }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h2 style={{ color: COLORS.navy, fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Document Vault</h2>
            <p style={{ color: COLORS.gray, fontSize: 13 }}>{documents.length} documents stored securely</p>
          </div>
          <button onClick={() => setShowUploadForm(!showUploadForm)}
            style={{ background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`, color: COLORS.navy, border: "none", padding: "11px 24px", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            + Upload Document
          </button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div style={{ background: COLORS.white, border: `1.5px solid ${COLORS.border}`, borderRadius: 12, padding: 28, marginBottom: 24 }}>
            <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 16, marginBottom: 20 }}>Upload New Document</div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); }}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? COLORS.gold : COLORS.border}`,
                borderRadius: 12,
                padding: 40,
                textAlign: "center",
                cursor: "pointer",
                background: dragOver ? "#FFFBEB" : COLORS.grayLight,
                marginBottom: 20,
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
              {selectedFile ? (
                <div>
                  <div style={{ color: COLORS.green, fontWeight: 700, fontSize: 15 }}>✓ {selectedFile.name}</div>
                  <div style={{ color: COLORS.gray, fontSize: 12, marginTop: 4 }}>{formatSize(selectedFile.size)}</div>
                </div>
              ) : (
                <div>
                  <div style={{ color: COLORS.navy, fontWeight: 600, fontSize: 15 }}>Drag & drop file here or click to browse</div>
                  <div style={{ color: COLORS.gray, fontSize: 12, marginTop: 6 }}>PDF, JPG, PNG, DOC, XLSX — Max 10MB</div>
                </div>
              )}
              <input ref={fileInputRef} type="file" style={{ display: "none" }} onChange={(e) => handleFileSelect(e.target.files[0])}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx,.xls" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 11, color: COLORS.gray, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Document Type</label>
                <select value={uploadForm.documentType} onChange={(e) => setUploadForm({ ...uploadForm, documentType: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13 }}>
                  {DOC_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, color: COLORS.gray, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Link to Lead (optional)</label>
                <select value={uploadForm.leadId} onChange={(e) => setUploadForm({ ...uploadForm, leadId: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, fontSize: 13 }}>
                  <option value="">No lead linked</option>
                  {leads.map((l) => <option key={l._id} value={l._id}>{l.product} — {l.contactPerson} ({l.companyName || "N/A"})</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={handleUpload} disabled={uploading || !selectedFile}
                style={{ background: uploading ? COLORS.gray : COLORS.navy, color: COLORS.white, border: "none", padding: "11px 28px", borderRadius: 8, fontWeight: 700, cursor: uploading ? "not-allowed" : "pointer", fontSize: 13 }}>
                {uploading ? "Uploading..." : "Upload Document"}
              </button>
              <button onClick={() => { setShowUploadForm(false); setSelectedFile(null); }}
                style={{ background: COLORS.grayLight, color: COLORS.navy, border: "none", padding: "11px 28px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {["All", ...DOC_TYPES].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px",
                background: filter === f ? COLORS.navy : COLORS.white,
                color: filter === f ? COLORS.white : COLORS.gray,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 600,
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        {filteredDocs.length === 0 ? (
          <div style={{ textAlign: "center", padding: 64, color: COLORS.gray }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>No documents yet</div>
            <div style={{ fontSize: 13, marginTop: 8 }}>Upload your first document using the button above</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {filteredDocs.map((doc) => (
              <div key={doc.id} style={{ background: COLORS.white, border: `1.5px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden", transition: "box-shadow 0.2s" }}>
                {/* Color top bar */}
                <div style={{ height: 4, background: `linear-gradient(90deg, ${docTypeColor(doc.documentType)}, ${COLORS.gold})` }} />
                <div style={{ padding: 20 }}>
                  {/* File icon + name */}
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ fontSize: 32, flexShrink: 0 }}>{fileIcon(doc.fileType)}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: COLORS.navy, fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {doc.originalName}
                      </div>
                      <div style={{ color: COLORS.gray, fontSize: 11, marginTop: 2 }}>{formatSize(doc.fileSize)}</div>
                    </div>
                  </div>

                  {/* Doc type badge */}
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ background: docTypeColor(doc.documentType) + "20", color: docTypeColor(doc.documentType), padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
                      {doc.documentType}
                    </span>
                  </div>

                  {/* Meta info */}
                  <div style={{ fontSize: 12, color: COLORS.gray, marginBottom: 4 }}>
                    Uploaded by: <strong style={{ color: COLORS.navy }}>{doc.uploaderName}</strong>
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.gray, marginBottom: 4 }}>
                    Date: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.gray, marginBottom: 16 }}>
                    Views: {doc.accessLog?.length || 0}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => handleView(doc)}
                      style={{ flex: 1, background: COLORS.navy, color: COLORS.white, border: "none", padding: "8px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                      👁️ View
                    </button>
                    {user?.role === "admin" && (
                      <button onClick={() => handleDelete(doc.id)}
                        style={{ background: "#FEE2E2", color: COLORS.red, border: "none", padding: "8px 12px", borderRadius: 7, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
