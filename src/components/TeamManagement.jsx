import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseClient.js";

function getInitials(name, email) {
  const source = name?.trim() || email?.trim() || "U";
  const parts = source.split(" ").filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function formatRole(role) {
  return String(role || "sales").toLowerCase();
}

export default function TeamManagement({ currentRole }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentRole !== "admin") {
      setLoading(false);
      return;
    }

    loadMembers();
  }, [currentRole]);

  async function loadMembers() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, full_name, email, role, created_at")
      .order("full_name", { ascending: true });

    if (error) {
      console.error("Load team members error:", error);
      setMembers([]);
      setLoading(false);
      return;
    }

    const safeMembers = (data || []).map((member) => ({
      ...member,
      role: formatRole(member.role),
    }));

    setMembers(safeMembers);
    setLoading(false);
  }

  function handleRoleChange(id, value) {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id ? { ...member, role: formatRole(value) } : member
      )
    );
  }

  async function handleSaveRole(member) {
    setSavingId(member.id);
    setMessage("");

    const { error } = await supabase
      .from("user_profiles")
      .update({ role: formatRole(member.role) })
      .eq("id", member.id);

    if (error) {
      console.error("Update role error:", error);
      setMessage(error.message);
      setSavingId(null);
      return;
    }

    setMessage(`Role updated for ${member.full_name || member.email}`);
    setSavingId(null);
  }

  const stats = useMemo(() => {
    const total = members.length;
    const admins = members.filter((m) => formatRole(m.role) === "admin").length;
    const sales = members.filter((m) => formatRole(m.role) === "sales").length;
    return { total, admins, sales };
  }, [members]);

  if (currentRole !== "admin") return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Team Management</div>
          <div style={styles.subtitle}>
            Review team members and change access roles
          </div>
        </div>
      </div>

      {message ? <div style={styles.messageBox}>{message}</div> : null}

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Members</div>
          <div style={styles.statValue}>{stats.total}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Admins</div>
          <div style={styles.statValue}>{stats.admins}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statLabel}>Sales</div>
          <div style={styles.statValue}>{stats.sales}</div>
        </div>
      </div>

      {loading ? (
        <div style={styles.emptyBox}>Loading team members...</div>
      ) : members.length === 0 ? (
        <div style={styles.emptyBox}>No team members found</div>
      ) : (
        <div style={styles.grid}>
          {members.map((member) => (
            <div key={member.id} style={styles.card}>
              <div style={styles.topRow}>
                <div style={styles.avatar}>
                  {getInitials(member.full_name, member.email)}
                </div>

                <div
                  style={
                    formatRole(member.role) === "admin"
                      ? styles.adminBadge
                      : styles.salesBadge
                  }
                >
                  {formatRole(member.role) === "admin" ? "Admin" : "Sales"}
                </div>
              </div>

              <div style={styles.name}>
                {member.full_name || member.email || "Unknown User"}
              </div>

              <div style={styles.email}>{member.email || "-"}</div>

              <div style={styles.roleSection}>
                <label style={styles.roleLabel}>Role</label>

                <select
                  style={styles.roleSelect}
                  value={formatRole(member.role)}
                  onChange={(e) => handleRoleChange(member.id, e.target.value)}
                >
                  <option value="sales">Sales</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                style={styles.saveBtn}
                onClick={() => handleSaveRole(member)}
                disabled={savingId === member.id}
              >
                {savingId === member.id ? "Saving..." : "Save Role"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    background: "#0a1a36",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: 800,
    color: "#fff",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#c9d8f5",
  },
  messageBox: {
    background: "#14532d",
    color: "#fff",
    borderRadius: 12,
    padding: "12px 14px",
    marginBottom: 14,
    fontSize: 14,
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    background: "#07142c",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 14,
  },
  statLabel: {
    fontSize: 12,
    color: "#c9d8f5",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 800,
    color: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 12,
  },
  card: {
    background: "#07142c",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 14,
    display: "grid",
    gap: 12,
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 999,
    background: "#1d4ed8",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 14,
  },
  adminBadge: {
    background: "#dc2626",
    color: "#fff",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 700,
  },
  salesBadge: {
    background: "#2563eb",
    color: "#fff",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 700,
  },
  name: {
    fontSize: 15,
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.4,
  },
  email: {
    fontSize: 13,
    color: "#c9d8f5",
    wordBreak: "break-word",
  },
  roleSection: {
    display: "grid",
    gap: 8,
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#dbe7ff",
  },
  roleSelect: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#0c1d3b",
    color: "#fff",
    borderRadius: 10,
    padding: "11px 12px",
    outline: "none",
    fontSize: 14,
  },
  saveBtn: {
    border: "none",
    background: "#16a34a",
    color: "#fff",
    borderRadius: 10,
    padding: "11px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  emptyBox: {
    border: "1px dashed rgba(255,255,255,0.14)",
    borderRadius: 14,
    padding: 16,
    color: "#c9d8f5",
    textAlign: "center",
    background: "#07142c",
  },
};