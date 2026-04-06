import { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import DashboardCards from "../components/DashboardCards";
import LeadForm from "../components/LeadForm";
import LeadTable from "../components/LeadTable";
import { supabase } from "../supabaseClient.js";

const ACTIVITY_KEY = "crm_activity_v2";

function dbToLead(row) {
  return {
    id: row.id,
    company: row.company || "",
    contact: row.contact || "",
    phone: row.phone || "",
    status: row.status || "New",
    priority: row.priority || "Warm",
    notes: row.notes || "",
    lastContact: row.last_contact || "",
    nextFollowUp: row.next_follow_up || "",
    user_id: row.user_id || null,
  };
}

function buildPayload(leadData, userId) {
  return {
    company: leadData.company?.trim() || "",
    contact: leadData.contact?.trim() || "",
    phone: leadData.phone?.trim() || "",
    status: leadData.status || "New",
    priority: leadData.priority || "Warm",
    notes: leadData.notes?.trim() || "",
    last_contact: leadData.lastContact || null,
    next_follow_up: leadData.nextFollowUp || null,
    user_id: userId,
  };
}

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activityLog, setActivityLog] = useState(() => {
    try {
      const saved = localStorage.getItem(ACTIVITY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activityLog));
  }, [activityLog]);

  async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("Get user error:", error);
      return null;
    }

    return data.user || null;
  }

  async function loadLeads() {
    setLoading(true);
    setErrorMessage("");

    const user = await getCurrentUser();

    if (!user) {
      setLeads([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    if (error) {
      console.error("Load leads error:", error);
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setLeads((data || []).map(dbToLead));
    setLoading(false);
  }

  function addActivity(text) {
    const item = {
      id: Date.now(),
      text,
      time: new Date().toLocaleString(),
    };

    setActivityLog((prev) => [item, ...prev].slice(0, 20));
  }

  function handleOpenAdd() {
    setEditingLead(null);
    setShowForm(true);
    setErrorMessage("");
    setSuccessMessage("");
  }

  function handleOpenEdit(lead) {
    setEditingLead(lead);
    setShowForm(true);
    setErrorMessage("");
    setSuccessMessage("");
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingLead(null);
  }

  async function handleSaveLead(leadData) {
    setErrorMessage("");
    setSuccessMessage("");

    if (!leadData.company?.trim()) {
      setErrorMessage("Company is required");
      return;
    }

    if (!leadData.contact?.trim()) {
      setErrorMessage("Contact is required");
      return;
    }

    if (!leadData.phone?.trim()) {
      setErrorMessage("Phone is required");
      return;
    }

    const user = await getCurrentUser();

    if (!user) {
      setErrorMessage("You must be logged in");
      return;
    }

    setSaving(true);

    try {
      const payload = buildPayload(leadData, user.id);

      if (editingLead) {
        const { data, error } = await supabase
          .from("leads")
          .update(payload)
          .eq("id", editingLead.id)
          .eq("user_id", user.id)
          .select("*")
          .single();

        if (error) {
          console.error("Update error:", error);
          setErrorMessage(error.message);
          return;
        }

        const updatedLead = dbToLead(data);

        setLeads((prev) =>
          prev.map((lead) => (lead.id === editingLead.id ? updatedLead : lead))
        );

        addActivity(`Updated lead for ${updatedLead.company || updatedLead.contact}`);
        setSuccessMessage("Lead updated successfully");
      } else {
        const { data, error } = await supabase
          .from("leads")
          .insert([payload])
          .select("*")
          .single();

        if (error) {
          console.error("Insert error:", error);
          setErrorMessage(error.message);
          return;
        }

        const newLead = dbToLead(data);

        setLeads((prev) => [newLead, ...prev]);
        addActivity(`Added lead for ${newLead.company || newLead.contact}`);
        setSuccessMessage("Lead added successfully");
      }

      setShowForm(false);
      setEditingLead(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteLead(id) {
    const confirmDelete = window.confirm("Are you sure you want to delete this lead?");
    if (!confirmDelete) return;

    setErrorMessage("");
    setSuccessMessage("");

    const user = await getCurrentUser();

    if (!user) {
      setErrorMessage("You must be logged in");
      return;
    }

    const leadToDelete = leads.find((lead) => lead.id === id);

    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Delete error:", error);
      setErrorMessage(error.message);
      return;
    }

    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    addActivity(
      `Deleted lead for ${
        leadToDelete?.company || leadToDelete?.contact || "Unknown"
      }`
    );
    setSuccessMessage("Lead deleted successfully");
  }

  async function handleQuickUpdate(id, field, value) {
    setErrorMessage("");
    setSuccessMessage("");

    const user = await getCurrentUser();

    if (!user) {
      setErrorMessage("You must be logged in");
      return;
    }

    const { data, error } = await supabase
      .from("leads")
      .update({ [field]: value })
      .eq("id", id)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error) {
      console.error("Quick update error:", error);
      setErrorMessage(error.message);
      return;
    }

    const updatedLead = dbToLead(data);

    setLeads((prev) =>
      prev.map((item) => (item.id === id ? updatedLead : item))
    );

    addActivity(
      `Updated ${field} for ${updatedLead.company || updatedLead.contact}`
    );
  }

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchText =
        `${lead.company} ${lead.contact} ${lead.phone}`.toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;
      const matchesPriority =
        priorityFilter === "All" || lead.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [leads, search, statusFilter, priorityFilter]);

  function exportCsv() {
    const headers = [
      "Company",
      "Contact",
      "Phone",
      "Status",
      "Priority",
      "Last Contact",
      "Next Follow-up",
      "Notes",
    ];

    const rows = filteredLeads.map((lead) => [
      lead.company || "",
      lead.contact || "",
      lead.phone || "",
      lead.status || "",
      lead.priority || "",
      lead.lastContact || "",
      lead.nextFollowUp || "",
      lead.notes || "",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "leads.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div style={styles.page}>
      <Header
        userLabel="SH"
        onLogout={async () => {
          try {
            await supabase.auth.signOut();
          } catch {
            // no-op
          }
          window.location.reload();
        }}
      />

      {errorMessage ? <div style={styles.errorBox}>{errorMessage}</div> : null}
      {successMessage ? (
        <div style={styles.successBox}>{successMessage}</div>
      ) : null}

      <DashboardCards leads={leads} />

      <div style={styles.activityBox}>
        <div style={styles.activityHeader}>
          <div>
            <h3 style={styles.activityTitle}>Recent Activity</h3>
            <div style={styles.activitySub}>Latest CRM actions</div>
          </div>

          <button
            style={styles.clearActivityBtn}
            onClick={() => setActivityLog([])}
          >
            Clear Activity
          </button>
        </div>

        <div style={styles.activityList}>
          {activityLog.length === 0 ? (
            <div style={styles.emptyActivity}>No recent activity yet</div>
          ) : (
            activityLog.map((item) => (
              <div key={item.id} style={styles.activityItem}>
                <div style={styles.activityText}>{item.text}</div>
                <div style={styles.activityTime}>{item.time}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <button style={styles.addLeadBtn} onClick={handleOpenAdd}>
          Add Lead
        </button>
      </div>

      <LeadTable
        leads={filteredLeads}
        loading={loading}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteLead}
        onQuickUpdate={handleQuickUpdate}
        onExportCSV={exportCsv}
      />

      <LeadForm
        isOpen={showForm}
        editingLead={editingLead}
        onClose={handleCloseForm}
        onSave={handleSaveLead}
        saving={saving}
      />
    </div>
  );
}

const styles = {
  page: {
    padding: 14,
  },
  errorBox: {
    background: "#7f1d1d",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: 12,
    marginBottom: 16,
    border: "1px solid rgba(255,255,255,0.1)",
  },
  successBox: {
    background: "#14532d",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: 12,
    marginBottom: 16,
    border: "1px solid rgba(255,255,255,0.1)",
  },
  activityBox: {
    background: "#0a1a36",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  activityHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 12,
  },
  activityTitle: {
    margin: 0,
    fontSize: 16,
  },
  activitySub: {
    marginTop: 4,
    fontSize: 12,
    color: "#c9d8f5",
  },
  clearActivityBtn: {
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#233452",
    color: "#fff",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
  },
  activityList: {
    display: "grid",
    gap: 10,
  },
  emptyActivity: {
    border: "1px dashed rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 14,
    color: "#c9d8f5",
  },
  activityItem: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 12,
    background: "#07142c",
  },
  activityText: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: "#c9d8f5",
  },
  addLeadBtn: {
    border: "none",
    background: "#2563eb",
    color: "#fff",
    borderRadius: 8,
    padding: "10px 16px",
    cursor: "pointer",
    fontWeight: 700,
  },
};