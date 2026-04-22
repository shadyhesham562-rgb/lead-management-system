export default function CreditSection() {
  return (
    <section style={styles.section}>
      <div style={styles.logoWrap}>
        <img
          src="/inn-logo.png"
          alt="INN Agency Logo"
          style={styles.logo}
        />
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>Technical Support & Development</h2>

        <p style={styles.text}>
          This platform was designed and developed by <strong>Shady Hesham</strong> at <strong>INN Agency</strong>.
        </p>

        <p style={styles.textSmall}>
          For technical support, updates, or similar project inquiries:
        </p>

        <a href="mailto:YOUR-EMAIL@DOMAIN.COM" style={styles.email}>
          YOUR-EMAIL@DOMAIN.COM
        </a>
      </div>
    </section>
  );
}

const styles = {
  section: {
    background: "#071a3d",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "28px 24px",
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
    flexWrap: "wrap",
  },
  logoWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "140px",
  },
  logo: {
    width: "120px",
    maxWidth: "100%",
    height: "auto",
    objectFit: "contain",
    display: "block",
    background: "transparent",
  },
  content: {
    maxWidth: "760px",
    color: "#ffffff",
    textAlign: "left",
  },
  title: {
    margin: "0 0 10px",
    fontSize: "24px",
    fontWeight: "700",
    lineHeight: "1.3",
    color: "#ffffff",
  },
  text: {
    margin: "0 0 8px",
    fontSize: "16px",
    lineHeight: "1.6",
    color: "rgba(255,255,255,0.92)",
  },
  textSmall: {
    margin: "0 0 8px",
    fontSize: "15px",
    lineHeight: "1.5",
    color: "rgba(255,255,255,0.78)",
  },
  email: {
    display: "inline-block",
    marginTop: "4px",
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "700",
    textDecoration: "none",
  },
};