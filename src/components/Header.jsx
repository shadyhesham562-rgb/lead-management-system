import { useMemo, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Header({ onLogout }) {
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const initials = useMemo(() => {
    return "INN";
  }, []);

  async function handleChangePassword(e) {
    e.preventDefault();
    setPasswordMessage("");

    const cleanPassword = newPassword.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanPassword) {
      setPasswordMessage("New password is required");
      return;
    }

    if (cleanPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters");
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      setPasswordMessage("Passwords do not match");
      return;
    }

    setSavingPassword(true);

    const { error } = await supabase.auth.updateUser({
      password: cleanPassword,
    });

    if (error) {
      setPasswordMessage(error.message);
      setSavingPassword(false);
      return;
    }

    setPasswordMessage("Password changed successfully");
    setNewPassword("");
    setConfirmPassword("");
    setSavingPassword(false);

    setTimeout(() => {
      setShowPasswordBox(false);
      setPasswordMessage("");
    }, 1200);
  }

  return (
    <>
      <div style={styles.header}>
        <div style={styles.leftSide}>
          <div style={styles.logo}>INN</div>

          <div>
            <div style={styles.title}>Lead Management System</div>
            <div style={styles.subtitle}>CRM Dashboard for Sales Follow-up</div>
          </div>
        </div>

        <div style={styles.rightSide}>
          <button
            style={styles.secondaryBtn}
            onClick={() => {
              setShowPasswordBox(true);
              setPasswordMessage("");
              setNewPassword("");
              setConfirmPassword("");
            }}
          >
            Change Password
          </button>

          <button style={styles.logoutBtn} onClick={onLogout}>
            Logout
          </button>

          <div style={styles.avatar}>{initials}</div>
        </div>
      </div>

      {showPasswordBox ? (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalTitle}>Change Password</div>
            <div style={styles.modalSub}>
              Update your account password securely
            </div>

            <form onSubmit={handleChangePassword} style={styles.form}>
              <input
                style={styles.input}
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <input
                style={styles.input}
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {passwordMessage ? (
                <div
                  style={
                    passwordMessage.toLowerCase().includes("success")
                      ? styles.successBox
                      : styles.errorBox
                  }
                >
                  {passwordMessage}
                </div>
              ) : null}

              <div style={styles.modalActions}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => {
                    setShowPasswordBox(false);
                    setPasswordMessage("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                >
                  Cancel
                </button>

                <button type="submit" style={styles.saveBtn} disabled={savingPassword}>
                  {savingPassword ? "Saving..." : "Save Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 18,
    padding: "14px 16px",
    borderRadius: 18,
    background: "#0a1a36",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  leftSide: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  logo: {
    fontSize: 38,
    fontWeight: 900,
    letterSpacing: "4px",
    color: "#fff",
    lineHeight: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 800,
    color: "#fff",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#c9d8f5",
  },
  rightSide: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  secondaryBtn: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#1d4ed8",
    color: "#fff",
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  logoutBtn: {
    border: "none",
    background: "#ef4444",
    color: "#fff",
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "#f4f1e8",
    color: "#14213d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 13,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 9999,
  },
  modal: {
    width: "100%",
    maxWidth: 420,
    background: "#0a1a36",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 18,
    padding: 22,
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: "#fff",
    marginBottom: 6,
  },
  modalSub: {
    fontSize: 14,
    color: "#c9d8f5",
    marginBottom: 18,
  },
  form: {
    display: "grid",
    gap: 12,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#07142c",
    color: "#fff",
    borderRadius: 12,
    padding: "13px 14px",
    outline: "none",
    fontSize: 14,
  },
  errorBox: {
    background: "#7f1d1d",
    color: "#fff",
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 14,
  },
  successBox: {
    background: "#14532d",
    color: "#fff",
    borderRadius: 12,
    padding: "12px 14px",
    fontSize: 14,
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 6,
  },
  cancelBtn: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#233452",
    color: "#fff",
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  saveBtn: {
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: 10,
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
};