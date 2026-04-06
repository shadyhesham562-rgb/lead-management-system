import { useEffect, useState } from "react";
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
  const [mode, setMode] = useState("login"); // login | forgot | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetPassword, setResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("reset");
        setMessage("Enter your new password");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  async function handleForgotPassword(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setMessage("Email is required");
      setLoading(false);
      return;
    }

    if (!ALLOWED_EMAILS.includes(cleanEmail)) {
      setMessage("This email is not allowed to access this CRM.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: window.location.origin,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Password reset email sent. Check your inbox.");
    setLoading(false);
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const cleanPassword = resetPassword.trim();
    const cleanConfirm = confirmResetPassword.trim();

    if (!cleanPassword) {
      setMessage("New password is required");
      setLoading(false);
      return;
    }

    if (cleanPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: cleanPassword,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Password updated successfully. You can now log in.");
    setLoading(false);
    setMode("login");
    setPassword("");
    setResetPassword("");
    setConfirmResetPassword("");
  }

  return (
    <div style={styles.page}>
      <div style={styles.bgGlowOne} />
      <div style={styles.bgGlowTwo} />
      <div style={styles.bgGlowThree} />
      <div style={styles.gridOverlay} />

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
            <div style={styles.heroTopLine} />
            <div style={styles.badge}>Internal Team Portal</div>

            <h1 style={styles.heroTitle}>
              A premium and focused CRM experience for secure daily sales work.
            </h1>

            <p style={styles.heroText}>
              Built for authorized INN users with cleaner visibility, organized
              follow-ups, and a smarter lead workflow in one elegant workspace.
            </p>

            <div style={styles.pillRow}>
              <div style={styles.pill}>Private Access</div>
              <div style={styles.pill}>Lead Tracking</div>
              <div style={styles.pill}>Smooth Follow-up</div>
            </div>

            <div style={styles.featureGrid}>
              <div style={styles.featureCard}>
                <div style={styles.featureIcon} />
                <div>
                  <div style={styles.featureTitle}>Focused Workspace</div>
                  <div style={styles.featureText}>
                    Keep the team aligned inside one clear and organized dashboard.
                  </div>
                </div>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureIcon} />
                <div>
                  <div style={styles.featureTitle}>Authorized Access</div>
                  <div style={styles.featureText}>
                    Only approved accounts can reach the CRM and its data.
                  </div>
                </div>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureIcon} />
                <div>
                  <div style={styles.featureTitle}>Daily Flow Control</div>
                  <div style={styles.featureText}>
                    Follow lead status changes and keep follow-ups moving.
                  </div>
                </div>
              </div>

              <div style={styles.featureCard}>
                <div style={styles.featureIcon} />
                <div>
                  <div style={styles.featureTitle}>Clean Interface</div>
                  <div style={styles.featureText}>
                    A more polished layout for faster internal team usage.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.rightSide}>
          <div style={styles.loginCard}>
            <div style={styles.loginCardGlow} />
            <div style={styles.loginTopLine} />
            <div style={styles.loginMiniLogo}>INN</div>

            <h2 style={styles.loginTitle}>
              {mode === "login"
                ? "Welcome Back"
                : mode === "forgot"
                ? "Forgot Password"
                : "Reset Password"}
            </h2>

            <p style={styles.loginSubtitle}>
              {mode === "login"
                ? "Sign in with your authorized team email"
                : mode === "forgot"
                ? "Enter your email to receive a reset link"
                : "Enter your new password"}
            </p>

            {mode === "login" ? (
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
            ) : mode === "forgot" ? (
              <form onSubmit={handleForgotPassword} style={styles.form}>
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

                <button style={styles.primaryBtn} type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>New Password</label>
                  <input
                    style={styles.input}
                    type="password"
                    placeholder="Enter new password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Confirm Password</label>
                  <input
                    style={styles.input}
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmResetPassword}
                    onChange={(e) => setConfirmResetPassword(e.target.value)}
                  />
                </div>

                <button style={styles.primaryBtn} type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Update Password"}
                </button>
              </form>
            )}

            {message ? <div style={styles.message}>{message}</div> : null}

            <div style={styles.linkRow}>
              {mode !== "login" ? (
                <button
                  type="button"
                  style={styles.linkBtn}
                  onClick={() => {
                    setMode("login");
                    setMessage("");
                  }}
                >
                  Back to Login
                </button>
              ) : (
                <button
                  type="button"
                  style={styles.linkBtn}
                  onClick={() => {
                    setMode("forgot");
                    setMessage("");
                    setPassword("");
                  }}
                >
                  Forgot Password?
                </button>
              )}
            </div>

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
      "linear-gradient(135deg, #050d1b 0%, #08162c 28%, #091e3d 58%, #030914 100%)",
    color: "#ffffff",
    padding: 24,
  },
  bgGlowOne: {
    position: "absolute",
    top: -120,
    left: -80,
    width: 420,
    height: 420,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(59,130,246,0.26), transparent 68%)",
    filter: "blur(28px)",
    pointerEvents: "none",
  },
  bgGlowTwo: {
    position: "absolute",
    top: 120,
    right: -120,
    width: 420,
    height: 420,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(96,165,250,0.14), transparent 70%)",
    filter: "blur(32px)",
    pointerEvents: "none",
  },
  bgGlowThree: {
    position: "absolute",
    bottom: -160,
    left: "28%",
    width: 520,
    height: 520,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(29,78,216,0.16), transparent 72%)",
    filter: "blur(38px)",
    pointerEvents: "none",
  },
  gridOverlay: {
    position: "absolute",
    inset: 0,
    opacity: 0.05,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
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
    gap: 32,
  },
  leftSide: {
    flex: "1 1 720px",
    minWidth: 320,
  },
  rightSide: {
    flex: "0 1 460px",
    minWidth: 320,
    display: "flex",
    justifyContent: "center",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    marginBottom: 30,
  },
  logo: {
    fontSize: 68,
    fontWeight: 900,
    letterSpacing: "6px",
    lineHeight: 1,
    color: "#ffffff",
    textShadow: "0 10px 32px rgba(59,130,246,0.24)",
  },
  brandName: {
    fontSize: 34,
    fontWeight: 900,
    marginBottom: 6,
  },
  brandSub: {
    fontSize: 16,
    color: "#c8d7f7",
  },
  heroCard: {
    maxWidth: 860,
    position: "relative",
    background:
      "linear-gradient(160deg, rgba(8,27,55,0.86), rgba(5,18,37,0.78))",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 30,
    padding: 34,
    boxShadow: "0 30px 90px rgba(0,0,0,0.32)",
    backdropFilter: "blur(12px)",
    overflow: "hidden",
  },
  heroTopLine: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    height: 3,
    borderRadius: 999,
    background: "linear-gradient(90deg, transparent, #60a5fa, transparent)",
  },
  badge: {
    display: "inline-block",
    padding: "10px 16px",
    borderRadius: 999,
    background: "rgba(59,130,246,0.14)",
    border: "1px solid rgba(147,197,253,0.20)",
    color: "#dbeafe",
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "0.4px",
    marginBottom: 22,
  },
  heroTitle: {
    margin: 0,
    fontSize: 40,
    fontWeight: 900,
    lineHeight: 1.22,
    maxWidth: 730,
  },
  heroText: {
    margin: "18px 0 0",
    fontSize: 17,
    lineHeight: 1.85,
    color: "#c9d8f5",
    maxWidth: 740,
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
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: 14,
    fontWeight: 700,
    color: "#e6efff",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  },
  featureCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 18,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
  },
  featureIcon: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    marginTop: 7,
    background: "linear-gradient(135deg, #7dd3fc, #2563eb)",
    boxShadow: "0 0 20px rgba(96,165,250,0.55)",
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
    maxWidth: 450,
    position: "relative",
    background:
      "linear-gradient(180deg, rgba(8,25,52,0.88), rgba(4,14,30,0.90))",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 30,
    padding: 32,
    boxShadow: "0 30px 90px rgba(0,0,0,0.36)",
    backdropFilter: "blur(14px)",
    overflow: "hidden",
  },
  loginCardGlow: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 180,
    height: 180,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(96,165,250,0.20), transparent 70%)",
    filter: "blur(16px)",
    pointerEvents: "none",
  },
  loginTopLine: {
    position: "absolute",
    top: 0,
    left: 28,
    right: 28,
    height: 3,
    borderRadius: 999,
    background: "linear-gradient(90deg, transparent, #60a5fa, transparent)",
  },
  loginMiniLogo: {
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: "4px",
    marginBottom: 18,
    color: "#ffffff",
  },
  loginTitle: {
    margin: 0,
    fontSize: 36,
    fontWeight: 900,
    lineHeight: 1.12,
  },
  loginSubtitle: {
    margin: "10px 0 0",
    color: "#c7d7f3",
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
    color: "#e3eeff",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(2, 11, 24, 0.76)",
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
    background: "linear-gradient(135deg, #4f8cff, #2563eb)",
    color: "#fff",
    borderRadius: 14,
    padding: "15px 16px",
    cursor: "pointer",
    fontWeight: 900,
    fontSize: 16,
    boxShadow: "0 16px 36px rgba(37,99,235,0.28)",
  },
  message: {
    marginTop: 16,
    background: "rgba(127,29,29,0.88)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: 13,
    borderRadius: 14,
    fontSize: 14,
    lineHeight: 1.6,
    color: "#fff3d6",
  },
  linkRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: 14,
  },
  linkBtn: {
    background: "transparent",
    border: "none",
    color: "#8db8ff",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 700,
  },
  footerNote: {
    marginTop: 20,
    color: "#96add6",
    fontSize: 12,
    textAlign: "center",
    letterSpacing: "0.2px",
  },
};