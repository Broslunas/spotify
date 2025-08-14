import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import UserStats from '@/models/UserStats'

interface TrackData {
  id: string
  name: string
  artist: string
  playCount?: number
  duration_ms?: number
  image?: string
  played_at?: string
}

interface ArtistData {
  id: string
  name: string
  playCount?: number
  genres?: string[]
  image?: string
}

interface GenreData {
  name: string
  count: number
  percentage?: number
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase()
    
    const resolvedParams = await params
    const userId = resolvedParams.id
    
    // Find user
    const user = await User.findById(userId).select(
      'name email image country isPublic privacySettings theme'
    )
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    // Check if profile is public
    if (!user.isPublic) {
      return NextResponse.json(
        { error: 'Este perfil es privado' },
        { status: 403 }
      )
    }
    
    // Get user stats
    const userStats = await UserStats.findOne({ userId }).sort({ updatedAt: -1 })
    
    if (!userStats) {
      return NextResponse.json(
        { error: 'Estadísticas no encontradas' },
        { status: 404 }
      )
    }
    
    // Filter data based on privacy settings
    const privacy = user.privacySettings || {
      showTopTracks: true,
      showTopArtists: true,
      showTopGenres: true,
      showListeningTime: false,
      showRecentTracks: false
    }
    
    const publicProfile = {
      id: user._id,
      name: user.name,
      image: user.image,
      country: user.country,
      isPublic: user.isPublic,
      privacy,
      stats: {
        topTracks: privacy.showTopTracks ? userStats.topTracks.map((track: TrackData) => ({
          id: track.id,
          name: track.name,
          artist: track.artist,
          playCount: track.playCount || 0,
          duration: track.duration_ms,
          image: track.image
        })) : [],
        topArtists: privacy.showTopArtists ? userStats.topArtists.map((artist: ArtistData) => ({
          id: artist.id,
          name: artist.name,
          playCount: artist.playCount || 0,
          genres: artist.genres,
          image: artist.image
        })) : [],
        topGenres: privacy.showTopGenres ? userStats.topGenres.map((genre: GenreData) => ({
          name: genre.name,
          count: genre.count,
          percentage: genre.percentage
        })) : [],
        totalMinutes: privacy.showListeningTime ? userStats.totalMinutes || 0 : 0,
        recentTracks: privacy.showRecentTracks ? userStats.recentTracks.map((track: TrackData) => ({
          id: track.id,
          name: track.name,
          artist: track.artist,
          playedAt: track.played_at,
          image: track.image
        })) : []
      }
    }
    
    return NextResponse.json(publicProfile)
    
  } catch (error) {
    console.error('Error fetching public profile:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}