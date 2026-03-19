import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { JWT } from "google-auth-library"

/**
 * GET /api/sheet/[id]/metadata
 *
 * Lấy nhanh metadata của spreadsheet qua Google Sheets REST API:
 * - Tên spreadsheet
 * - Danh sách tất cả sheets (id, title, gridProperties)
 * - KHÔNG load bất kỳ row data nào → cực nhanh (~1 HTTP call)
 *
 * Ưu tiên user OAuth token, fallback sang service account JWT.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: "Missing spreadsheet ID" }, { status: 400 })
    }

    const session: any = await getServerSession(authOptions)

    let accessToken: string | null = null
    let authType = "service_account"

    if (session?.accessToken) {
      // Ưu tiên user OAuth
      accessToken = session.accessToken
      authType = "user"
    } else {
      // Fallback: service account JWT
      const jwt = new JWT({
        email: process.env.GOOGLE_CLIENT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      })
      const tokenInfo = await jwt.getAccessToken()
      accessToken = tokenInfo.token ?? null
      authType = "service_account"
    }

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized - no valid token" }, { status: 401 })
    }

    // --- 1 HTTP CALL: chỉ lấy phần spreadsheetId + sheets (không lấy values) ---
    const fields = "spreadsheetId,properties.title,sheets.properties"
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${id}?fields=${encodeURIComponent(fields)}`

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      // Không cache - luôn lấy mới nhất
      cache: "no-store",
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      console.error("Google Sheets metadata error:", errBody)

      if (response.status === 403) {
        return NextResponse.json(
          { error: "Permission denied. Check spreadsheet sharing settings.", needsAuth: authType === "service_account" },
          { status: 403 }
        )
      }
      if (response.status === 404) {
        return NextResponse.json({ error: "Spreadsheet not found" }, { status: 404 })
      }
      return NextResponse.json({ error: "Failed to fetch metadata from Google Sheets" }, { status: response.status })
    }

    const raw = await response.json()

    // Chuyển sang format dễ dùng
    const metadata = {
      spreadsheetId: raw.spreadsheetId,
      title: raw.properties?.title ?? "",
      sheets: (raw.sheets ?? []).map((s: any) => ({
        sheetId: s.properties?.sheetId,
        title: s.properties?.title,
        index: s.properties?.index,
        rowCount: s.properties?.gridProperties?.rowCount,
        columnCount: s.properties?.gridProperties?.columnCount,
        hidden: s.properties?.hidden ?? false,
      })),
      _meta: {
        authType,
        fetchedAt: new Date().toISOString(),
        totalSheets: (raw.sheets ?? []).length,
      },
    }

    return NextResponse.json({ success: true, data: metadata })
  } catch (err: any) {
    console.error("Metadata endpoint error:", err)
    return NextResponse.json(
      { error: err.message ?? "Internal server error" },
      { status: 500 }
    )
  }
}
