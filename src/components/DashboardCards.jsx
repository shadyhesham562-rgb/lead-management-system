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
          style={type === "overdue" ? styles.overdueBadge : styles.todayBadge}
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
        <span>Follow-up: {formatDate(lead.nextFollowUp)}</span>
      </div>

      {lead.notes ? <div style={styles.alertNotes}>{lead.notes}</div> : null}
    </div>
  );
}

function TeamStatCard({ name, total, hot, today, overdue }) {
  return (
    <div style={styles.teamCard}>
      <div style={styles.teamName}>{name || "Unknown"}</div>

      <div style={styles.teamStatsGrid}>
        <div style={styles.teamStatBox}>
          <div style={styles.teamStatLabel}>Total</div>
          <div style={styles.teamStatValue}>{total}</div>
        </div>

        <div style={styles.teamStatBox}>
          <div style={styles.teamStatLabel}>Hot</div>
          <div style={styles.teamStatValue}>{hot}</div>
        </div>

        <div style={styles.teamStatBox}>
          <div style={styles.teamStatLabel}>Today</div>
          <div style={styles.teamStatValue}>{today}</div>
        </div>

        <div style={styles.teamStatBox}>
          <div style={styles.teamStatLabel}>Overdue</div>
          <div style={styles.teamStatValue}>{overdue}</div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardCards({ leads = [] }) {
  const today = getTodayString();

  const totalLeads = leads.length;
  const hotLeads = leads.filter((lead) => lead.priority === "Hot").length;
  const newLeads = leads.filter((lead) => lead.status === "New").length;
  const interestedLeads = leads.filter(
    (lead) => lead.status === "Interested"
  ).length;

  const todayLeads = leads.filter(
    (lead) => lead.nextFollowUp && lead.nextFollowUp === today
  );

  const overdueLeads = leads.filter(
    (lead) => lead.nextFollowUp && lead.nextFollowUp < today
  );

  const teamStatsMap = {};

  leads.forEach((lead) => {
    const owner = lead.ownerName || "Unknown";

    if (!teamStatsMap[owner]) {
      teamStatsMap[owner] = {
        name: owner,
        total: 0,
        hot: 0,
        today: 0,
        overdue: 0,
      };
    }

    teamStatsMap[owner].total += 1;

    if (lead.priority === "Hot") {
      teamStatsMap[owner].hot += 1;
    }

    if (lead.nextFollowUp === today) {
      teamStatsMap[owner].today += 1;
    }

    if (lead.nextFollowUp && lead.nextFollowUp < today) {
      teamStatsMap[owner].overdue += 1;
    }
  });

  const teamStats = Object.values(teamStatsMap).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

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

      <div style={styles.teamSection}>
        <div style={styles.sectionHeader}>
          <div>
            <div style={styles.sectionTitle}>Team Performance</div>
            <div style={styles.sectionSubtitle}>
              Leads distribution and follow-up load per owner
            </div>
          </div>
        </div>

        <div style={styles.teamGrid}>
          {teamStats.length === 0 ? (
            <EmptyState text="No team stats available yet" />
          ) : (
            teamStats.map((member) => (
              <TeamStatCard
                key={member.name}
                name={member.name}
                total={member.total}
                hot={member.hot}
                today={member.today}
                overdue={member.overdue}
              />
            ))
          )}
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
  teamSection: {
    background: "#0a1a36",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#fff",
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#c9d8f5",
  },
  teamGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  teamCard: {
    background: "#07142c",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 14,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 800,
    color: "#fff",
    marginBottom: 12,
  },
  teamStatsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
  },
  teamStatBox: {
    background: "#102347",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 12,
  },
  teamStatLabel: {
    fontSize: 12,
    color: "#c9d8f5",
    marginBottom: 6,
  },
  teamStatValue: {
    fontSize: 18,
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