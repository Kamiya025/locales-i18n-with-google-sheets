import SpreadsheetDetailWrapper from "@/components/detail/SpreadsheetDetailPage"
import { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const spreadsheetId = resolvedParams.id

  return {
    title: `Google Sheets Translation Manager - ${spreadsheetId}`,
    description: `Quản lý bản dịch cho Google Sheets: ${spreadsheetId}`,
  }
}

export default async function SheetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  return <SpreadsheetDetailWrapper spreadsheetId={resolvedParams.id} />
}
