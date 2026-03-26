import { pdf } from "@react-pdf/renderer";
import { MoreVertical } from "lucide-react";

import { Dropdown } from "@/components/organisms";
import type { User } from "@/types/user";
import SkillReportDocument from "./SkillReportDocument";

export type Skill = {
  topic: string;
  value: number;
};

type ExportButtonsProps = {
  skills: Skill[];
  user?: User | null;
  disabled?: boolean;
};

export default function ExportButtons({ skills, user, disabled = false }: ExportButtonsProps) {
  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const downloadCSV = () => {
    const headers = ["Skill", "Score"];
    const rows = skills.map((s) => [s.topic, s.value]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    triggerDownload(blob, "skill-report.csv");
  };

  const downloadPDF = async () => {
    try {
      const blob = await pdf(
        <SkillReportDocument skills={skills} user={user} />
      ).toBlob();
      triggerDownload(blob, "skill-report.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  return (
    <Dropdown className="inline-flex">
      <Dropdown.Trigger
        className={`px-2 py-2 rounded-md border border-border transition-all ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground pointer-events-none"
            : "hover:bg-accent"
        }`}
        aria-label={disabled ? "Export menu (disabled - select a user first)" : "Open export menu"}
      >
        <MoreVertical className="h-5 w-5" aria-hidden="true" />
      </Dropdown.Trigger>

      {!disabled && (
        <Dropdown.Content placement="bottom-end">
          <Dropdown.Item onClick={downloadPDF}>Export PDF</Dropdown.Item>
          <Dropdown.Item onClick={downloadCSV}>Export CSV</Dropdown.Item>
        </Dropdown.Content>
      )}
    </Dropdown>
  );
}