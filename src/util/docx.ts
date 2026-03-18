import mammoth from "mammoth"

export interface DocxSegment {
  id: string
  original: string
  translation: string
}

export interface DocxProject {
  fileName: string
  segments: DocxSegment[]
  createdAt: number
}

/**
 * Parses a .docx file and splits it into segments (paragraphs)
 */
export async function parseDocxToSegments(file: File): Promise<DocxProject> {
  const arrayBuffer = await file.arrayBuffer()
  
  // Convert to HTML to preserve some structure (like paragraphs)
  const result = await mammoth.convertToHtml({ arrayBuffer })
  const html = result.value
  
  // Simple parser to extract paragraphs from HTML
  // We can use a temporary DOM element to parse the HTML string
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  const paragraphs = Array.from(doc.querySelectorAll("p, h1, h2, h3, h4, h5, h6, li"))
  
  const segments: DocxSegment[] = paragraphs
    .map((p, index) => ({
      id: `seg-${index}`,
      original: p.textContent?.trim() || "",
      translation: "",
    }))
    .filter((seg) => seg.original.length > 0) // Remove empty segments

  return {
    fileName: file.name,
    segments,
    createdAt: Date.now(),
  }
}
