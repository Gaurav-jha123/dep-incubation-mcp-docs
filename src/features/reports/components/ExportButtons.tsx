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

    // Activate safe color mode
    document.body.classList.add("pdf-mode")

    // wait for styles to apply
    await new Promise((resolve) => setTimeout(resolve, 300))

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      allowTaint: true
    })

    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF("p", "mm", "a4")

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()

    const margin = 10
    const imgWidth = pageWidth - margin * 2
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, "PNG", margin, position + margin, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", margin, position + margin, imgWidth, imgHeight)
      heightLeft -= pageHeight
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