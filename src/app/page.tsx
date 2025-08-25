import HomePage from "@/components/home"
import Footer from "@/components/ui/footer"
import { SpreadsheetProvider } from "@/providers/preadsheetProvider"
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "Google Sheet Translation Manager",
  description: "Manage your translations with Google Sheets easily",
}
export default function Home() {
  return (
    <SpreadsheetProvider>
      <div className="flex flex-col">
        <main className="flex-1">
          <HomePage />
        </main>
        <Footer />
      </div>
    </SpreadsheetProvider>
  )
}
