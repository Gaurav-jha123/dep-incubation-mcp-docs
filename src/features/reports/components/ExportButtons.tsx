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
      document.body.classList.add("pdf-mode")

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true
      })

      const imgData = canvas.toDataURL("image/png")

      const pdf = new jsPDF("p", "mm", "a4")

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      const margin = 10

      const imgWidth = pageWidth - margin * 2
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let yOffset = 0
      let pageNumber = 0

      while (yOffset < imgHeight) {

        if (pageNumber > 0) {
          pdf.addPage()
        }

        pdf.addImage(
          imgData,
          "PNG",
          margin,
          margin - yOffset,
          imgWidth,
          imgHeight
        )

        yOffset += pageHeight - margin * 2
        pageNumber++
      }

      pdf.save("skill-report.pdf")

      document.body.classList.remove("pdf-mode")

    } catch (error) {
      console.error("PDF generation failed:", error)
      document.body.classList.remove("pdf-mode")
    }
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



    </div>
  )
}