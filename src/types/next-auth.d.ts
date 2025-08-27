import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    accessToken?: string | null
    refreshToken?: string | null
    expiresAt?: number | null
    error?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string | null
    refreshToken?: string | null
    expiresAt?: number | null
    error?: string
  }
}
