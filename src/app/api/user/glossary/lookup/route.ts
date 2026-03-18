import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Glossary from "@/models/Glossary"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const key = req.nextUrl.searchParams.get("key")

    if (!session || !session.user?.email || !key) {
      return NextResponse.json({ suggestions: null })
    }

    await dbConnect()

    // Find if the key has been translated before by the same user
    const entry = await Glossary.findOne({ 
      userEmail: session.user.email,
      key: key
    }).lean()

    if (entry) {
      return NextResponse.json({ suggestions: entry.translations })
    }

    return NextResponse.json({ suggestions: null })
  } catch (error) {
    console.error("Glossary lookup error:", error)
    return NextResponse.json({ suggestions: null }, { status: 500 })
  }
}
