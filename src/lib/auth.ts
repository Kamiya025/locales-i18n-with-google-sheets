import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

/**
 * Refresh access token bằng refresh token từ Google OAuth
 */
async function refreshAccessToken(token: any) {
  try {
    const url = "https://oauth2.googleapis.com/token"

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh_token
    }
  } catch (error) {
    console.error("Error refreshing access token:", error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "openid profile email https://www.googleapis.com/auth/spreadsheets",
          prompt: "consent",
          access_type: "offline",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      // Lưu access token và refresh token vào JWT lần đầu đăng nhập
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
          ? account.expires_at * 1000
          : Date.now() + 3600 * 1000 // Convert to milliseconds
        return token
      }

      // Nếu access token vẫn còn hiệu lực (còn hơn 5 phút), trả về token hiện tại
      if (
        token.expiresAt &&
        Date.now() < (token.expiresAt as number) - 5 * 60 * 1000
      ) {
        return token
      }

      // Access token sắp hết hạn, thử refresh
      if (token.refreshToken) {
        console.log("🔄 Access token sắp hết hạn, đang refresh...")
        const refreshedToken = await refreshAccessToken(token)

        // Nếu refresh thành công
        if (!refreshedToken.error) {
          console.log("✅ Refresh token thành công")
          return refreshedToken
        } else {
          console.log("❌ Refresh token thất bại, cần đăng nhập lại")
          // Refresh token cũng hết hạn, xóa token để buộc đăng nhập lại
          return {
            ...token,
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            error: "RefreshAccessTokenError",
          }
        }
      }

      return token
    },
    async session({ session, token }) {
      // Nếu có lỗi refresh token, không gửi access token về client
      if (token.error) {
        return {
          ...session,
          accessToken: null,
          refreshToken: null,
          expiresAt: null,
          error: token.error,
        }
      }

      // Gửi access token đến client
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.expiresAt = token.expiresAt as number
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
}
