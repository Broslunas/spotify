import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import UserStats from '@/models/UserStats'
import PlayHistory from '@/models/PlayHistory'

interface ExportData {
  user: {
    name?: string
    email?: string
    country?: string
    product?: string
    followers?: number
    createdAt?: string
  }
  playHistory: Array<{
    trackName?: string
    artistName?: string
    albumName?: string
    msPlayed?: number
    endTime?: string
    reasonStart?: string
    reasonEnd?: string
    shuffle?: boolean
    skipped?: boolean
    offline?: boolean
    incognitoMode?: boolean
  }>
  stats: Array<{
    timeRange: string
    topTracks: Array<{
      name?: string
      artists?: Array<{ name: string }>
      album?: { name: string }
      playCount?: number
      duration_ms?: number
    }>
    topArtists: Array<{
      name?: string
      genres?: string[]
      followers?: { total: number }
      popularity?: number
    }>
  }>
}

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
    
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json' // json, csv
    
    // Get all user data
    const [userStats, playHistory] = await Promise.all([
      UserStats.find({ userId: user._id }).sort({ updatedAt: -1 }),
      PlayHistory.find({ userId: user._id }).sort({ endTime: -1 }).limit(10000) // Limit to last 10k plays
    ])
    
    const exportData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        country: user.country,
        product: user.product,
        followers: user.followers,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      stats: userStats.map(stat => ({
        timeRange: stat.timeRange,
        topTracks: stat.topTracks,
        topArtists: stat.topArtists,
        topGenres: stat.topGenres,
        recentTracks: stat.recentTracks,
        totalMinutes: stat.totalMinutes,
        audioFeatures: stat.audioFeatures,
        updatedAt: stat.updatedAt
      })),
      playHistory: playHistory.map(play => ({
        trackName: play.trackName,
        artistName: play.artistName,
        albumName: play.albumName,
        msPlayed: play.msPlayed,
        endTime: play.endTime,
        reasonStart: play.reasonStart,
        reasonEnd: play.reasonEnd,
        shuffle: play.shuffle,
        skipped: play.skipped,
        offline: play.offline,
        incognitoMode: play.incognitoMode
      })),
      exportedAt: new Date().toISOString()
    }
    
    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(exportData)
      
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="spotify-data-${user.name?.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    }
    
    // Return JSON format
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="spotify-data-${user.name?.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json"`
      }
    })
    
  } catch (error) {
    console.error('Error exporting user data:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

function convertToCSV(data: ExportData): string {
  const csvRows: string[] = []
  
  // Add user info
  csvRows.push('USER INFORMATION')
  csvRows.push('Field,Value')
  csvRows.push(`Name,"${data.user.name || ''}"`)
  csvRows.push(`Email,"${data.user.email || ''}"`)
  csvRows.push(`Country,"${data.user.country || ''}"`)
  csvRows.push(`Product,"${data.user.product || ''}"`)
  csvRows.push(`Followers,${data.user.followers || 0}`)
  csvRows.push(`Created At,"${data.user.createdAt || ''}"`)
  csvRows.push('')
  
  // Add play history
  csvRows.push('PLAY HISTORY')
  csvRows.push('Track Name,Artist Name,Album Name,Ms Played,End Time,Reason Start,Reason End,Shuffle,Skipped,Offline,Incognito Mode')
  
  data.playHistory.forEach((play) => {
    csvRows.push([
      `"${play.trackName || ''}"`,
      `"${play.artistName || ''}"`,
      `"${play.albumName || ''}"`,
      play.msPlayed || 0,
      `"${play.endTime || ''}"`,
      `"${play.reasonStart || ''}"`,
      `"${play.reasonEnd || ''}"`,
      play.shuffle || false,
      play.skipped || false,
      play.offline || false,
      play.incognitoMode || false
    ].join(','))
  })
  
  csvRows.push('')
  
  // Add top tracks for each time range
  data.stats.forEach((stat) => {
    csvRows.push(`TOP TRACKS - ${stat.timeRange.toUpperCase()}`)
    csvRows.push('Rank,Track Name,Artist,Album,Play Count,Duration (ms)')
    
    stat.topTracks.forEach((track, index: number) => {
      csvRows.push([
        index + 1,
        `"${track.name || ''}"`,
        `"${track.artist || ''}"`,
        `"${track.album || ''}"`,
        track.playCount || 0,
        track.duration || 0
      ].join(','))
    })
    
    csvRows.push('')
  })
  
  return csvRows.join('\n')
}