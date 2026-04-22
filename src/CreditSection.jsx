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

        <a href="mailto:shadyhesham562@gmail.com" style={styles.email}>
          shadyhesham562@gmail.com
        </a>
      </div>
    </section>
  );
}

const styles = {
  section: {
    background: "#0b234f",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "20px",
    padding: "34px 28px",
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "28px",
    flexWrap: "wrap",
  },
  logoWrap: {
    minWidth: "170px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "170px",
    maxWidth: "100%",
    height: "auto",
    objectFit: "contain",
    display: "block",
  },
  content: {
    maxWidth: "760px",
    color: "#ffffff",
    textAlign: "left",
  },
  title: {
    margin: "0 0 12px",
    fontSize: "34px",
    fontWeight: "700",
    lineHeight: "1.3",
    color: "#ffffff",
  },
  text: {
    margin: "0 0 10px",
    fontSize: "21px",
    lineHeight: "1.7",
    color: "rgba(255,255,255,0.95)",
  },
  textSmall: {
    margin: "0 0 10px",
    fontSize: "18px",
    lineHeight: "1.6",
    color: "rgba(255,255,255,0.82)",
  },
  email: {
    display: "inline-block",
    marginTop: "6px",
    color: "#ffffff",
    fontSize: "24px",
    fontWeight: "700",
    textDecoration: "none",
  },
};