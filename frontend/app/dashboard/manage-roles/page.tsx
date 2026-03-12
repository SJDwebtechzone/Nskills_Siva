"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

interface Role {
  id: number;
  name: string;
  created_at: string;
}

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/roles`;

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function fmtDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function ManageRolesPage() {
  const router = useRouter();
  const { can } = useAuth();

  const [roles,     setRoles]     = useState<Role[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newName,   setNewName]   = useState("");
  const [saving,    setSaving]    = useState(false);
  const [modalErr,  setModalErr]  = useState("");
  const [toast,     setToast]     = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(API, { headers: getAuthHeaders() });
      const json = await res.json();
      setRoles(json.data || []);
    } catch {
      showToast("❌ Failed to load roles");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center",
        justifyContent: "center", height: "60vh" }}>
        <p style={{ color: "#6366f1", fontWeight: 600 }}>Loading...</p>
      </div>
    );
  }

  if (!can("Manage Roles", "view")) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", height: "60vh", gap: 12 }}>
        <div style={{ fontSize: 48 }}>⛔</div>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e293b" }}>Access Denied</h2>
        <p style={{ color: "#94a3b8", fontSize: "0.84rem" }}>
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  const filtered = roles.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const addRole = async () => {
    if (!newName.trim()) { setModalErr("Role name is required"); return; }
    setSaving(true); setModalErr("");
    try {
      const res  = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed");
      setShowModal(false);
      setNewName("");
      showToast("✅ Role created successfully!");
      load();
    } catch (e: any) {
      setModalErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes toastIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        .skeleton { background:linear-gradient(90deg,#f1f5f9 25%,#e9eef5 50%,#f1f5f9 75%);
          background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:6px; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .role-row:hover { background: #fafbff !important; }
        .icon-btn { width:30px; height:30px; border-radius:8px; border:1.5px solid #e2e8f0;
          background:#fff; cursor:pointer; font-size:13px; display:inline-flex;
          align-items:center; justify-content:center; transition:all 0.15s; }
        .icon-btn:hover { border-color:#a5b4fc; background:#eef2ff; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#1e293b" }}>
            Manage Roles
          </h1>
          <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: 2 }}>
            {roles.length} total roles
          </p>
        </div>
        {can("Manage Roles", "add") && (
          <button
            onClick={() => { setShowModal(true); setNewName(""); setModalErr(""); }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
              background: "linear-gradient(135deg,#6366f1,#7c3aed)", color: "#fff",
              border: "none", borderRadius: 11, fontWeight: 700, fontSize: "0.86rem",
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 4px 16px rgba(99,102,241,0.35)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ width: 15, height: 15 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add New Role
          </button>
        )}
      </div>

      {/* ── Search ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10,
        flexWrap: "wrap", marginBottom: 16 }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180, maxWidth: 280 }}>
          <span style={{ position: "absolute", left: 10, top: "50%",
            transform: "translateY(-50%)", fontSize: 13 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search roles…"
            style={{ width: "100%", padding: "8px 12px 8px 32px", borderRadius: 10,
              border: "1.5px solid #e2e8f0", fontSize: "0.8rem", outline: "none",
              fontFamily: "inherit", boxSizing: "border-box" }} />
        </div>
        <button onClick={() => setSearch("")}
          style={{ padding: "8px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0",
            background: "#fff", cursor: "pointer", fontSize: "0.78rem",
            fontWeight: 700, color: "#64748b", fontFamily: "inherit" }}>
          Reset
        </button>
        <button onClick={load}
          style={{ padding: "8px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0",
            background: "#fff", cursor: "pointer", fontSize: "0.78rem",
            fontWeight: 700, color: "#64748b", fontFamily: "inherit" }}>
          ↻ Refresh
        </button>
      </div>

      {/* ── Table ── */}
      <div style={{ background: "#fff", borderRadius: 16,
        border: "1.5px solid #f1f5f9", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["#", "Role Name", "Created At", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left",
                    fontSize: "0.62rem", fontWeight: 800, textTransform: "uppercase",
                    letterSpacing: "0.09em", color: "#94a3b8", whiteSpace: "nowrap",
                    borderBottom: "1.5px solid #f1f5f9" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "52px 16px", color: "#cbd5e1" }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
                    No roles found.
                  </td>
                </tr>
              )}
              {filtered.map((role, i) => (
                <tr key={role.id} className="role-row"
                  style={{ borderTop: "1px solid #f8fafc", transition: "background 0.1s",
                    animation: "fadeUp 0.22s ease both", animationDelay: `${i * 0.03}s` }}>
                  <td style={{ padding: "12px 16px", color: "#cbd5e1",
                    fontSize: "0.72rem", fontWeight: 600 }}>{i + 1}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10,
                        background: "linear-gradient(135deg,#f59e0b,#d97706)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, flexShrink: 0 }}>🔒</div>
                      <span style={{ fontWeight: 700, color: "#1e293b", textTransform: "capitalize" }}>
                        {role.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "0.78rem", color: "#94a3b8" }}>
                    {fmtDate(role.created_at)}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {can("Manage Roles", "edit") && (
                      <button title="Edit Permissions" className="icon-btn"
                        onClick={() => router.push(`/dashboard/manage-roles/${role.id}`)}>
                        ✏️
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #f8fafc",
          fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600 }}>
          Showing {filtered.length} of {roles.length} roles
        </div>
      </div>

      {/* ── Add Role Modal ── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(11,31,58,0.55)",
          zIndex: 9000, display: "flex", alignItems: "center",
          justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 24px",
            maxWidth: 380, width: "100%", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14,
                background: "rgba(99,102,241,0.1)", display: "flex",
                alignItems: "center", justifyContent: "center",
                margin: "0 auto 12px", fontSize: 26 }}>🔒</div>
              <h3 style={{ fontSize: "1rem", fontWeight: 800, color: "#1e293b" }}>
                Add New Role
              </h3>
            </div>
            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700,
              color: "#475569", textTransform: "uppercase",
              letterSpacing: "0.07em", marginBottom: 6 }}>
              Role Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input value={newName}
              onChange={e => { setNewName(e.target.value); setModalErr(""); }}
              onKeyDown={e => e.key === "Enter" && addRole()}
              placeholder="e.g. manager"
              style={{ width: "100%", padding: "9px 12px", borderRadius: 9,
                fontSize: "0.84rem",
                border: modalErr ? "1.5px solid #ef4444" : "1.5px solid #e2e8f0",
                background: modalErr ? "#fef2f2" : "#fff", outline: "none",
                boxSizing: "border-box", fontFamily: "inherit", color: "#1e293b",
                marginBottom: 6 }} />
            {modalErr && (
              <p style={{ color: "#ef4444", fontSize: "0.68rem", marginBottom: 12 }}>
                ⚠ {modalErr}
              </p>
            )}
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                onClick={() => { setShowModal(false); setNewName(""); setModalErr(""); }}
                style={{ flex: 1, padding: 10, background: "#f8fafc",
                  border: "1.5px solid #e2e8f0", borderRadius: 10, fontWeight: 700,
                  fontSize: "0.82rem", cursor: "pointer", color: "#64748b",
                  fontFamily: "inherit" }}>Cancel</button>
              <button onClick={addRole} disabled={saving}
                style={{ flex: 1, padding: 10,
                  background: saving ? "#a5b4fc" : "#6366f1",
                  border: "none", borderRadius: 10, fontWeight: 700,
                  fontSize: "0.82rem", cursor: saving ? "not-allowed" : "pointer",
                  color: "#fff", fontFamily: "inherit" }}>
                {saving ? "Saving…" : "Save Role"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 10000,
          background: "#1e293b", color: "#fff", padding: "12px 20px",
          borderRadius: 12, fontSize: "0.83rem", fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)", animation: "toastIn 0.25s ease" }}>
          {toast}
        </div>
      )}
    </>
  );
}