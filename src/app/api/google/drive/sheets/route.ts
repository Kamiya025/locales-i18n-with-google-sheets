import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session: any = await getServerSession(authOptions)

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Google Drive API: list files with specific mimeType
    const q = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet'")
    const fields = encodeURIComponent("files(id, name, modifiedTime, iconLink, webViewLink, owners)")
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&orderBy=modifiedTime desc&pageSize=20`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Google Drive API error:", errorData)
      return NextResponse.json({ error: "Failed to fetch from Google Drive" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data.files || [])
  } catch (error) {
    console.error("Internal Server Error in Drive API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
