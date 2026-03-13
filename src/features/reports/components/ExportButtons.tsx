import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { MoreVertical } from "lucide-react";

import { Dropdown } from "@/components/organisms";

export type Skill = {
  topic: string;
  value: number;
};

type ExportButtonsProps = {
  skills: Skill[];
};

export default function ExportButtons({ skills }: ExportButtonsProps) {

  const downloadCSV = () => {

    const headers = ["Skill", "Score"];

    const rows = skills.map((s) => [s.topic, s.value]);

    const csvContent =
      [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "skill-report.csv";
    link.click();
  };

  const downloadPDF = async () => {
    const element = document.getElementById("report-section");

    if (!element) return;

    try {

      // Activate safe color mode
      document.body.classList.add("pdf-mode");

      // wait for styles to apply
      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", margin, position + margin, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position + margin, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("skill-report.pdf");

      document.body.classList.remove("pdf-mode");

    } catch (error) {

      console.error("PDF generation failed:", error);
      document.body.classList.remove("pdf-mode");

    }
  };
  return (
    <Dropdown className="inline-flex">
      <Dropdown.Trigger
        className="px-2 py-2 rounded-md hover:bg-gray-100 border border-gray-200"
        aria-label="Open export menu"
      >
        <MoreVertical className="h-5 w-5" />
      </Dropdown.Trigger>

      <Dropdown.Content placement="bottom-end">
        <Dropdown.Item onClick={downloadPDF}>Export PDF</Dropdown.Item>
        <Dropdown.Item onClick={downloadCSV}>Export CSV</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
}