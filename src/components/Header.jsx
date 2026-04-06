export default function Header({ onLogout, userLabel = "SH" }) {
  return (
    <div style={styles.wrapper}>
      <div>
        <h1 style={styles.title}>Lead Management System</h1>
        <p style={styles.subtitle}>CRM Dashboard for Sales Follow-up</p>
      </div>

      <div style={styles.rightSide}>
        <button style={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>

        <div style={styles.avatar}>{userLabel}</div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    background: "#0a1a36",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
  },
  subtitle: {
    margin: "8px 0 0",
    color: "#d3def5",
    fontSize: 14,
  },
  rightSide: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logoutBtn: {
    border: "none",
    background: "#e53935",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    background: "#f4f1ec",
    color: "#1b2c5a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    border: "1px solid rgba(255,255,255,0.2)",
  },
};