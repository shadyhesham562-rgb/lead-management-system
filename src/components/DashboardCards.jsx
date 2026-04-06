function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

function getPercent(count, total) {
  if (!total) return "0%";
  return `${(count / total) * 100}%`;
}

function ProgressRow({ label, count, total, color }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={styles.rowTop}>
        <span>{label}</span>
        <span>{count}</span>
      </div>

      <div style={styles.track}>
        <div
          style={{
            ...styles.fill,
            width: getPercent(count, total),
            background: color,
          }}
        />
      </div>
    </div>
  );
}

export default function DashboardCards({ leads }) {
  const today = getTodayString();

  const totalLeads = leads.length;
  const hotLeads = leads.filter((lead) => lead.priority === "Hot").length;
  const newLeads = leads.filter((lead) => lead.status === "New").length;
  const followUpToday = leads.filter(
    (lead) => lead.nextFollowUp && lead.nextFollowUp === today
  ).length;
  const overdueLeads = leads.filter(
    (lead) => lead.nextFollowUp && lead.nextFollowUp < today
  ).length;

  const newStatus = leads.filter((lead) => lead.status === "New").length;
  const interestedStatus = leads.filter(
    (lead) => lead.status === "Interested"
  ).length;
  const followUpStatus = leads.filter(
    (lead) => lead.status === "Follow Up"
  ).length;

  const hotPriority = leads.filter((lead) => lead.priority === "Hot").length;
  const warmPriority = leads.filter((lead) => lead.priority === "Warm").length;
  const coldPriority = leads.filter((lead) => lead.priority === "Cold").length;

  return (
    <>
      <div style={styles.cardsGrid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Total Leads</div>
          <div style={styles.cardValue}>{totalLeads}</div>
        </div>

        <div style={{ ...styles.card, ...styles.hotCard }}>
          <div style={styles.cardTitle}>Hot Leads</div>
          <div style={styles.cardValue}>{hotLeads}</div>
        </div>

        <div style={{ ...styles.card, ...styles.blueCard }}>
          <div style={styles.cardTitle}>New Leads</div>
          <div style={styles.cardValue}>{newLeads}</div>
        </div>

        <div style={{ ...styles.card, ...styles.orangeCard }}>
          <div style={styles.cardTitle}>Follow-up Today</div>
          <div style={styles.cardValue}>{followUpToday}</div>
        </div>

        <div style={{ ...styles.card, ...styles.redCard }}>
          <div style={styles.cardTitle}>Overdue Leads</div>
          <div style={styles.cardValue}>{overdueLeads}</div>
        </div>
      </div>

      <div style={styles.chartsGrid}>
        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Leads by Status</h3>

          <ProgressRow
            label="New"
            count={newStatus}
            total={totalLeads}
            color="#4f8cff"
          />
          <ProgressRow
            label="Interested"
            count={interestedStatus}
            total={totalLeads}
            color="#8b5cf6"
          />
          <ProgressRow
            label="Follow Up"
            count={followUpStatus}
            total={totalLeads}
            color="#f59e0b"
          />
        </div>

        <div style={styles.chartBox}>
          <h3 style={styles.chartTitle}>Leads by Priority</h3>

          <ProgressRow
            label="Hot"
            count={hotPriority}
            total={totalLeads}
            color="#ef4444"
          />
          <ProgressRow
            label="Warm"
            count={warmPriority}
            total={totalLeads}
            color="#f59e0b"
          />
          <ProgressRow
            label="Cold"
            count={coldPriority}
            total={totalLeads}
            color="#38bdf8"
          />
        </div>
      </div>
    </>
  );
}

const styles = {
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 14,
    marginBottom: 16,
  },
  card: {
    background: "#0a1a36",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 16,
    minHeight: 90,
  },
  hotCard: {
    background: "#3d1920",
  },
  blueCard: {
    background: "#18345f",
  },
  orangeCard: {
    background: "#5b3a08",
  },
  redCard: {
    background: "#5b1716",
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 12,
    color: "#eef4ff",
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 700,
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 16,
  },
  chartBox: {
    background: "#0a1a36",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 16,
  },
  chartTitle: {
    margin: "0 0 16px",
    fontSize: 16,
  },
  rowTop: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    marginBottom: 6,
    color: "#eef4ff",
  },
  track: {
    height: 6,
    borderRadius: 999,
    overflow: "hidden",
    background: "rgba(255,255,255,0.08)",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
};