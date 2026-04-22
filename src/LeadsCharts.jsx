import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const pieColors = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

function buildCountData(items, key, fallback = "Unknown") {
  const counts = {};

  items.forEach((item) => {
    const value = item[key] || fallback;
    counts[value] = (counts[value] || 0) + 1;
  });

  return Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));
}

export default function LeadsCharts({ leads = [] }) {
  const statusData = useMemo(() => {
    return buildCountData(leads, "status", "Unknown");
  }, [leads]);

  const companyTypeData = useMemo(() => {
    return buildCountData(leads, "company_type", "Unknown");
  }, [leads]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.title}>Leads by Status</h3>
          <span style={styles.subTitle}>{statusData.length} groups</span>
        </div>

        <div style={styles.chartBox}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" stroke="#cbd5e1" />
              <YAxis stroke="#cbd5e1" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  color: "#fff",
                }}
              />
              <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3 style={styles.title}>Leads by Company Type</h3>
          <span style={styles.subTitle}>{companyTypeData.length} groups</span>
        </div>

        <div style={styles.chartBox}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={companyTypeData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                innerRadius={55}
                paddingAngle={3}
              >
                {companyTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  color: "#fff",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 16,
    marginBottom: 16,
  },
  card: {
    background: "#0a1a36",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 12,
  },
  title: {
    margin: 0,
    fontSize: 16,
    color: "#fff",
  },
  subTitle: {
    fontSize: 12,
    color: "#cbd5e1",
  },
  chartBox: {
    width: "100%",
    height: 320,
  },
};