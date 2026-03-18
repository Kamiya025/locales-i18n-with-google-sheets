import HomePage from "@/components/home"
import { SpreadsheetProvider } from "@/providers/preadsheetProvider"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Translator Tool - Quản lý dịch thuật chuyên nghiệp",
  description: "Trình quản lý dịch thuật hiện đại tích hợp Google Sheets",
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <HomePage />
    </div>
  )
}
