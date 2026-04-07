import { useEffect, useState } from "react";

const emptyLead = {
  company: "",
  company_type: "",
  contact: "",
  phone: "",
  owner: "",
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
        company_type: editingLead.company_type || "",
        contact: editingLead.contact || "",
        phone: editingLead.phone || "",
        owner: editingLead.owner || "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <div>
            <h2 style={titleStyle}>
              {editingLead ? "Edit Lead" : "Add New Lead"}
            </h2>
            <p style={subtitleStyle}>Fill in the client details and save</p>
          </div>

          <button type="button" onClick={onClose} style={closeBtnStyle}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Company Name</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Company Type</label>
              <select
                name="company_type"
                value={formData.company_type}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">Select company type</option>
                <option value="Real estate">Real estate</option>
                <option value="Medical">Medical</option>
                <option value="Education">Education</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Automotive">Automotive</option>
                <option value="Construction">Construction</option>
                <option value="Services">Services</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Contact person"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Cold">Cold</option>
                <option value="Warm">Warm</option>
                <option value="Hot">Hot</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Last Contact</label>
              <input
                type="date"
                name="lastContact"
                value={formData.lastContact}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Next Follow Up</label>
              <input
                type="date"
                name="nextFollowUp"
                value={formData.nextFollowUp}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Write any notes here"
                rows={4}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
          </div>

          <div style={actionsStyle}>
            <button type="submit" disabled={saving} style={saveBtnStyle}>
              {saving ? "Saving..." : editingLead ? "Update Lead" : "Add Lead"}
            </button>

            <button type="button" onClick={onClose} style={cancelBtnStyle}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0, 0, 0, 0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  zIndex: 9999,
};

const modalStyle = {
  width: "100%",
  maxWidth: "760px",
  background: "#081735",
  border: "1px solid #16325c",
  borderRadius: "16px",
  padding: "18px",
  color: "white",
  boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "16px",
};

const titleStyle = {
  margin: 0,
  fontSize: "28px",
  fontWeight: 700,
};

const subtitleStyle = {
  margin: "4px 0 0",
  color: "#cbd5e1",
  fontSize: "12px",
};

const closeBtnStyle = {
  width: "30px",
  height: "30px",
  borderRadius: "8px",
  border: "1px solid #33527a",
  background: "#18345b",
  color: "white",
  cursor: "pointer",
  fontSize: "18px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "12px",
};

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  fontSize: "12px",
  color: "#dbeafe",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #2a4770",
  background: "#10224c",
  color: "white",
  outline: "none",
  boxSizing: "border-box",
};

const actionsStyle = {
  display: "flex",
  gap: "10px",
  marginTop: "16px",
};

const saveBtnStyle = {
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  cursor: "pointer",
  fontWeight: 600,
};

const cancelBtnStyle = {
  background: "#64748b",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "10px 16px",
  cursor: "pointer",
  fontWeight: 600,
};