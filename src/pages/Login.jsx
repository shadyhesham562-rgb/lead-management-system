import { useState } from "react";
import { supabase } from "../supabaseClient";

const ALLOWED_EMAILS = [
  "evelinmikhail95@gmail.com",
  "faizaaahaitham@gmail.com",
  "hadyhaithm5@gmail.com",
  "hebasabry961@gmail.com",
  "inn360.co@gmail.com",
  "shadyhesham562@gmail.com",
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setMessage("Email is required");
      setLoading(false);
      return;
    }

    if (!cleanPassword) {
      setMessage("Password is required");
      setLoading(false);
      return;
    }

    if (!ALLOWED_EMAILS.includes(cleanEmail)) {
      setMessage("This email is not allowed to access this CRM.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.overlay} />

      <div style={styles.wrapper}>
        <div style={styles.leftPanel}>
          <div style={styles.brandBlock}>
            <div style={styles.brandTop}>
              <div style={styles.logo}>INN</div>
              <div>
                <h1 style={styles.brandTitle}>INN CRM</h1>
                <p style={styles.brandSubtitle}>
                  Smart lead management for your sales team
                </p>
              </div>
            </div>

            <div style={styles.heroCard}>
              <div style={styles.heroBadge}>Private Team Access</div>
              <h2 style={styles.heroTitle}>
                Manage leads, track follow-ups, and keep your team organized.
              </h2>
              <p style={styles.heroText}>
                A clean internal workspace for authorized INN team members only.
              </p>

              <div style={styles.featureGrid}>
                <div style={styles.featureCard}>
                  <div style={styles.featureNumber}>01</div>
                  <div style={styles.featureLabel}>Lead Tracking</div>
                </div>

                <div style={styles.featureCard}>
                  <div style={styles.featureNumber}>02</div>
                  <div style={styles.featureLabel}>Team Access</div>
                </div>

                <div style={styles.featureCard}>
                  <div style={styles.featureNumber}>03</div>
                  <div style={styles.featureLabel}>Follow-up Flow</div>
                </div>

                <div style={styles.featureCard}>
                  <div style={styles.featureNumber}>04</div>
                  <div style={styles.featureLabel}>Secure Login</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.rightPanel}>
          <div style={styles.loginCard}>
            <div style={styles.loginHeader}>
              <div style={styles.loginMiniLogo}>INN</div>
              <h2 style={styles.loginTitle}>Welcome Back</h2>
              <p style={styles.loginSubtitle}>
                Sign in with your authorized team email
              </p>
            </div>

            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  style={styles.input}
                  type="email"
                  placeholder="name@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <input
                  style={styles.input}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button style={styles.primaryBtn} type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            {message ? <div style={styles.message}>{message}</div> : null}

            <div style={styles.footerNote}>
              Authorized accounts only · INN Internal CRM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at top left, #16356f 0%, #09172f 38%, #05101f 100%)",
    color: "#fff",
    padding: 24,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.10), rgba(245,158,11,0.06), rgba(5,16,31,0.2))",
    pointerEvents: "none",
  },
  wrapper: {
    position: "relative",
    zIndex: 1,
    minHeight: "calc(100vh - 48px)",
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: 24,
    alignItems: "center",
  },
  leftPanel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandBlock: {
    width: "100%",
    maxWidth: 760,
  },
  brandTop: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  logo: {
    fontSize: 54,
    fontWeight: 900,
    letterSpacing: "4px",
    lineHeight: 1,
    color: "#ffffff",
  },
  brandTitle: {
    margin: 0,
    fontSize: 40,
    fontWeight: 800,
    lineHeight: 1.1,
  },
  brandSubtitle: {
    margin: "8px 0 0",
    color: "#d4def6",
    fontSize: 16,
  },
  heroCard: {
    background: "rgba(10, 26, 54, 0.72)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 24,
    padding: 28,
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    backdropFilter: "blur(10px)",
  },
  heroBadge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: 999,
    background: "rgba(37,99,235,0.18)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "#dbeafe",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 18,
  },
  heroTitle: {
    margin: 0,
    fontSize: 34,
    lineHeight: 1.25,
    fontWeight: 800,
    maxWidth: 620,
  },
  heroText: {
    margin: "16px 0 0",
    fontSize: 16,
    color: "#c9d8f5",
    lineHeight: 1.7,
    maxWidth: 620,
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
    marginTop: 26,
  },
  featureCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 18,
  },
  featureNumber: {
    fontSize: 14,
    fontWeight: 800,
    color: "#93c5fd",
    marginBottom: 8,
  },
  featureLabel: {
    fontSize: 16,
    fontWeight: 700,
  },
  rightPanel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginCard: {
    width: "100%",
    maxWidth: 430,
    background: "rgba(10, 26, 54, 0.82)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 24,
    padding: 28,
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
    backdropFilter: "blur(10px)",
  },
  loginHeader: {
    marginBottom: 20,
  },
  loginMiniLogo: {
    fontSize: 26,
    fontWeight: 900,
    letterSpacing: "2px",
    marginBottom: 14,
  },
  loginTitle: {
    margin: 0,
    fontSize: 30,
    fontWeight: 800,
  },
  loginSubtitle: {
    margin: "8px 0 0",
    color: "#c9d8f5",
    fontSize: 14,
    lineHeight: 1.6,
  },
  form: {
    display: "grid",
    gap: 14,
  },
  inputGroup: {
    display: "grid",
    gap: 8,
  },
  label: {
    fontSize: 13,
    color: "#dbeafe",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#07142c",
    color: "#fff",
    borderRadius: 12,
    padding: "13px 14px",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  },
  primaryBtn: {
    marginTop: 4,
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#fff",
    borderRadius: 12,
    padding: "14px 16px",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: 15,
  },
  message: {
    marginTop: 14,
    background: "rgba(127,29,29,0.85)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: 12,
    borderRadius: 12,
    fontSize: 14,
    lineHeight: 1.5,
  },
  footerNote: {
    marginTop: 18,
    color: "#9fb4da",
    fontSize: 12,
    textAlign: "center",
  },
};