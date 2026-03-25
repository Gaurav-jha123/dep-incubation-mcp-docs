import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { Skill } from "./ExportButtons";
import type { User } from "@/types/user";

interface SkillReportDocumentProps {
  skills: Skill[];
  user?: User | null;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 44,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
    fontSize: 11,
    color: "#111827",
  },
  // ── Header ──────────────────────────────────────────────
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 14,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  subtitle: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
  // ── Summary stat cards ───────────────────────────────────
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statLabel: {
    fontSize: 8,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginTop: 4,
  },
  // ── Section title ────────────────────────────────────────
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 8,
  },
  chartCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
    backgroundColor: "#ffffff",
  },
  chartHint: {
    fontSize: 9,
    color: "#6B7280",
    marginBottom: 8,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },
  chartLabel: {
    width: 110,
    fontSize: 9,
    color: "#374151",
  },
  chartTrack: {
    flex: 1,
    height: 9,
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
  },
  chartFill: {
    height: 9,
    borderRadius: 5,
  },
  chartScore: {
    width: 28,
    marginLeft: 8,
    fontSize: 9,
    color: "#111827",
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  // ── Table ────────────────────────────────────────────────
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 1,
  },
  tableRowEven: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 8,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tableRowOdd: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 8,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  colRank: { width: 28, fontSize: 10, color: "#9CA3AF" },
  colSkill: { flex: 1, fontSize: 11, color: "#374151" },
  colBar: { width: 110, marginHorizontal: 10 },
  colScore: { width: 36, fontSize: 11, textAlign: "right" },
  colHeaderRank: { width: 28, fontSize: 9, fontFamily: "Helvetica-Bold", color: "#374151" },
  colHeaderSkill: { flex: 1, fontSize: 9, fontFamily: "Helvetica-Bold", color: "#374151" },
  colHeaderBar: {
    width: 110,
    marginHorizontal: 10,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
  },
  colHeaderScore: {
    width: 36,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    textAlign: "right",
  },
  // ── Progress bar ─────────────────────────────────────────
  barTrack: {
    height: 7,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
  },
  barFill: {
    height: 7,
    borderRadius: 4,
  },
  // ── Footer ───────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#9CA3AF",
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
  },
});

function scoreColor(value: number): string {
  if (value >= 75) return "#16a34a";
  if (value >= 50) return "#d97706";
  return "#dc2626";
}

export default function SkillReportDocument({
  skills,
  user,
}: SkillReportDocumentProps) {
  const topSkills = [...skills]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const avg =
    skills.length > 0
      ? (
          skills.reduce((s, x) => s + x.value, 0) / skills.length
        ).toFixed(1)
      : "0";

  const strongest = skills[0];
  const weakest = skills[skills.length - 1];

  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document title={`Skill Report – ${user?.name ?? "User"}`}>
      <Page size="A4" style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.title}>Skill Report</Text>
          {user?.name ? (
            <Text style={styles.subtitle}>
              {user.name} · Generated {generatedDate}
            </Text>
          ) : (
            <Text style={styles.subtitle}>Generated {generatedDate}</Text>
          )}
        </View>

        {/* ── Summary cards ── */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Average Score</Text>
            <Text style={styles.statValue}>{avg}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Skills</Text>
            <Text style={styles.statValue}>{skills.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Strongest</Text>
            <Text style={styles.statValue}>
              {strongest ? `${strongest.topic} (${strongest.value})` : "–"}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Needs Work</Text>
            <Text style={styles.statValue}>
              {weakest ? `${weakest.topic} (${weakest.value})` : "–"}
            </Text>
          </View>
        </View>

        {/* ── Graph section ── */}
        <Text style={styles.sectionTitle}>Top Skills Graph</Text>
        <View style={styles.chartCard}>
          <Text style={styles.chartHint}>Bar length represents score out of 100.</Text>
          {topSkills.map((skill) => (
            <View key={skill.topic} style={styles.chartRow}>
              <Text style={styles.chartLabel}>{skill.topic}</Text>
              <View style={styles.chartTrack}>
                <View
                  style={[
                    styles.chartFill,
                    {
                      width: `${skill.value}%`,
                      backgroundColor: scoreColor(skill.value),
                    },
                  ]}
                />
              </View>
              <Text style={styles.chartScore}>{skill.value}</Text>
            </View>
          ))}
        </View>

        {/* ── Skills table ── */}
        <Text style={styles.sectionTitle}>All Skills — sorted by score</Text>

        <View style={styles.tableHeader}>
          <Text style={styles.colHeaderRank}>#</Text>
          <Text style={styles.colHeaderSkill}>Skill</Text>
          <Text style={styles.colHeaderBar}>Progress</Text>
          <Text style={styles.colHeaderScore}>Score</Text>
        </View>

        {skills.map((skill, idx) => (
          <View
            key={skill.topic}
            style={idx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
          >
            <Text style={styles.colRank}>{idx + 1}</Text>
            <Text style={styles.colSkill}>{skill.topic}</Text>

            <View style={styles.colBar}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${skill.value}%`,
                      backgroundColor: scoreColor(skill.value),
                    },
                  ]}
                />
              </View>
            </View>

            <Text
              style={[
                styles.colScore,
                {
                  color: scoreColor(skill.value),
                  fontFamily: "Helvetica-Bold",
                },
              ]}
            >
              {skill.value}
            </Text>
          </View>
        ))}

        {/* ── Footer ── */}
        <Text style={styles.footer} fixed>
          DEP Incubation Dashboard · Skill Assessment Report · {generatedDate}
        </Text>
      </Page>
    </Document>
  );
}
