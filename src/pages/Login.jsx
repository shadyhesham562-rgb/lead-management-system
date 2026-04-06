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
      <div style={styles.goldGlowTop} />
      <div style={styles.goldGlowBottom} />
      <div style={styles.noise} />

      <div style={styles.wrapper}>
        <div style={styles.leftSide}>
          <div style={styles.brandRow}>
            <div style={styles.logo}>INN</div>

            <div>
              <div style={styles.brandName}>INN CRM</div>
              <div style={styles.brandSub}>
                Exclusive internal workspace for premium lead management
              </div>
            </div>
          </div>

          <div style={styles.heroCard}>
            <div style={styles.badge}>Luxury Internal Access</div>

            <h1 style={styles.heroTitle}>
              Premium CRM experience for high-control lead management.
            </h1>

            <p style={styles.heroText}>
              A refined black-and-gold workspace built for authorized INN team
              members to manage leads, follow-ups, and sales flow with clarity.
            </p>

            <div style={styles.featureGrid}>
              <div style={styles.featureCard}>
                <div style={styles.featureTitle}>Private Access</div>
                <div style={styles.featureText}>
                  Restricted access for approved team accounts only.
                </div>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureTitle}>Elegant Workflow</div>
                <div style={styles.featureText}>
                  Cleaner structure for daily lead handling and follow-up.
                </div>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureTitle}>Focused Visibility</div>
                <div style={styles.featureText}>
                  A premium dashboard experience with less clutter and more control.
                </div>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureTitle}>Secure Operations</div>
                <div style={styles.featureText}>
                  Designed for internal use with controlled login access.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.rightSide}>
          <div style={styles.loginCard}>
            <div style={styles.topGoldLine} />
            <div style={styles.loginMiniLogo}>INN</div>

            <h2 style={styles.loginTitle}>Welcome Back</h2>
            <p style={styles.loginSubtitle}>
              Sign in using your authorized team account
            </p>

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
              Authorized accounts only · INN Premium CRM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const gold = "#d4af37";
const softGold = "#f3d27a";
const darkGold = "#8f6a17";

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background:
      "radial-gradient(circle at top left, rgba(212,175,55,0.10), transparent 24%), linear-gradient(135deg, #050505 0%, #0a0a0a 45%, #12100b 100%)",
    color: "#f8f4ea",
    padding: 24,
  },
  goldGlowTop: {
    position: "absolute",
    top: -120,
    left: -100,
    width: 420,
    height: 420,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(212,175,55,0.22), transparent 68%)",
    filter: "blur(26px)",
    pointerEvents: "none",
  },
  goldGlowBottom: {
    position: "absolute",
    bottom: -160,
    right: -120,
    width: 520,
    height: 520,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(243,210,122,0.12), transparent 70%)",
    filter: "blur(30px)",
    pointerEvents: "none",
  },
  noise: {
    position: "absolute",
    inset: 0,
    opacity: 0.05,
    pointerEvents: "none",
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
    backgroundSize: "42px 42px",
  },
  wrapper: {
    position: "relative",
    zIndex: 1,
    minHeight: "calc(100vh - 48px)",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 30,
  },
  leftSide: {
    flex: "1 1 720px",
    minWidth: 320,
  },
  rightSide: {
    flex: "0 1 450px",
    minWidth: 320,
    display: "flex",
    justifyContent: "center",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    marginBottom: 28,
  },
  logo: {
    fontSize: 64,
    fontWeight: 900,
    letterSpacing: "6px",
    lineHeight: 1,
    color: softGold,
    textShadow: "0 0 24px rgba(212,175,55,0.18)",
  },
  brandName: {
    fontSize: 32,
    fontWeight: 900,
    color: "#fff7dc",
    marginBottom: 6,
  },
  brandSub: {
    fontSize: 16,
    color: "#d9cfb3",
  },
  heroCard: {
    maxWidth: 860,
    background: "linear-gradient(145deg, rgba(18,18,18,0.92), rgba(8,8,8,0.82))",
    border: "1px solid rgba(212,175,55,0.22)",
    borderRadius: 30,
    padding: 34,
    boxShadow: "0 30px 90px rgba(0,0,0,0.42)",
    backdropFilter: "blur(12px)",
  },
  badge: {
    display: "inline-block",
    padding: "10px 16px",
    borderRadius: 999,
    background: "rgba(212,175,55,0.10)",
    border: "1px solid rgba(212,175,55,0.24)",
    color: "#f6e6ae",
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "0.4px",
    marginBottom: 22,
  },
  heroTitle: {
    margin: 0,
    fontSize: 38,
    fontWeight: 900,
    lineHeight: 1.25,
    maxWidth: 720,
    color: "#fff8e5",
  },
  heroText: {
    margin: "18px 0 0",
    fontSize: 17,
    lineHeight: 1.8,
    color: "#d2c6a8",
    maxWidth: 730,
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
    marginTop: 28,
  },
  featureCard: {
    background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
    border: "1px solid rgba(212,175,55,0.14)",
    borderRadius: 20,
    padding: 20,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: "#f8e4a1",
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "#cdbf99",
  },
  loginCard: {
    width: "100%",
    maxWidth: 440,
    background: "linear-gradient(180deg, rgba(14,14,14,0.95), rgba(8,8,8,0.92))",
    border: "1px solid rgba(212,175,55,0.24)",
    borderRadius: 30,
    padding: 32,
    boxShadow: "0 30px 90px rgba(0,0,0,0.46)",
    backdropFilter: "blur(14px)",
    position: "relative",
    overflow: "hidden",
  },
  topGoldLine: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    height: 3,
    borderRadius: 999,
    background: `linear-gradient(90deg, transparent, ${gold}, ${softGold}, transparent)`,
  },
  loginMiniLogo: {
    fontSize: 32,
    fontWeight: 900,
    letterSpacing: "4px",
    marginBottom: 18,
    color: softGold,
  },
  loginTitle: {
    margin: 0,
    fontSize: 34,
    fontWeight: 900,
    lineHeight: 1.15,
    color: "#fff8e5",
  },
  loginSubtitle: {
    margin: "10px 0 0",
    color: "#d1c39d",
    fontSize: 15,
    lineHeight: 1.7,
    marginBottom: 26,
  },
  form: {
    display: "grid",
    gap: 16,
  },
  inputGroup: {
    display: "grid",
    gap: 9,
  },
  label: {
    fontSize: 14,
    color: "#f3df9b",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    border: "1px solid rgba(212,175,55,0.16)",
    background: "rgba(5,5,5,0.74)",
    color: "#fff",
    borderRadius: 14,
    padding: "15px 16px",
    outline: "none",
    fontSize: 15,
    boxSizing: "border-box",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  },
  primaryBtn: {
    marginTop: 8,
    border: "none",
    background: `linear-gradient(135deg, ${gold}, ${darkGold})`,
    color: "#120f06",
    borderRadius: 14,
    padding: "15px 16px",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 16,
    boxShadow: "0 16px 32px rgba(212,175,55,0.20)",
  },
  message: {
    marginTop: 16,
    background: "rgba(90, 25, 15, 0.82)",
    border: "1px solid rgba(212,175,55,0.16)",
    padding: 13,
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.6,
    color: "#fff3d6",
  },
  footerNote: {
    marginTop: 20,
    color: "#a69569",
    fontSize: 12,
    textAlign: "center",
    letterSpacing: "0.2px",
  },
};