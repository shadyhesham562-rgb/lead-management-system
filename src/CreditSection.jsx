export default function CreditSection() {
  return (
    <section style={styles.section}>
      <div style={styles.logoBox}>
        <img
          src="/inn-logo.png"
          alt="INN Agency Logo"
          style={styles.logo}
        />
      </div>

      <div style={styles.content}>
        <h2 style={styles.title}>Technical Support & Development</h2>

        <p style={styles.text}>
          This platform was designed and developed by{" "}
          <strong>Shady Hesham</strong> at <strong>INN Agency</strong>.
        </p>

        <p style={styles.text}>
          For technical support, updates, or similar project inquiries:
        </p>

        <a href="mailto:shadyhesham562@gmail.com" style={styles.email}>
          yourmail@domain.com
        </a>
      </div>
    </section>
  );
}

const styles = {
  section: {
    background: "#1f6f50",
    borderRadius: "20px",
    padding: "40px 30px",
    marginTop: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "40px",
    flexWrap: "wrap",
  },
  logoBox: {
    background: "#fff",
    borderRadius: "20px",
    padding: "20px",
    minWidth: "180px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "140px",
    maxWidth: "100%",
    height: "auto",
  },
  content: {
    maxWidth: "700px",
    color: "#fff",
  },
  title: {
    margin: "0 0 16px",
    fontSize: "34px",
    fontWeight: "700",
  },
  text: {
    margin: "0 0 14px",
    fontSize: "20px",
    lineHeight: "1.7",
  },
  email: {
    display: "inline-block",
    marginTop: "10px",
    color: "#fff",
    fontSize: "24px",
    fontWeight: "700",
    textDecoration: "none",
  },
};