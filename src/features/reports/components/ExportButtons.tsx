import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export type Skill = {
  topic: string
  value: number
}

type ExportButtonsProps = {
  skills: Skill[]
}

export default function ExportButtons({ skills }: ExportButtonsProps) {

  const downloadCSV = () => {

    const headers = ["Skill", "Score"]

    const rows = skills.map((s) => [s.topic, s.value])

    const csvContent =
      [headers, ...rows]
        .map((row) => row.join(","))
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })

    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "skill-report.csv"
    link.click()
  }

  const downloadPDF = async () => {

    const element = document.getElementById("report-section")

    if (!element) {
      alert("Select a user first")
      return
    }

    try {

      /* Disable Tailwind temporarily */
      document.body.classList.add("pdf-mode")

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true
      })

      const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF("p", "mm", "a4")

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const imgHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight)

      pdf.save("skill-report.pdf")

      /* Restore styles */
      document.body.classList.remove("pdf-mode")

    } catch (error) {
      console.error("PDF generation failed:", error)
      document.body.classList.remove("pdf-mode")
    }
  }

  const printReport = () => {
    window.print()
  }

  return (
    <div className="flex gap-4 mb-6">

      <button
        onClick={downloadCSV}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Download CSV
      </button>

      <button
        onClick={downloadPDF}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Download PDF
      </button>

      <button
        onClick={printReport}
        className="px-4 py-2 bg-gray-800 text-white rounded"
      >
        Print Report
      </button>

    </div>
  )
}