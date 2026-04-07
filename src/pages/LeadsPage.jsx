import { useEffect, useMemo, useState } from "react";
import LeadForm from "../components/LeadForm";
import { supabase } from "../supabaseClient";

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("All Owners");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setLeads(data || []);
    } catch (error) {
      console.error("Fetch leads error:", error);
      alert(error.message || "حصل خطأ في تحميل الـ leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const owners = useMemo(() => {
    const values = [...new Set(leads.map((lead) => lead.owner).filter(Boolean))];
    return values;
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const text = searchTerm.trim().toLowerCase();

      const matchesSearch =
        !text ||
        lead.company?.toLowerCase().includes(text) ||
        lead.company_type?.toLowerCase().includes(text) ||
        lead.contact?.toLowerCase().includes(text) ||
        lead.phone?.toLowerCase().includes(text) ||
        lead.owner?.toLowerCase().includes(text);

      const matchesOwner =
        ownerFilter === "All Owners" || lead.owner === ownerFilter;

      const matchesStatus =
        statusFilter === "All Status" || lead.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All Priority" || lead.priority === priorityFilter;

      return matchesSearch && matchesOwner && matchesStatus && matchesPriority;
    });
  }, [leads, searchTerm, ownerFilter, statusFilter, priorityFilter]);

  const hotCount = leads.filter((lead) => lead.priority === "Hot").length;

  const todayDate = new Date().toISOString().slice(0, 10);
  const todayCount = leads.filter(
    (lead) =>
      lead.last_contact?.slice?.(0, 10) === todayDate ||
      lead.created_at?.slice?.(0, 10) === todayDate
  ).length;

  const overdueCount = leads.filter((lead) => {
    if (!lead.next_follow_up) return false;
    return lead.next_follow_up.slice(0, 10) < todayDate;
  }).length;

  const handleAddLead = () => {
    setEditingLead(null);
    setIsLeadModalOpen(true);
  };

  const handleEditLead = (lead) => {
    setEditingLead({
      id: lead.id,
      company: lead.company || "",
      company_type: lead.company_type || "",
      contact: lead.contact || "",
      phone: lead.phone || "",
      owner: lead.owner || "Shady",
      status: lead.status || "New",
      priority: lead.priority || "Warm",
      notes: lead.notes || "",
      lastContact: lead.last_contact ? String(lead.last_contact).slice(0, 10) : "",
      nextFollowUp: lead.next_follow_up ? String(lead.next_follow_up).slice(0, 10) : "",
    });

    setIsLeadModalOpen(true);
  };

  const handleSaveLead = async (formData) => {
    try {
      setSaving(true);

      const payload = {
        company: formData.company?.trim() || "",
        company_type: formData.company_type || "",
        contact: formData.contact?.trim() || "",
        phone: formData.phone?.trim() || "",
        owner: formData.owner || editingLead?.owner || "Shady",
        status: formData.status || "New",
        priority: formData.priority || "Warm",
        notes: formData.notes || "",
        last_contact: formData.lastContact || null,
        next_follow_up: formData.nextFollowUp || null,
      };

      if (editingLead?.id) {
        const { error } = await supabase
          .from("leads")
          .update(payload)
          .eq("id", editingLead.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("leads")
          .insert([payload]);

        if (error) throw error;
      }

      setIsLeadModalOpen(false);
      setEditingLead(null);
      await fetchLeads();
    } catch (error) {
      console.error("Save lead error:", error);
      alert(error.message || "حصل خطأ في الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLead = async (leadId) => {
    const confirmed = window.confirm("متأكد إنك عايز تمسح الـ lead دي؟");
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", leadId);

      if (error) throw error;

      await fetchLeads();
    } catch (error) {
      console.error("Delete lead error:", error);
      alert(error.message || "حصل خطأ في الحذف");
    }
  };

  const handleStatusChange = async (leadId, value) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: value })
        .eq("id", leadId);

      if (error) throw error;

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: value } : lead
        )
      );
    } catch (error) {
      console.error(error);
      alert("حصل خطأ في تعديل الـ status");
    }
  };

  const handlePriorityChange = async (leadId, value) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ priority: value })
        .eq("id", leadId);

      if (error) throw error;

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, priority: value } : lead
        )
      );
    } catch (error) {
      console.error(error);
      alert("حصل خطأ في تعديل الـ priority");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={sectionStyle}>
        <div style={topButtonsStyle}>
          <button onClick={handleAddLead} style={addBtnStyle}>
            Add Lead
          </button>

          <button type="button" style={importBtnStyle}>
            Import CSV
          </button>
        </div>

        <div style={quickFiltersStyle}>
          <button style={pillActiveStyle}>All</button>
          <button style={pillStyle}>Today</button>
          <button style={pillStyle}>Overdue</button>
        </div>

        <div style={filterRowStyle}>
          <input
            type="text"
            placeholder="Search by company / contact / phone / owner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />

          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            style={filterSelectStyle}
          >
            <option>All Owners</option>
            {owners.map((owner) => (
              <option key={owner} value={owner}>
                {owner}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={filterSelectStyle}
          >
            <option>All Status</option>
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Won</option>
            <option>Lost</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={filterSelectStyle}
          >
            <option>All Priority</option>
            <option>Cold</option>
            <option>Warm</option>
            <option>Hot</option>
          </select>

          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setOwnerFilter("All Owners");
              setStatusFilter("All Status");
              setPriorityFilter("All Priority");
            }}
            style={clearBtnStyle}
          >
            Clear Filters
          </button>
        </div>

        <div style={statsRowStyle}>
          <span style={showingStyle}>Showing: {filteredLeads.length}</span>
          <span style={badgeHotStyle}>Hot: {hotCount}</span>
          <span style={badgeTodayStyle}>Today: {todayCount}</span>
          <span style={badgeOverdueStyle}>Overdue: {overdueCount}</span>
        </div>

        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr style={theadRowStyle}>
                <th style={thStyle}>Company</th>
                <th style={thStyle}>Contact</th>
                <th style={thStyle}>Phone</th>
                <th style={thStyle}>Owner</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Priority</th>
                <th style={thStyle}>Last Contact</th>
                <th style={thStyle}>Next Follow-up</th>
                <th style={thStyle}>Notes</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" style={emptyCellStyle}>
                    Loading...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="10" style={emptyCellStyle}>
                    No leads found
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} style={rowStyle}>
                    <td style={tdStyle}>{lead.company || "-"}</td>
                    <td style={tdStyle}>{lead.contact || "-"}</td>
                    <td style={tdStyle}>{lead.phone || "-"}</td>
                    <td style={tdStyle}>{lead.owner || "-"}</td>

                    <td style={tdStyle}>
                      <select
                        value={lead.status || "New"}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        style={inlineSelectStyle}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Won">Won</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>

                    <td style={tdStyle}>
                      <select
                        value={lead.priority || "Warm"}
                        onChange={(e) => handlePriorityChange(lead.id, e.target.value)}
                        style={inlineSelectStyle}
                      >
                        <option value="Cold">Cold</option>
                        <option value="Warm">Warm</option>
                        <option value="Hot">Hot</option>
                      </select>
                    </td>

                    <td style={tdStyle}>
                      {lead.last_contact ? String(lead.last_contact).slice(0, 10) : "-"}
                    </td>

                    <td style={tdStyle}>
                      {lead.next_follow_up ? String(lead.next_follow_up).slice(0, 10) : "-"}
                    </td>

                    <td style={notesTdStyle}>{lead.notes || "-"}</td>

                    <td style={tdStyle}>
                      <div style={actionBtnsWrapStyle}>
                        <button
                          onClick={() => handleEditLead(lead)}
                          style={editBtnStyle}
                        >
                          Edit
                        </button>

                        <a
                          href={`https://wa.me/${String(lead.phone || "").replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          style={whatsappBtnStyle}
                        >
                          WhatsApp
                        </a>

                        <a
                          href={`tel:${lead.phone || ""}`}
                          style={callBtnStyle}
                        >
                          Call
                        </a>

                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          style={deleteBtnStyle}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <LeadForm
        isOpen={isLeadModalOpen}
        editingLead={editingLead}
        onClose={() => {
          setIsLeadModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        saving={saving}
      />
    </div>
  );
}

const pageStyle = {
  minHeight: "100vh",
  background: "#071a3d",
  padding: "12px 16px 24px",
  color: "white",
};

const sectionStyle = {
  maxWidth: "1280px",
  margin: "0 auto",
};

const topButtonsStyle = {
  display: "flex",
  gap: "8px",
  marginBottom: "10px",
};

const addBtnStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "8px 14px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 600,
};

const importBtnStyle = {
  background: "#22c55e",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "8px 14px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 600,
};

const quickFiltersStyle = {
  display: "flex",
  gap: "8px",
  marginBottom: "10px",
};

const pillStyle = {
  background: "#10224c",
  color: "white",
  border: "1px solid #1f3b69",
  borderRadius: "999px",
  padding: "6px 12px",
  cursor: "pointer",
  fontSize: "12px",
};

const pillActiveStyle = {
  ...pillStyle,
  background: "#2563eb",
};

const filterRowStyle = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
  gap: "8px",
  marginBottom: "10px",
};

const searchInputStyle = {
  width: "100%",
  background: "#081735",
  color: "white",
  border: "1px solid #1f3b69",
  borderRadius: "8px",
  padding: "10px 12px",
  outline: "none",
  fontSize: "12px",
};

const filterSelectStyle = {
  width: "100%",
  background: "#081735",
  color: "white",
  border: "1px solid #1f3b69",
  borderRadius: "8px",
  padding: "10px 12px",
  outline: "none",
  fontSize: "12px",
};

const clearBtnStyle = {
  background: "#334155",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "10px 12px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: 600,
};

const statsRowStyle = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  marginBottom: "12px",
  flexWrap: "wrap",
};

const showingStyle = {
  fontSize: "12px",
  color: "#dbeafe",
};

const badgeBaseStyle = {
  padding: "4px 8px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 700,
};

const badgeHotStyle = {
  ...badgeBaseStyle,
  background: "#7c2d12",
  color: "#fff7ed",
};

const badgeTodayStyle = {
  ...badgeBaseStyle,
  background: "#713f12",
  color: "#fef3c7",
};

const badgeOverdueStyle = {
  ...badgeBaseStyle,
  background: "#7f1d1d",
  color: "#fee2e2",
};

const tableWrapStyle = {
  overflowX: "auto",
  border: "1px solid #1f3b69",
  borderRadius: "12px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "1300px",
  background: "#081735",
};

const theadRowStyle = {
  background: "#10224c",
};

const thStyle = {
  textAlign: "left",
  padding: "12px 10px",
  fontSize: "12px",
  color: "#dbeafe",
};

const rowStyle = {
  borderTop: "1px solid #16325c",
};

const tdStyle = {
  padding: "12px 10px",
  fontSize: "12px",
  color: "white",
  verticalAlign: "top",
};

const notesTdStyle = {
  ...tdStyle,
  minWidth: "180px",
  maxWidth: "260px",
};

const emptyCellStyle = {
  padding: "24px",
  textAlign: "center",
  color: "#cbd5e1",
};

const inlineSelectStyle = {
  background: "#10224c",
  color: "white",
  border: "1px solid #1f3b69",
  borderRadius: "6px",
  padding: "6px 8px",
  fontSize: "12px",
  outline: "none",
};

const actionBtnsWrapStyle = {
  display: "flex",
  gap: "6px",
  flexWrap: "wrap",
};

const editBtnStyle = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: "11px",
};

const whatsappBtnStyle = {
  background: "#22c55e",
  color: "white",
  textDecoration: "none",
  borderRadius: "6px",
  padding: "6px 10px",
  fontSize: "11px",
};

const callBtnStyle = {
  background: "#9333ea",
  color: "white",
  textDecoration: "none",
  borderRadius: "6px",
  padding: "6px 10px",
  fontSize: "11px",
};

const deleteBtnStyle = {
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "6px 10px",
  cursor: "pointer",
  fontSize: "11px",
};