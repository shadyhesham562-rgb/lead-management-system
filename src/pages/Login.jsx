import { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Login() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (!email.trim()) {
        setMessage("Email is required");
        setLoading(false);
        return;
      }

      if (!password.trim()) {
        setMessage("Password is required");
        setLoading(false);
        return;
      }

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) {
          setMessage(error.message);
          setLoading(false);
          return;
        }

        setMessage("Account created successfully. You can log in now.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) {
          setMessage(error.message);
          setLoading(false);
          return;
        }

        setMessage("Logged in successfully");
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          {mode === "login" ? "Login" : "Create Account"}
        </h1>

        <p style={styles.subtitle}>
          {mode === "login"
            ? "Enter your email and password"
            : "Create a new account to use the CRM"}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
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
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </form>

        <button
          style={styles.switchBtn}
          onClick={() =>
            setMode((prev) => (prev === "login" ? "signup" : "login"))
          }
        >
          {mode === "login"
            ? "Create a new account"
            : "Already have an account? Login"}
        </button>

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
  switchBtn: {
    marginTop: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#1b2b4a",
    color: "#fff",
    borderRadius: 10,
    padding: "10px 16px",
    cursor: "pointer",
    width: "100%",
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