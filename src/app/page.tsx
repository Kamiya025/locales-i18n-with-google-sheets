import HomePage from "@/components/form"
import { SpreadsheetProvider } from "@/providers/preadsheetProvider"

export default function Home() {
  return (
    <main className="relative flex items-center justify-center w-screen h-screen bg-amber-300">
      <SpreadsheetProvider>
        <HomePage />
      </SpreadsheetProvider>
    </main>
  )
}
