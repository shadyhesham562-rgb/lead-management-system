export default function LeadTable({
  leads = [],
  loading = false,
  search = "",
  setSearch,
  statusFilter = "All",
  setStatusFilter,
  priorityFilter = "All",
  setPriorityFilter,
  onEdit,
  onDelete,
  onQuickUpdate,
  onExportCSV,
}) {
  const today = new Date().toISOString().split("T")[0];

  const hotCount = leads.filter((lead) => lead.priority === "Hot").length;
  const todayCount = leads.filter((lead) => lead.nextFollowUp === today).length;
  const overdueCount = leads.filter(
    (lead) => lead.nextFollowUp && lead.nextFollowUp < today
  ).length;

  function clearFilters() {
    setSearch?.("");
    setStatusFilter?.("All");
    setPriorityFilter?.("All");
  }

  function openWhatsApp(phone) {
    if (!phone) return;
    const cleanPhone = String(phone).replace(/[^\d+]/g, "");
    window.open(`https://wa.me/${cleanPhone}`, "_blank");
  }

  function makeCall(phone) {
    if (!phone) return;
    window.location.href = `tel:${phone}`;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.filtersRow}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search by company / contact / phone"
          value={search}
          onChange={(e) => setSearch?.(e.target.value)}
        />

        <select
          style={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter?.(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="Interested">Interested</option>
          <option value="Follow Up">Follow Up</option>
        </select>

        <select
          style={styles.select}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter?.(e.target.value)}
        >
          <option value="All">All Priority</option>
          <option value="Hot">Hot</option>
          <option value="Warm">Warm</option>
          <option value="Cold">Cold</option>
        </select>

        <button style={styles.clearBtn} onClick={clearFilters}>
          Clear Filters
        </button>

        {onExportCSV ? (
          <button style={styles.exportBtn} onClick={onExportCSV}>
            Export CSV
          </button>
        ) : null}
      </div>

      <div style={styles.summaryRow}>
        <div style={styles.summaryChip}>Showing: {leads.length}</div>
        <div style={styles.summaryChipHot}>Hot: {hotCount}</div>
        <div style={styles.summaryChipToday}>Today: {todayCount}</div>
        <div style={styles.summaryChipOverdue}>Overdue: {overdueCount}</div>
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
                      value={lead.status || "New"}
                      onChange={(e) =>
                        onQuickUpdate?.(lead.id, "status", e.target.value)
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
                      value={lead.priority || "Warm"}
                      onChange={(e) =>
                        onQuickUpdate?.(lead.id, "priority", e.target.value)
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
                      <button
                        style={styles.editBtn}
                        onClick={() => onEdit?.(lead)}
                      >
                        Edit
                      </button>

                      <button
                        style={styles.whatsBtn}
                        onClick={() => openWhatsApp(lead.phone)}
                      >
                        WhatsApp
                      </button>

                      <button
                        style={styles.callBtn}
                        onClick={() => makeCall(lead.phone)}
                      >
                        Call
                      </button>

                      {onDelete ? (
                        <button
                          style={styles.deleteBtn}
                          onClick={() => onDelete(lead.id)}
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
  },
  filtersRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  searchInput: {
    flex: "1 1 320px",
    minWidth: 220,
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#07142c",
    color: "#fff",
    borderRadius: 10,
    padding: "12px 14px",
    outline: "none",
  },
  select: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#07142c",
    color: "#fff",
    borderRadius: 10,
    padding: "12px 14px",
    outline: "none",
    minWidth: 130,
  },
  clearBtn: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#233452",
    color: "#fff",
    borderRadius: 10,
    padding: "12px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  exportBtn: {
    border: "none",
    background: "#16a34a",
    color: "#fff",
    borderRadius: 10,
    padding: "12px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  summaryRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  summaryChip: {
    background: "#0d1f3f",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 999,
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 700,
  },
  summaryChipHot: {
    background: "#4c1d1d",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 999,
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 700,
  },
  summaryChipToday: {
    background: "#6b4a08",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 999,
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 700,
  },
  summaryChipOverdue: {
    background: "#7f1d1d",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 999,
    padding: "8px 12px",
    fontSize: 13,
    fontWeight: 700,
  },
  tableWrap: {
    width: "100%",
    overflowX: "auto",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 14,
    background: "#07142c",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 1100,
  },
  th: {
    textAlign: "left",
    padding: "14px 12px",
    background: "#162845",
    color: "#fff",
    fontSize: 13,
    fontWeight: 800,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  td: {
    padding: "12px",
    color: "#fff",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    fontSize: 14,
    verticalAlign: "middle",
  },
  emptyCell: {
    padding: "20px",
    textAlign: "center",
    color: "#c9d8f5",
    fontSize: 14,
  },
  inlineSelect: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#0d1c37",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 10px",
    outline: "none",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  editBtn: {
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  whatsBtn: {
    border: "none",
    background: "#16a34a",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  callBtn: {
    border: "none",
    background: "#9333ea",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  deleteBtn: {
    border: "none",
    background: "#dc2626",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },
};