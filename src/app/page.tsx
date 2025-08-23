import HomePage from "@/components/home"
import { SpreadsheetProvider } from "@/providers/preadsheetProvider"
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "Google Sheet Translation Manager",
  description: "Manage your translations with Google Sheets easily",
}
export default function Home() {
  return (
    <main className="relative flex items-center justify-center w-screen h-screen bg-amber-200">
      <SpreadsheetProvider>
        <HomePage />
      </SpreadsheetProvider>
    </main>
  )
}
