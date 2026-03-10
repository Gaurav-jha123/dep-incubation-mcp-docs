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

  const downloadCSV = (skills: Skill[]) => {

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

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true
  })

  const imgData = canvas.toDataURL("image/png")

  const pdf = new jsPDF("p", "mm", "a4")

  const imgWidth = 190
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight)

  pdf.save("skill-report.pdf")
}

  const printReport = () => {
    window.print()
  }

  return (
    <div className="flex gap-4 mb-6">

      <button
        onClick={() => downloadCSV(skills)}
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