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
      <div style={styles.bgGlowOne} />
      <div style={styles.bgGlowTwo} />
      <div style={styles.bgGrid} />

      <div style={styles.wrapper}>
        <div style={styles.leftSide}>
          <div style={styles.brandRow}>
            <div style={styles.logo}>INN</div>

            <div>
              <div style={styles.brandName}>INN CRM</div>
              <div style={styles.brandSub}>
                Private lead management workspace for your team
              </div>
            </div>
          </div>

          <div style={styles.heroCard}>
            <div style={styles.badge}>Internal Team Portal</div>

            <h1 style={styles.heroTitle}>
              A cleaner way to manage leads, follow-ups, and daily sales flow.
            </h1>

            <p style={styles.heroText}>
              Built for authorized INN users with a focused workspace, secure
              access, and a smooth CRM experience.
            </p>

            <div style={styles.pillRow}>
              <div style={styles.pill}>Lead Tracking</div>
              <div style={styles.pill}>Private Access</div>
              <div style={styles.pill}>Follow-up Flow</div>
            </div>

            <div style={styles.featurePanel}>
              <div style={styles.featureCard}>
                <div style={styles.featureDot} />
                <div>
                  <div style={styles.featureTitle}>Focused Workspace</div>
                  <div style={styles.featureText}>
                    Keep your team working in one simple and organized place.
                  </div>
                </div>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureDot} />
                <div>
                  <div style={styles.featureTitle}>Authorized Access</div>
                  <div style={styles.featureText}>
                    Only approved accounts can reach the CRM and its data.
                  </div>
                </div>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureDot} />
                <div>
                  <div style={styles.featureTitle}>Sales Visibility</div>
                  <div style={styles.featureText}>
                    Track leads, update status, and keep follow-ups moving.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.rightSide}>
          <div style={styles.loginCard}>
            <div style={styles.loginTopLine} />
            <div style={styles.loginMiniLogo}>INN</div>

            <h2 style={styles.loginTitle}>Welcome Back</h2>
            <p style={styles.loginSubtitle}>
              Sign in with your authorized team email
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
      "linear-gradient(135deg, #061224 0%, #08182f 35%, #091329 70%, #030b16 100%)",
    color: "#fff",
    padding: 24,
  },
  bgGlowOne: {
    position: "absolute",
    top: -120,
    left: -80,
    width: 420,
    height: 420,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(37,99,235,0.30), transparent 68%)",
    filter: "blur(18px)",
    pointerEvents: "none",
  },
  bgGlowTwo: {
    position: "absolute",
    bottom: -140,
    right: -120,
    width: 460,
    height: 460,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)",
    filter: "blur(24px)",
    pointerEvents: "none",
  },
  bgGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
    backgroundSize: "36px 36px",
    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.45), transparent 95%)",
    pointerEvents: "none",
  },
  wrapper: {
    position: "relative",
    zIndex: 1,
    minHeight: "calc(100vh - 48px)",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 28,
  },
  leftSide: {
    flex: "1 1 700px",
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
    gap: 18,
    flexWrap: "wrap",
    marginBottom: 26,
  },
  logo: {
    fontSize: 62,
    fontWeight: 900,
    letterSpacing: "5px",
    lineHeight: 1,
    color: "#ffffff",
    textShadow: "0 6px 24px rgba(37,99,235,0.22)",
  },
  brandName: {
    fontSize: 30,
    fontWeight: 800,
    marginBottom: 6,
  },
  brandSub: {
    fontSize: 16,
    color: "#c7d7f3",
  },
  heroCard: {
    maxWidth: 860,
    background: "rgba(8, 24, 49, 0.72)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 28,
    padding: 32,
    boxShadow: "0 24px 80px rgba(0,0,0,0.30)",
    backdropFilter: "blur(12px)",
  },
  badge: {
    display: "inline-block",
    padding: "10px 16px",
    borderRadius: 999,
    background: "rgba(37,99,235,0.16)",
    border: "1px solid rgba(147,197,253,0.18)",
    color: "#dbeafe",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 20,
  },
  heroTitle: {
    margin: 0,
    fontSize: 34,
    fontWeight: 900,
    lineHeight: 1.3,
    maxWidth: 720,
  },
  heroText: {
    margin: "16px 0 0",
    fontSize: 17,
    lineHeight: 1.8,
    color: "#c7d7f3",
    maxWidth: 720,
  },
  pillRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 24,
    marginBottom: 24,
  },
  pill: {
    padding: "10px 16px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: 14,
    fontWeight: 700,
    color: "#e7efff",
  },
  featurePanel: {
    display: "grid",
    gap: 14,
  },
  featureCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 18,
  },
  featureDot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    marginTop: 7,
    background: "linear-gradient(135deg, #60a5fa, #2563eb)",
    boxShadow: "0 0 18px rgba(96,165,250,0.55)",
    flexShrink: 0,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 6,
  },
  featureText: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "#c7d7f3",
  },
  loginCard: {
    width: "100%",
    maxWidth: 440,
    background: "rgba(8, 24, 49, 0.82)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 28,
    padding: 30,
    boxShadow: "0 24px 80px rgba(0,0,0,0.34)",
    backdropFilter: "blur(14px)",
    position: "relative",
    overflow: "hidden",
  },
  loginTopLine: {
    position: "absolute",
    top: 0,
    left: 24,
    right: 24,
    height: 3,
    borderRadius: 999,
    background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
  },
  loginMiniLogo: {
    fontSize: 30,
    fontWeight: 900,
    letterSpacing: "3px",
    marginBottom: 18,
  },
  loginTitle: {
    margin: 0,
    fontSize: 32,
    fontWeight: 900,
    lineHeight: 1.2,
  },
  loginSubtitle: {
    margin: "10px 0 0",
    color: "#c7d7f3",
    fontSize: 15,
    lineHeight: 1.7,
    marginBottom: 24,
  },
  form: {
    display: "grid",
    gap: 16,
  },
  inputGroup: {
    display: "grid",
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#e3eeff",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(4, 15, 30, 0.72)",
    color: "#fff",
    borderRadius: 14,
    padding: "15px 16px",
    outline: "none",
    fontSize: 15,
    boxSizing: "border-box",
  },
  primaryBtn: {
    marginTop: 6,
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "#fff",
    borderRadius: 14,
    padding: "15px 16px",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 16,
    boxShadow: "0 14px 28px rgba(37,99,235,0.28)",
  },
  message: {
    marginTop: 16,
    background: "rgba(127,29,29,0.88)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: 13,
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.6,
  },
  footerNote: {
    marginTop: 20,
    color: "#96add6",
    fontSize: 12,
    textAlign: "center",
  },
};