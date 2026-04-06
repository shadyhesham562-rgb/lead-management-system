export default function Header({ onLogout }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.left}>
        <div style={styles.logoText}>INN</div>

        <div>
          <h1 style={styles.title}>Lead Management System</h1>
          <p style={styles.subtitle}>CRM Dashboard for Sales Follow-up</p>
        </div>
      </div>

      <button style={styles.logoutBtn} onClick={onLogout}>
        Logout
      </button>
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
  left: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    flexWrap: "wrap",
  },
  logoText: {
    fontSize: 38,
    fontWeight: 900,
    letterSpacing: "2px",
    color: "#ffffff",
    lineHeight: 1,
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
  logoutBtn: {
    border: "none",
    background: "#e53935",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
};