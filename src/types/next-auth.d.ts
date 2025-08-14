import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    error?: string
    spotifyId?: string
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    spotifyId?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    expiresAt?: number
    error?: string
    spotifyId?: string
  }
}