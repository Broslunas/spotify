import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import UserStats from '@/models/UserStats'
import PlayHistory from '@/models/PlayHistory'
interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: { name: string; images: Array<{ url: string }> }
  duration_ms: number
  external_urls: { spotify: string }
  preview_url: string | null
}

interface SpotifyArtist {
  id: string
  name: string
  genres: string[]
  images: Array<{ url: string }>
  external_urls: { spotify: string }
  followers: { total: number }
  popularity: number
}

interface RecentTrackItem {
  track: SpotifyTrack
  played_at: string
}

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any)
    
    if (!session || !(session as any)?.user?.email || !(session as any).accessToken) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    await connectToDatabase()
    
    // Find user
    const user = await User.findOne({ email: (session as any).user.email })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    const { timeRange = 'medium_term' } = await request.json()
    
    try {
      // Fetch data from Spotify API
      const [topTracksRes, topArtistsRes, recentTracksRes] = await Promise.all([
        fetch(`${SPOTIFY_API_BASE}/me/top/tracks?time_range=${timeRange}&limit=50`, {
          headers: {
            'Authorization': `Bearer ${(session as any).accessToken}`
          }
        }),
        fetch(`${SPOTIFY_API_BASE}/me/top/artists?time_range=${timeRange}&limit=50`, {
            headers: {
              'Authorization': `Bearer ${(session as any).accessToken}`
            }
          }),
          fetch(`${SPOTIFY_API_BASE}/me/recently-played?limit=50`, {
            headers: {
              'Authorization': `Bearer ${(session as any).accessToken}`
            }
          })
      ])
      
      if (!topTracksRes.ok || !topArtistsRes.ok || !recentTracksRes.ok) {
        throw new Error('Error fetching data from Spotify API')
      }
      
      const [topTracksData, topArtistsData, recentTracksData] = await Promise.all([
        topTracksRes.json(),
        topArtistsRes.json(),
        recentTracksRes.json()
      ])
      
      // Process top tracks
      const topTracks = topTracksData.items.map((track: SpotifyTrack) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0]?.name || 'Unknown Artist',
        album: track.album?.name || 'Unknown Album',
        duration_ms: track.duration_ms,
        image: track.album?.images?.[0]?.url || null,
        external_urls: track.external_urls,
        preview_url: track.preview_url,
        playCount: Math.floor(Math.random() * 100) + 50 // Simulated play count
      }))
      
      // Process top artists
      const topArtists = topArtistsData.items.map((artist: SpotifyArtist) => ({
        id: artist.id,
        name: artist.name,
        genres: artist.genres || [],
        image: artist.images?.[0]?.url || null,
        external_urls: artist.external_urls,
        followers: artist.followers?.total || 0,
        playCount: Math.floor(Math.random() * 50) + 25 // Simulated play count
      }))
      
      // Process recent tracks
      const recentTracks = recentTracksData.items.map((item: RecentTrackItem) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0]?.name || 'Unknown Artist',
        album: item.track.album?.name || 'Unknown Album',
        played_at: item.played_at,
        image: item.track.album?.images?.[0]?.url || null,
        external_urls: item.track.external_urls,
        preview_url: item.track.preview_url
      }))
      
      // Calculate top genres from artists
      const genreCount: { [key: string]: number } = {}
      topArtists.forEach((artist: SpotifyArtist) => {
        artist.genres.forEach((genre: string) => {
          genreCount[genre] = (genreCount[genre] || 0) + 1
        })
      })
      
      const topGenres = Object.entries(genreCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
        .map(([name, count]) => ({
          name,
          count,
          percentage: Math.round((count / topArtists.length) * 100)
        }))
      
      // Calculate simulated audio features
      const audioFeatures = {
        danceability: Math.random() * 0.4 + 0.3, // 0.3-0.7
        energy: Math.random() * 0.4 + 0.4, // 0.4-0.8
        valence: Math.random() * 0.6 + 0.2, // 0.2-0.8
        acousticness: Math.random() * 0.3 + 0.1, // 0.1-0.4
        instrumentalness: Math.random() * 0.2, // 0-0.2
        speechiness: Math.random() * 0.15 + 0.05 // 0.05-0.2
      }
      
      // Calculate total listening time (simulated)
      const totalMinutes = topTracks.reduce((total: number, track: any) => {
        return total + Math.floor((track.duration_ms / 1000 / 60) * (track.playCount || 1))
      }, 0)
      
      // Update or create user stats
      const userStats = await UserStats.findOneAndUpdate(
        { userId: user._id, timeRange },
        {
          userId: user._id,
          timeRange,
          topTracks,
          topArtists,
          topGenres,
          recentTracks,
          totalMinutes,
          audioFeatures,
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      )
      
      return NextResponse.json({
        success: true,
        message: 'Datos sincronizados exitosamente',
        stats: {
          topTracks: topTracks.length,
          topArtists: topArtists.length,
          topGenres: topGenres.length,
          recentTracks: recentTracks.length,
          totalMinutes,
          lastUpdated: userStats.updatedAt
        }
      })
      
    } catch (spotifyError) {
      console.error('Spotify API Error:', spotifyError)
      return NextResponse.json(
        { error: 'Error al sincronizar con Spotify. Verifica tu conexión.' },
        { status: 400 }
      )
    }
    
  } catch (error) {
    console.error('Error syncing with Spotify:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}