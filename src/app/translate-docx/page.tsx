import DocxEditor from "@/components/docx/DocxEditor"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dịch tài liệu Word - Translator Tool",
  description: "Trình dịch văn bản tách đoạn chuyên nghiệp cho file .docx",
}

export default function TranslateDocxPage() {
  return <DocxEditor />
}
