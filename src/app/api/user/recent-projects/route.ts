import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import UserProject from "@/models/UserProject"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Chưa đăng nhập" },
        { status: 401 }
      )
    }

    await dbConnect()

    const projects = await UserProject.find({ 
      userEmail: session.user.email 
    })
    .sort({ lastAccessedAt: -1 })
    .limit(10)
    .lean()

    return NextResponse.json(projects)
  } catch (error: any) {
    console.error("Fetch recent projects error:", error)
    return NextResponse.json(
      { message: "Không thể lấy danh sách dự án gần đây" },
      { status: 500 }
    )
  }
}
