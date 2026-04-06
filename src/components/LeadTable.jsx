function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function openWhatsApp(phone) {
  const clean = String(phone || "").replace(/[^\d]/g, "");
  if (!clean) return;
  window.open(`https://wa.me/${clean}`, "_blank");
}

export default function LeadTable({
  leads,
  loading,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  onEdit,
  onDelete,
  onQuickUpdate,
  onExportCSV,
}) {
  const today = getTodayString();

  const hotCount = leads.filter((lead) => lead.priority === "Hot").length;
  const todayCount = leads.filter(
    (lead) => lead.nextFollowUp && lead.nextFollowUp === today
  ).length;
  const overdueCount = leads.filter(
    (lead) => lead.nextFollowUp && lead.nextFollowUp < today
  ).length;

  return (
    <>
      <div style={styles.filtersRow}>
        <input
          style={styles.searchInput}
          placeholder="Search by company / contact / phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="Interested">Interested</option>
          <option value="Follow Up">Follow Up</option>
        </select>

        <select
          style={styles.select}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priority</option>
          <option value="Hot">Hot</option>
          <option value="Warm">Warm</option>
          <option value="Cold">Cold</option>
        </select>

        <button
          style={styles.clearBtn}
          onClick={() => {
            setSearch("");
            setStatusFilter("All");
            setPriorityFilter("All");
          }}
        >
          Clear Filters
        </button>

        <button style={styles.exportBtn} onClick={onExportCSV}>
          Export CSV
        </button>
      </div>

      <div style={styles.badgesRow}>
        <span style={styles.showingBadge}>Showing: {leads.length}</span>
        <span style={styles.redBadge}>Hot: {hotCount}</span>
        <span style={styles.orangeBadge}>Today: {todayCount}</span>
        <span style={styles.redOutlineBadge}>Overdue: {overdueCount}</span>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Contact</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Priority</th>
              <th style={styles.th}>Last Contact</th>
              <th style={styles.th}>Next Follow-up</th>
              <th style={styles.th}>Notes</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td style={styles.emptyCell} colSpan={9}>
                  Loading...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td style={styles.emptyCell} colSpan={9}>
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id}>
                  <td style={styles.td}>{lead.company || "-"}</td>
                  <td style={styles.td}>{lead.contact || "-"}</td>
                  <td style={styles.td}>{lead.phone || "-"}</td>

                  <td style={styles.td}>
                    <select
                      style={styles.inlineSelect}
                      value={lead.status}
                      onChange={(e) =>
                        onQuickUpdate(lead.id, "status", e.target.value)
                      }
                    >
                      <option value="New">New</option>
                      <option value="Interested">Interested</option>
                      <option value="Follow Up">Follow Up</option>
                    </select>
                  </td>

                  <td style={styles.td}>
                    <select
                      style={styles.inlineSelect}
                      value={lead.priority}
                      onChange={(e) =>
                        onQuickUpdate(lead.id, "priority", e.target.value)
                      }
                    >
                      <option value="Hot">Hot</option>
                      <option value="Warm">Warm</option>
                      <option value="Cold">Cold</option>
                    </select>
                  </td>

                  <td style={styles.td}>{lead.lastContact || "-"}</td>
                  <td style={styles.td}>{lead.nextFollowUp || "-"}</td>
                  <td style={styles.td}>{lead.notes || "-"}</td>

                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button style={styles.editBtn} onClick={() => onEdit(lead)}>
                        Edit
                      </button>

                      <button
                        style={styles.whatsappBtn}
                        onClick={() => openWhatsApp(lead.phone)}
                      >
                        WhatsApp
                      </button>

                      <a style={styles.callBtn} href={`tel:${lead.phone || ""}`}>
                        Call
                      </a>

                      <button
                        style={styles.deleteBtn}
                        onClick={() => onDelete(lead.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

const styles = {
  filtersRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 12,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    minWidth: 240,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#07142c",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 12px",
  },
  select: {
    minWidth: 120,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#07142c",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 12px",
  },
  clearBtn: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#233452",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 12px",
    cursor: "pointer",
  },
  exportBtn: {
    border: "none",
    background: "#16a34a",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  badgesRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 12,
  },
  showingBadge: {
    background: "#0d2347",
    padding: "8px 12px",
    borderRadius: 10,
    fontSize: 13,
    border: "1px solid rgba(255,255,255,0.12)",
  },
  redBadge: {
    background: "#4b1717",
    padding: "8px 12px",
    borderRadius: 10,
    fontSize: 13,
    border: "1px solid rgba(255,255,255,0.12)",
  },
  orangeBadge: {
    background: "#6a4308",
    padding: "8px 12px",
    borderRadius: 10,
    fontSize: 13,
    border: "1px solid rgba(255,255,255,0.12)",
  },
  redOutlineBadge: {
    background: "#4b1717",
    padding: "8px 12px",
    borderRadius: 10,
    fontSize: 13,
    border: "1px solid rgba(255,255,255,0.12)",
  },
  tableWrap: {
    overflowX: "auto",
    background: "#0a1a36",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 14,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 1100,
  },
  th: {
    textAlign: "left",
    padding: 14,
    fontSize: 13,
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    color: "#eef4ff",
    whiteSpace: "nowrap",
  },
  td: {
    padding: 14,
    fontSize: 13,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    verticalAlign: "top",
  },
  inlineSelect: {
    minWidth: 110,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#07142c",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 10px",
  },
  actions: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  editBtn: {
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: 6,
    padding: "7px 12px",
    cursor: "pointer",
  },
  whatsappBtn: {
    border: "none",
    background: "#16a34a",
    color: "#fff",
    borderRadius: 6,
    padding: "7px 12px",
    cursor: "pointer",
  },
  callBtn: {
    display: "inline-block",
    border: "none",
    background: "#7c3aed",
    color: "#fff",
    borderRadius: 6,
    padding: "7px 12px",
    cursor: "pointer",
  },
  deleteBtn: {
    border: "none",
    background: "#dc2626",
    color: "#fff",
    borderRadius: 6,
    padding: "7px 12px",
    cursor: "pointer",
  },
  emptyCell: {
    textAlign: "center",
    padding: 28,
    color: "#d3def5",
  },
};