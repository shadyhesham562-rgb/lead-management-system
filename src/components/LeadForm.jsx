import { useEffect, useState } from "react";

const emptyLead = {
  company: "",
  contact: "",
  phone: "",
  status: "New",
  priority: "Warm",
  notes: "",
  lastContact: "",
  nextFollowUp: "",
};

export default function LeadForm({
  isOpen,
  editingLead,
  onClose,
  onSave,
  saving = false,
}) {
  const [formData, setFormData] = useState(emptyLead);

  useEffect(() => {
    if (editingLead) {
      setFormData({
        company: editingLead.company || "",
        contact: editingLead.contact || "",
        phone: editingLead.phone || "",
        status: editingLead.status || "New",
        priority: editingLead.priority || "Warm",
        notes: editingLead.notes || "",
        lastContact: editingLead.lastContact || "",
        nextFollowUp: editingLead.nextFollowUp || "",
      });
    } else {
      setFormData(emptyLead);
    }
  }, [editingLead, isOpen]);

  if (!isOpen) return null;

  function handleChange(field, value) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave?.(formData);
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>
              {editingLead ? "Edit Lead" : "Add New Lead"}
            </div>
            <div style={styles.subtitle}>
              Fill in the client details and save
            </div>
          </div>

          <button style={styles.closeBtn} onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <div style={styles.field}>
              <label style={styles.label}>Company</label>
              <input
                style={styles.input}
                type="text"
                value={formData.company}
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder="Company name"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Contact</label>
              <input
                style={styles.input}
                type="text"
                value={formData.contact}
                onChange={(e) => handleChange("contact", e.target.value)}
                placeholder="Contact person"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Phone</label>
              <input
                style={styles.input}
                type="text"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Phone number"
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Status</label>
              <select
                style={styles.input}
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option value="New">New</option>
                <option value="Interested">Interested</option>
                <option value="Follow Up">Follow Up</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Priority</label>
              <select
                style={styles.input}
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
              >
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
              </select>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Last Contact</label>
              <input
                style={styles.input}
                type="date"
                value={formData.lastContact}
                onChange={(e) => handleChange("lastContact", e.target.value)}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Next Follow-up</label>
              <input
                style={styles.input}
                type="date"
                value={formData.nextFollowUp}
                onChange={(e) => handleChange("nextFollowUp", e.target.value)}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Notes</label>
            <textarea
              style={styles.textarea}
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Write any notes here"
            />
          </div>

          <div style={styles.actions}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>

            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? "Saving..." : editingLead ? "Save Changes" : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.60)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    zIndex: 9999,
  },
  modal: {
    width: "100%",
    maxWidth: 760,
    maxHeight: "92vh",
    overflowY: "auto",
    background: "#08152d",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 18,
    boxSizing: "border-box",
    padding: 18,
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#bcd0f7",
  },
  closeBtn: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#13284a",
    color: "#fff",
    width: 38,
    height: 38,
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 16,
    flexShrink: 0,
  },
  form: {
    display: "grid",
    gap: 14,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },
  field: {
    display: "grid",
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 700,
    color: "#dbe7ff",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#0c1d3b",
    color: "#fff",
    borderRadius: 12,
    padding: "12px 14px",
    outline: "none",
    fontSize: 14,
  },
  textarea: {
    width: "100%",
    minHeight: 120,
    resize: "vertical",
    boxSizing: "border-box",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#0c1d3b",
    color: "#fff",
    borderRadius: 12,
    padding: "12px 14px",
    outline: "none",
    fontSize: 14,
    lineHeight: 1.6,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
    position: "sticky",
    bottom: 0,
    background: "#08152d",
    paddingTop: 10,
  },
  cancelBtn: {
    border: "1px solid rgba(255,255,255,0.10)",
    background: "#223556",
    color: "#fff",
    borderRadius: 10,
    padding: "11px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
  saveBtn: {
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: 10,
    padding: "11px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
};