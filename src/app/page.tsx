import HomePage from "@/components/home"
import { SpreadsheetProvider } from "@/providers/preadsheetProvider"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Google Sheet Translation Manager",
  description: "Manage your translations with Google Sheets easily",
}

export default function Home() {
  return (
    <div className="flex flex-col">
      <HomePage />
    </div>
  )
}
