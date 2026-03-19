import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const session: any = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const pageToken = searchParams.get("pageToken")

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Google Drive API: list files with specific mimeType and optional name search
    let query = "mimeType='application/vnd.google-apps.spreadsheet'"
    if (search) {
      // name contains 'search' - drive query uses single quotes for strings
      query += ` and name contains '${search.replace(/'/g, "\\'")}'`
    }

    const q = encodeURIComponent(query)
    const fields = encodeURIComponent("nextPageToken, files(id, name, modifiedTime, iconLink, webViewLink, owners)")
    let url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=${fields}&orderBy=modifiedTime desc&pageSize=5`

    if (pageToken) {
      url += `&pageToken=${pageToken}`
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
      next: { revalidate: 0 }
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Google Drive API error:", errorData)
      return NextResponse.json({ error: "Failed to fetch from Google Drive" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({
      files: data.files || [],
      nextPageToken: data.nextPageToken || null
    })
  } catch (error) {
    console.error("Internal Server Error in Drive API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}


