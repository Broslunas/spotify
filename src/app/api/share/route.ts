import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import UserStats from '@/models/UserStats'

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
    
    const { type, timeRange = 'medium_term', theme = 'dark' } = await request.json()
    
    // Get user stats
    const userStats = await UserStats.findOne({ 
      userId: user._id, 
      timeRange 
    }).sort({ updatedAt: -1 })
    
    if (!userStats) {
      return NextResponse.json(
        { error: 'No hay estadísticas disponibles' },
        { status: 404 }
      )
    }
    
    // Generate share data based on type
    let shareData: any = {
      user: {
        name: user.name,
        image: user.image
      },
      timeRange,
      theme,
      generatedAt: new Date().toISOString()
    }
    
    switch (type) {
      case 'top-tracks':
        shareData.title = `Mis canciones más escuchadas`
        shareData.subtitle = getTimeRangeLabel(timeRange)
        shareData.items = userStats.topTracks.slice(0, 10).map((track, index) => ({
          rank: index + 1,
          name: track.name,
          artist: track.artist,
          image: track.image,
          playCount: track.playCount
        }))
        break
        
      case 'top-artists':
        shareData.title = `Mis artistas más escuchados`
        shareData.subtitle = getTimeRangeLabel(timeRange)
        shareData.items = userStats.topArtists.slice(0, 10).map((artist, index) => ({
          rank: index + 1,
          name: artist.name,
          genres: artist.genres.slice(0, 3),
          image: artist.image,
          playCount: artist.playCount
        }))
        break
        
      case 'top-genres':
        shareData.title = `Mis géneros favoritos`
        shareData.subtitle = getTimeRangeLabel(timeRange)
        shareData.items = userStats.topGenres.slice(0, 10).map((genre, index) => ({
          rank: index + 1,
          name: genre.name,
          count: genre.count,
          percentage: genre.percentage
        }))
        break
        
      case 'summary':
        shareData.title = `Mi resumen musical`
        shareData.subtitle = getTimeRangeLabel(timeRange)
        shareData.summary = {
          totalMinutes: userStats.totalMinutes,
          topTrack: userStats.topTracks[0],
          topArtist: userStats.topArtists[0],
          topGenre: userStats.topGenres[0],
          audioFeatures: userStats.audioFeatures
        }
        break
        
      default:
        return NextResponse.json(
          { error: 'Tipo de compartir no válido' },
          { status: 400 }
        )
    }
    
    // In a real implementation, you would generate an actual image here
    // For now, we'll return the data that would be used to generate the image
    const shareUrl = `${process.env.NEXTAUTH_URL}/share/${user._id}/${type}/${timeRange}`
    
    return NextResponse.json({
      success: true,
      shareUrl,
      shareData,
      message: 'Datos preparados para compartir'
    })
    
  } catch (error) {
    console.error('Error generating share data:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

function getTimeRangeLabel(timeRange: string): string {
  switch (timeRange) {
    case 'short_term':
      return 'Últimas 4 semanas'
    case 'medium_term':
      return 'Últimos 6 meses'
    case 'long_term':
      return 'Últimos años'
    default:
      return 'Período personalizado'
  }
}