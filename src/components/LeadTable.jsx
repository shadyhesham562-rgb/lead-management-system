import { useEffect, useMemo, useState } from "react";

function EmptyStateBox({ title, text }) {
  return (
    <div style={styles.emptyStateBox}>
      <div style={styles.emptyStateIcon}>•</div>
      <div style={styles.emptyStateTitle}>{title}</div>
      <div style={styles.emptyStateText}>{text}</div>
    </div>
  );
}

export default function LeadTable({
  leads = [],
  loading = false,
  search = "",
  setSearch,
  statusFilter = "All",
  setStatusFilter,
  priorityFilter = "All",
  setPriorityFilter,
  quickFilter = "all",
  setQuickFilter,
  ownerFilter = "All",
  setOwnerFilter,
  ownerOptions = [],
  onEdit,
  onDelete,
  onQuickUpdate,
  onExportCSV,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hotCount = leads.filter((lead) => lead.priority === "Hot").length;
  const todayCount = leads.filter((lead) => lead.nextFollowUp === today).length;
  const overdueCount = leads.filter(
    (lead) => lead.nextFollowUp && lead.nextFollowUp < today
  ).length;

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "All" ||
    priorityFilter !== "All" ||
    quickFilter !== "all" ||
    ownerFilter !== "All";

  const emptyTitle = hasActiveFilters ? "No matching leads found" : "No leads yet";

  const emptyText = hasActiveFilters
    ? "Try changing the search or filters to see more results."
    : "Start by adding your first lead to begin tracking follow-ups.";

  const quickFilterLabel = useMemo(() => {
    if (quickFilter === "today") return "Today";
    if (quickFilter === "overdue") return "Overdue";
    return "All";
  }, [quickFilter]);

  function clearFilters() {
    setSearch?.("");
    setStatusFilter?.("All");
    setPriorityFilter?.("All");
    setQuickFilter?.("all");
    setOwnerFilter?.("All");
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

  function getFollowUpType(lead) {
    if (!lead.nextFollowUp) return "none";
    if (lead.nextFollowUp < today) return "overdue";
    if (lead.nextFollowUp === today) return "today";
    return "upcoming";
  }

  function getRowStyle(lead) {
    const type = getFollowUpType(lead);

    if (type === "overdue") {
      return {
        ...styles.row,
        background: "rgba(127, 29, 29, 0.18)",
      };
    }

    if (type === "today") {
      return {
        ...styles.row,
        background: "rgba(180, 83, 9, 0.18)",
      };
    }

    return styles.row;
  }

  function renderFollowUpCell(lead) {
    const type = getFollowUpType(lead);

    if (!lead.nextFollowUp) {
      return <span>-</span>;
    }

    if (type === "overdue") {
      return (
        <div style={styles.followUpCell}>
          <span>{lead.nextFollowUp}</span>
          <span style={styles.overdueBadge}>Overdue</span>
        </div>
      );
    }

    if (type === "today") {
      return (
        <div style={styles.followUpCell}>
          <span>{lead.nextFollowUp}</span>
          <span style={styles.todayBadge}>Today</span>
        </div>
      );
    }

    return <span>{lead.nextFollowUp}</span>;
  }

  function renderMobileCard(lead) {
    return (
      <div key={lead.id} style={styles.mobileCard}>
        <div style={styles.mobileTop}>
          <div>
            <div style={styles.mobileCompany}>{lead.company || "-"}</div>
            <div style={styles.mobileContact}>{lead.contact || "-"}</div>
          </div>

          <div style={styles.mobileOwnerBox}>{lead.ownerName || "-"}</div>
        </div>

        <div style={styles.mobileInfoGrid}>
          <div style={styles.mobileInfoItem}>
            <span style={styles.mobileInfoLabel}>Phone</span>
            <span style={styles.mobileInfoValue}>{lead.phone || "-"}</span>
          </div>

          <div style={styles.mobileInfoItem}>
            <span style={styles.mobileInfoLabel}>Last Contact</span>
            <span style={styles.mobileInfoValue}>{lead.lastContact || "-"}</span>
          </div>

          <div style={styles.mobileInfoItem}>
            <span style={styles.mobileInfoLabel}>Follow-up</span>
            <span style={styles.mobileInfoValue}>{renderFollowUpCell(lead)}</span>
          </div>
        </div>

        <div style={styles.mobileSelects}>
          <select
            style={styles.mobileSelect}
            value={lead.status || "New"}
            onChange={(e) => onQuickUpdate?.(lead.id, "status", e.target.value)}
          >
            <option value="New">New</option>
            <option value="Interested">Interested</option>
            <option value="Follow Up">Follow Up</option>
          </select>

          <select
            style={styles.mobileSelect}
            value={lead.priority || "Warm"}
            onChange={(e) => onQuickUpdate?.(lead.id, "priority", e.target.value)}
          >
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Cold">Cold</option>
          </select>
        </div>

        <div style={styles.mobileNotesBox}>
          <span style={styles.mobileInfoLabel}>Notes</span>
          <div style={styles.mobileNotesText}>{lead.notes || "-"}</div>
        </div>

        <div style={styles.mobileActions}>
          <button style={styles.editBtn} onClick={() => onEdit?.(lead)}>
            Edit
          </button>

          <button style={styles.whatsBtn} onClick={() => openWhatsApp(lead.phone)}>
            WhatsApp
          </button>

          <button style={styles.callBtn} onClick={() => makeCall(lead.phone)}>
            Call
          </button>

          {onDelete ? (
            <button style={styles.deleteBtn} onClick={() => onDelete(lead.id)}>
              Delete
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.quickFilterRow}>
        <button
          style={quickFilter === "all" ? styles.quickBtnActive : styles.quickBtn}
          onClick={() => setQuickFilter?.("all")}
        >
          All
        </button>

        <button
          style={quickFilter === "today" ? styles.quickBtnToday : styles.quickBtn}
          onClick={() => setQuickFilter?.("today")}
        >
          Today
        </button>

        <button
          style={quickFilter === "overdue" ? styles.quickBtnOverdue : styles.quickBtn}
          onClick={() => setQuickFilter?.("overdue")}
        >
          Overdue
        </button>
      </div>

      <div style={styles.filtersRow}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search by company / contact / phone / owner"
          value={search}
          onChange={(e) => setSearch?.(e.target.value)}
        />

        <select
          style={styles.select}
          value={ownerFilter}
          onChange={(e) => setOwnerFilter?.(e.target.value)}
        >
          {(ownerOptions || []).map((owner) => (
            <option key={owner} value={owner}>
              {owner === "All" ? "All Owners" : owner}
            </option>
          ))}
        </select>

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

      {hasActiveFilters ? (
        <div style={styles.filterSummaryBox}>
          <div style={styles.filterSummaryTitle}>Current filters</div>
          <div style={styles.filterSummaryRow}>
            <span style={styles.filterPill}>Quick: {quickFilterLabel}</span>
            <span style={styles.filterPill}>Owner: {ownerFilter}</span>
            <span style={styles.filterPill}>Status: {statusFilter}</span>
            <span style={styles.filterPill}>Priority: {priorityFilter}</span>
            {search.trim() ? (
              <span style={styles.filterPill}>Search: {search.trim()}</span>
            ) : null}
          </div>
        </div>
      ) : null}

      {loading ? (
        <div style={styles.emptyBox}>Loading leads...</div>
      ) : leads.length === 0 ? (
        <EmptyStateBox title={emptyTitle} text={emptyText} />
      ) : isMobile ? (
        <div style={styles.mobileList}>{leads.map(renderMobileCard)}</div>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Company</th>
                <th style={styles.th}>Contact</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Owner</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Priority</th>
                <th style={styles.th}>Last Contact</th>
                <th style={styles.th}>Next Follow-up</th>
                <th style={styles.th}>Notes</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} style={getRowStyle(lead)}>
                  <td style={styles.td}>{lead.company || "-"}</td>
                  <td style={styles.td}>{lead.contact || "-"}</td>
                  <td style={styles.td}>{lead.phone || "-"}</td>
                  <td style={styles.td}>{lead.ownerName || "-"}</td>

                  <td style={styles.td}>
                    <select
                      style={styles.inlineSelect}
                      value={lead.status || "New"}
                      onChange={(e) => onQuickUpdate?.(lead.id, "status", e.target.value)}
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
                      onChange={(e) => onQuickUpdate?.(lead.id, "priority", e.target.value)}
                    >
                      <option value="Hot">Hot</option>
                      <option value="Warm">Warm</option>
                      <option value="Cold">Cold</option>
                    </select>
                  </td>

                  <td style={styles.td}>{lead.lastContact || "-"}</td>
                  <td style={styles.td}>{renderFollowUpCell(lead)}</td>
                  <td style={styles.td}>{lead.notes || "-"}</td>

                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button style={styles.editBtn} onClick={() => onEdit?.(lead)}>
                        Edit
                      </button>

                      <button style={styles.whatsBtn} onClick={() => openWhatsApp(lead.phone)}>
                        WhatsApp
                      </button>

                      <button style={styles.callBtn} onClick={() => makeCall(lead.phone)}>
                        Call
                      </button>

                      {onDelete ? (
                        <button style={styles.deleteBtn} onClick={() => onDelete(lead.id)}>
                          Delete
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    width: "100%",
  },
  quickFilterRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  quickBtn: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#162845",
    color: "#fff",
    borderRadius: 999,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  quickBtnActive: {
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: 999,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  quickBtnToday: {
    border: "none",
    background: "#d97706",
    color: "#fff",
    borderRadius: 999,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  quickBtnOverdue: {
    border: "none",
    background: "#dc2626",
    color: "#fff",
    borderRadius: 999,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
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
  filterSummaryBox: {
    background: "#0a1a36",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  filterSummaryTitle: {
    color: "#fff",
    fontWeight: 800,
    fontSize: 14,
    marginBottom: 10,
  },
  filterSummaryRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  filterPill: {
    background: "#162845",
    color: "#dce7ff",
    borderRadius: 999,
    padding: "7px 10px",
    fontSize: 12,
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
    minWidth: 1250,
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
  row: {
    transition: "background 0.2s ease",
  },
  td: {
    padding: "12px",
    color: "#fff",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    fontSize: 14,
    verticalAlign: "middle",
  },
  inlineSelect: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#0d1c37",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 10px",
    outline: "none",
  },
  followUpCell: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  todayBadge: {
    background: "#f59e0b",
    color: "#fff",
    borderRadius: 999,
    padding: "4px 8px",
    fontSize: 11,
    fontWeight: 700,
    display: "inline-flex",
  },
  overdueBadge: {
    background: "#dc2626",
    color: "#fff",
    borderRadius: 999,
    padding: "4px 8px",
    fontSize: 11,
    fontWeight: 700,
    display: "inline-flex",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  emptyBox: {
    border: "1px dashed rgba(255,255,255,0.14)",
    borderRadius: 14,
    padding: 18,
    color: "#c9d8f5",
    textAlign: "center",
    background: "#07142c",
  },
  emptyStateBox: {
    border: "1px dashed rgba(255,255,255,0.14)",
    borderRadius: 18,
    padding: "28px 20px",
    color: "#c9d8f5",
    textAlign: "center",
    background: "linear-gradient(180deg, #07142c, #0a1a36)",
  },
  emptyStateIcon: {
    width: 56,
    height: 56,
    margin: "0 auto 14px",
    borderRadius: 999,
    background: "#162845",
    color: "#8db8ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    fontWeight: 900,
  },
  emptyStateTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: 800,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#c9d8f5",
    lineHeight: 1.7,
    maxWidth: 520,
    margin: "0 auto",
  },
  mobileList: {
    display: "grid",
    gap: 12,
  },
  mobileCard: {
    background: "#07142c",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 14,
    display: "grid",
    gap: 12,
  },
  mobileTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  mobileCompany: {
    fontSize: 16,
    fontWeight: 800,
    color: "#fff",
    marginBottom: 4,
  },
  mobileContact: {
    fontSize: 13,
    color: "#c9d8f5",
  },
  mobileOwnerBox: {
    background: "#162845",
    color: "#fff",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  mobileInfoGrid: {
    display: "grid",
    gap: 10,
  },
  mobileInfoItem: {
    display: "grid",
    gap: 4,
  },
  mobileInfoLabel: {
    fontSize: 11,
    color: "#8ea9d6",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  mobileInfoValue: {
    fontSize: 14,
    color: "#fff",
  },
  mobileSelects: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  mobileSelect: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#0d1c37",
    color: "#fff",
    borderRadius: 10,
    padding: "10px 12px",
    outline: "none",
  },
  mobileNotesBox: {
    display: "grid",
    gap: 6,
  },
  mobileNotesText: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 1.5,
    background: "#0d1c37",
    borderRadius: 10,
    padding: "10px 12px",
  },
  mobileActions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  editBtn: {
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  whatsBtn: {
    border: "none",
    background: "#16a34a",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  callBtn: {
    border: "none",
    background: "#9333ea",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },
  deleteBtn: {
    border: "none",
    background: "#dc2626",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 12px",
    cursor: "pointer",
    fontWeight: 700,
  },
};