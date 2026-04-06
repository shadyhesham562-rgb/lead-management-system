import { useEffect, useState } from "react";

const emptyForm = {
  company: "",
  contact: "",
  phone: "",
  status: "New",
  priority: "Warm",
  lastContact: "",
  nextFollowUp: "",
  notes: "",
};

export default function LeadForm({
  isOpen,
  editingLead,
  onClose,
  onSave,
  saving,
}) {
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (editingLead) {
      setFormData({
        company: editingLead.company || "",
        contact: editingLead.contact || "",
        phone: editingLead.phone || "",
        status: editingLead.status || "New",
        priority: editingLead.priority || "Warm",
        lastContact: editingLead.lastContact || "",
        nextFollowUp: editingLead.nextFollowUp || "",
        notes: editingLead.notes || "",
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingLead, isOpen]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(formData);
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>
          {editingLead ? "Edit Lead" : "Add Lead"}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="contact"
            placeholder="Contact"
            value={formData.contact}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <select
            style={styles.input}
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="New">New</option>
            <option value="Interested">Interested</option>
            <option value="Follow Up">Follow Up</option>
          </select>

          <select
            style={styles.input}
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="Hot">Hot</option>
            <option value="Warm">Warm</option>
            <option value="Cold">Cold</option>
          </select>

          <input
            style={styles.input}
            type="date"
            name="lastContact"
            value={formData.lastContact}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            type="date"
            name="nextFollowUp"
            value={formData.nextFollowUp}
            onChange={handleChange}
          />

          <textarea
            style={{ ...styles.input, minHeight: 100, resize: "vertical", gridColumn: "1 / -1" }}
            name="notes"
            placeholder="Notes"
            value={formData.notes}
            onChange={handleChange}
          />

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? "Saving..." : editingLead ? "Update" : "Save"}
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
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 999,
  },
  modal: {
    width: "100%",
    maxWidth: 760,
    background: "#0a1a36",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 20,
  },
  title: {
    marginTop: 0,
    marginBottom: 16,
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
  actions: {
    gridColumn: "1 / -1",
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  cancelBtn: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#1b2b4a",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 16px",
    cursor: "pointer",
  },
  saveBtn: {
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
};