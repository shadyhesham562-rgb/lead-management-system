import { useEffect, useState } from "react";

const STORAGE_KEY = "crm_onboarding_seen_v1";

export default function WelcomeGuide({ currentRole = "sales", displayName = "User" }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      setVisible(true);
    }
  }, []);

  function handleClose() {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={styles.wrapper}>
      <div style={styles.topRow}>
        <div>
          <div style={styles.badge}>First Time Guide</div>
          <div style={styles.title}>Welcome, {displayName}</div>
          <div style={styles.subtitle}>
            Here is the fastest way to start using the CRM correctly.
          </div>
        </div>

        <button style={styles.closeBtn} onClick={handleClose}>
          ✕
        </button>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.step}>1</div>
          <div>
            <div style={styles.cardTitle}>Add Leads</div>
            <div style={styles.cardText}>
              Start by adding leads manually from the Add Lead button.
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.step}>2</div>
          <div>
            <div style={styles.cardTitle}>Follow Up Daily</div>
            <div style={styles.cardText}>
              Watch Today and Overdue sections to know what needs action first.
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.step}>3</div>
          <div>
            <div style={styles.cardTitle}>Use Filters Fast</div>
            <div style={styles.cardText}>
              Search, owner filter, and quick filters help you find work quickly.
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.step}>4</div>
          <div>
            <div style={styles.cardTitle}>
              {currentRole === "admin" ? "Admin Access" : "Sales Access"}
            </div>
            <div style={styles.cardText}>
              {currentRole === "admin"
                ? "You can manage the team, export data, and delete leads."
                : "You can view, add, and update leads as part of the team workflow."}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <button style={styles.primaryBtn} onClick={handleClose}>
          Got it
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "linear-gradient(135deg, #0f1f3f, #0a1a36)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  badge: {
    display: "inline-block",
    padding: "7px 10px",
    borderRadius: 999,
    background: "rgba(59,130,246,0.16)",
    color: "#dbeafe",
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 900,
    color: "#fff",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#c9d8f5",
    lineHeight: 1.7,
    maxWidth: 700,
  },
  closeBtn: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#162845",
    color: "#fff",
    width: 38,
    height: 38,
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 16,
    flexShrink: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 12,
  },
  card: {
    background: "#07142c",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: 14,
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  step: {
    minWidth: 34,
    height: 34,
    borderRadius: 999,
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 14,
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: "#fff",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 13,
    color: "#c9d8f5",
    lineHeight: 1.7,
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  primaryBtn: {
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: 10,
    padding: "11px 16px",
    cursor: "pointer",
    fontWeight: 800,
  },
};