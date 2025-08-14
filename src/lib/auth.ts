import SpotifyProvider from 'next-auth/providers/spotify'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import { MongoClient } from 'mongodb'
import { JWT } from 'next-auth/jwt'

// Define NextAuthOptions type manually
interface NextAuthOptions {
  adapter?: any
  providers: any[]
  callbacks?: {
    jwt?: (params: any) => Promise<any>
    session?: (params: any) => Promise<any>
  }
  pages?: {
    signIn?: string
    error?: string
  }
  session?: {
    strategy: 'jwt' | 'database'
  }
  secret?: string
}

const client = new MongoClient(process.env.MONGODB_URI!)
const clientPromise = client.connect()

// Spotify scopes needed for the application
const spotifyScopes = [
  'user-read-email',
  'user-read-private',
  'user-top-read',
  'user-read-recently-played',
  'user-read-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
  'user-follow-read'
].join(' ')

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: spotifyScopes,
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and refresh_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
        token.spotifyId = profile?.id
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string
      session.error = token.error as string
      session.spotifyId = token.spotifyId as string
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
}

interface ExtendedJWT extends JWT {
  accessToken?: string
  refreshToken?: string
  expiresAt?: number
  error?: string
}

async function refreshAccessToken(token: ExtendedJWT): Promise<ExtendedJWT> {
  try {
    const url = 'https://accounts.spotify.com/api/token'

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
      }),
      method: 'POST',
    })

    const tokens = await response.json()

    if (!response.ok) {
      throw tokens
    }

    return {
      ...token,
      accessToken: tokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000 + tokens.expires_in),
      refreshToken: tokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    }
  }
}