import { useState } from "react";
import { supabase } from "../supabaseClient";

const ALLOWED_EMAILS = [
  "shadyhesham562@gmail.com",
  "evelinmikhail95@gmail.com",
  "faiizasaliih@gmail.com",
  "faizaaahaitham@gmail.com",
  "hadyhaithm5@gmail.com",
  "hebasabry961@gmail.com",
  "inn360.co@gmail.com",
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

    if (!ALLOWED_EMAILS.includes(cleanEmail)) {
      setMessage("This email is not authorized to use this CRM.");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      setMessage("Password is required");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password.trim(),
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
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>
        <p style={styles.subtitle}>Authorized team members only</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Work Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.primaryBtn} type="submit" disabled={loading}>
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>

        {message ? <div style={styles.message}>{message}</div> : null}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#061530",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#0a1a36",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 24,
    color: "#fff",
  },
  title: {
    margin: 0,
    marginBottom: 8,
    fontSize: 28,
  },
  subtitle: {
    margin: 0,
    marginBottom: 20,
    color: "#c9d8f5",
    fontSize: 14,
  },
  form: {
    display: "grid",
    gap: 12,
  },
  input: {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#07142c",
    color: "#fff",
    borderRadius: 10,
    padding: 12,
    outline: "none",
  },
  primaryBtn: {
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: 10,
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
  message: {
    marginTop: 14,
    background: "#102347",
    border: "1px solid rgba(255,255,255,0.12)",
    padding: 12,
    borderRadius: 10,
    fontSize: 14,
  },
};