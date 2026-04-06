function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(value) {
  if (!value) return "-";
  return value;
}

function EmptyState({ text }) {
  return <div style={styles.emptyState}>{text}</div>;
}

function LeadAlertItem({ lead, type }) {
  return (
    <div style={styles.alertItem}>
      <div style={styles.alertTop}>
        <div style={styles.alertCompany}>{lead.company || "No Company"}</div>
        <div
          style={
            type === "overdue" ? styles.overdueBadge : styles.todayBadge
          }
        >
          {type === "overdue" ? "Overdue" : "Today"}
        </div>
      </div>

      <div style={styles.alertMeta}>
        <span>{lead.contact || "-"}</span>
        <span>•</span>
        <span>{lead.phone || "-"}</span>
      </div>

      <div style={styles.alertMeta}>
        <span>Owner: {lead.ownerName || "Unknown"}</span>
        <span>•</span>
        <span>
          Follow-up: {formatDate(lead.nextFollowUp)}
        </span>
      </div>

      {lead.notes ? <div style={styles.alertNotes}>{lead.notes}</div> : null}
    </div>
  );
}

export default function DashboardCards({ leads = [] }) {
  const today = getTodayString();

  const totalLeads = leads.length;
  const hotLeads = leads.filter((lead) => lead.priority === "Hot").length;
  const newLeads = leads.filter((lead) => lead.status === "New").length;

  const todayLeads = leads.filter(
    (lead) => lead.nextFollowUp && lead.nextFollowUp === today
  );

  const overdueLeads = leads.filter(
    (lead) => lead.nextFollowUp && lead.nextFollowUp < today
  );

  const interestedLeads = leads.filter(
    (lead) => lead.status === "Interested"
  ).length;

  return (
    <div style={styles.wrapper}>
      <div style={styles.cardsGrid}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Total Leads</div>
          <div style={styles.cardValue}>{totalLeads}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>New Leads</div>
          <div style={styles.cardValue}>{newLeads}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Interested</div>
          <div style={styles.cardValue}>{interestedLeads}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardLabel}>Hot Leads</div>
          <div style={styles.cardValue}>{hotLeads}</div>
        </div>

        <div style={styles.cardToday}>
          <div style={styles.cardLabel}>Follow-up Today</div>
          <div style={styles.cardValue}>{todayLeads.length}</div>
        </div>

        <div style={styles.cardOverdue}>
          <div style={styles.cardLabel}>Overdue Leads</div>
          <div style={styles.cardValue}>{overdueLeads.length}</div>
        </div>
      </div>

      <div style={styles.alertsGrid}>
        <div style={styles.alertBox}>
          <div style={styles.alertHeader}>
            <div>
              <div style={styles.alertTitle}>Follow-up Today</div>
              <div style={styles.alertSubtitle}>
                Leads that need action today
              </div>
            </div>

            <div style={styles.countPill}>{todayLeads.length}</div>
          </div>

          <div style={styles.alertList}>
            {todayLeads.length === 0 ? (
              <EmptyState text="No follow-ups scheduled for today" />
            ) : (
              todayLeads.map((lead) => (
                <LeadAlertItem key={lead.id} lead={lead} type="today" />
              ))
            )}
          </div>
        </div>

        <div style={styles.alertBox}>
          <div style={styles.alertHeader}>
            <div>
              <div style={styles.alertTitle}>Overdue Leads</div>
              <div style={styles.alertSubtitle}>
                Leads with missed follow-up dates
              </div>
            </div>

            <div style={styles.countPillDanger}>{overdueLeads.length}</div>
          </div>

          <div style={styles.alertList}>
            {overdueLeads.length === 0 ? (
              <EmptyState text="No overdue leads right now" />
            ) : (
              overdueLeads.map((lead) => (
                <LeadAlertItem key={lead.id} lead={lead} type="overdue" />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "grid",
    gap: 16,
    marginBottom: 16,
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 12,
  },
  card: {
    background: "#0a1a36",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 16,
  },
  cardToday: {
    background: "#5b3a08",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 16,
  },
  cardOverdue: {
    background: "#5b1716",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: 16,
  },
  cardLabel: {
    fontSize: 13,
    color: "#d8e5ff",
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 800,
    color: "#fff",
  },
  alertsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  alertBox: {
    background: "#0a1a36",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 16,
    minHeight: 260,
  },
  alertHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#fff",
  },
  alertSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#c9d8f5",
  },
  countPill: {
    minWidth: 38,
    height: 38,
    borderRadius: 999,
    background: "#f59e0b",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 14,
    padding: "0 10px",
  },
  countPillDanger: {
    minWidth: 38,
    height: 38,
    borderRadius: 999,
    background: "#dc2626",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 14,
    padding: "0 10px",
  },
  alertList: {
    display: "grid",
    gap: 12,
  },
  alertItem: {
    background: "#07142c",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 14,
  },
  alertTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  alertCompany: {
    fontSize: 15,
    fontWeight: 800,
    color: "#fff",
  },
  todayBadge: {
    background: "#f59e0b",
    color: "#fff",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 700,
  },
  overdueBadge: {
    background: "#dc2626",
    color: "#fff",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 700,
  },
  alertMeta: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    fontSize: 12,
    color: "#c9d8f5",
    marginBottom: 6,
  },
  alertNotes: {
    marginTop: 8,
    fontSize: 13,
    color: "#eef4ff",
    lineHeight: 1.6,
  },
  emptyState: {
    border: "1px dashed rgba(255,255,255,0.14)",
    borderRadius: 14,
    padding: 16,
    color: "#c9d8f5",
    fontSize: 14,
  },
};