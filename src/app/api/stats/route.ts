import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import UserStats from '@/models/UserStats'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    await connectToDatabase()
    
    // Find user
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('time_range') || 'medium_term' // short_term, medium_term, long_term
    const limit = parseInt(searchParams.get('limit') || '50')
    
    // Get user stats
    const userStats = await UserStats.findOne({ 
      userId: user._id,
      timeRange 
    }).sort({ updatedAt: -1 })
    
    if (!userStats) {
      // Return empty stats if none found
      return NextResponse.json({
        topTracks: [],
        topArtists: [],
        topGenres: [],
        recentTracks: [],
        totalMinutes: 0,
        audioFeatures: {
          danceability: 0,
          energy: 0,
          valence: 0,
          acousticness: 0,
          instrumentalness: 0,
          speechiness: 0
        },
        timeRange,
        lastUpdated: null
      })
    }
    
    // Format response
    const stats = {
      topTracks: userStats.topTracks.slice(0, limit).map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artist,
        album: track.album,
        playCount: track.playCount || 0,
        duration: track.duration_ms,
        image: track.image,
        external_urls: track.external_urls,
        preview_url: track.preview_url
      })),
      topArtists: userStats.topArtists.slice(0, limit).map(artist => ({
        id: artist.id,
        name: artist.name,
        playCount: artist.playCount || 0,
        genres: artist.genres,
        image: artist.image,
        external_urls: artist.external_urls,
        followers: artist.followers
      })),
      topGenres: userStats.topGenres.slice(0, limit).map(genre => ({
        name: genre.name,
        count: genre.count,
        percentage: genre.percentage
      })),
      recentTracks: userStats.recentTracks.slice(0, 20).map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artist,
        album: track.album,
        playedAt: track.played_at,
        image: track.image,
        external_urls: track.external_urls,
        preview_url: track.preview_url
      })),
      totalMinutes: userStats.totalMinutes || 0,
      audioFeatures: userStats.audioFeatures || {
        danceability: 0,
        energy: 0,
        valence: 0,
        acousticness: 0,
        instrumentalness: 0,
        speechiness: 0
      },
      timeRange,
      lastUpdated: userStats.updatedAt
    }
    
    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }
    
    await connectToDatabase()
    
    // Find user
    const user = await User.findOne({ email: session.user.email })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    const body = await request.json()
    const { timeRange = 'medium_term', stats } = body
    
    // Update or create user stats
    const userStats = await UserStats.findOneAndUpdate(
      { userId: user._id, timeRange },
      {
        userId: user._id,
        timeRange,
        ...stats,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    )
    
    return NextResponse.json({ success: true, stats: userStats })
    
  } catch (error) {
    console.error('Error updating user stats:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}