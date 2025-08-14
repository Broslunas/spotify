'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Music, TrendingUp, Clock, Users, Download, Share2, Settings, LogOut } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { formatDuration, formatNumber } from '@/lib/utils'

interface Track {
  id: string
  name: string
  artist: string
  playCount: number
  duration: number
  image?: string
}

interface Artist {
  id: string
  name: string
  playCount: number
  genres: string[]
  image?: string
}

interface Genre {
  name: string
  count: number
  percentage: number
}

interface TimeRange {
  label: string
  value: 'short_term' | 'medium_term' | 'long_term'
}

interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{ name: string }>
  duration_ms: number
  album: {
    images: Array<{ url: string }>
  }
}

interface SpotifyArtist {
  id: string
  name: string
  genres: string[]
  images: Array<{ url: string }>
}

interface SpotifyRecentItem {
  track: SpotifyTrack
}

const timeRanges: TimeRange[] = [
  { label: 'Últimas 4 semanas', value: 'short_term' },
  { label: 'Últimos 6 meses', value: 'medium_term' },
  { label: 'Todo el tiempo', value: 'long_term' }
]

const COLORS = ['#1DB954', '#1ed760', '#1fdf64', '#84fab0', '#8fd3f4', '#a8edea']

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedTimeRange, setSelectedTimeRange] = useState<'short_term' | 'medium_term' | 'long_term'>('medium_term')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    topTracks: [] as Track[],
    topArtists: [] as Artist[],
    topGenres: [] as Genre[],
    totalMinutes: 0,
    recentTracks: [] as Track[]
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.accessToken) {
      fetchSpotifyData()
    }
  }, [session, selectedTimeRange])

  const fetchSpotifyData = async () => {
    setLoading(true)
    try {
      // Fetch top tracks
      const tracksResponse = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${selectedTimeRange}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      })
      const tracksData = await tracksResponse.json()

      // Fetch top artists
      const artistsResponse = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${selectedTimeRange}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      })
      const artistsData = await artistsResponse.json()

      // Fetch recently played
      const recentResponse = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=20', {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      })
      const recentData = await recentResponse.json()

      // Process data
      const topTracks: Track[] = tracksData.items?.map((track: SpotifyTrack, index: number) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        playCount: 100 - index * 5, // Mock play count
        duration: track.duration_ms,
        image: track.album.images[0]?.url
      })) || []

      const topArtists: Artist[] = artistsData.items?.map((artist: SpotifyArtist, index: number) => ({
        id: artist.id,
        name: artist.name,
        playCount: 200 - index * 10, // Mock play count
        genres: artist.genres,
        image: artist.images[0]?.url
      })) || []

      const recentTracks: Track[] = recentData.items?.map((item: SpotifyRecentItem) => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        playCount: 1,
        duration: item.track.duration_ms,
        image: item.track.album.images[0]?.url
      })) || []

      // Calculate genres
      const genreCount: { [key: string]: number } = {}
      topArtists.forEach(artist => {
        artist.genres.forEach(genre => {
          genreCount[genre] = (genreCount[genre] || 0) + 1
        })
      })

      const topGenres: Genre[] = Object.entries(genreCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 6)
        .map(([name, count]) => ({
          name,
          count,
          percentage: Math.round((count / topArtists.length) * 100)
        }))

      // Calculate total minutes (mock data)
      const totalMinutes = topTracks.reduce((acc, track) => acc + track.duration, 0) / 60000 * 50 // Mock multiplier

      setStats({
        topTracks,
        topArtists,
        topGenres,
        totalMinutes,
        recentTracks
      })
    } catch (error) {
      console.error('Error fetching Spotify data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    alert('Función de compartir próximamente disponible')
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    alert('Función de exportar próximamente disponible')
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-spotify-black via-gray-900 to-black flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="shimmer w-64 h-8 mb-4"></div>
          <div className="shimmer w-48 h-4 mb-2"></div>
          <div className="shimmer w-32 h-4"></div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-gray-900 to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-spotify-green/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 glass-dark border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Music className="h-8 w-8 text-spotify-green" />
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              </div>
              <div className="hidden md:flex items-center space-x-1 glass-card px-3 py-1">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setSelectedTimeRange(range.value)}
                    className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                      selectedTimeRange === range.value
                        ? 'bg-spotify-green text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShare}
                className="glass-button p-2 hover:bg-spotify-green/20 transition-colors"
                title="Compartir estadísticas"
              >
                <Share2 className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={handleExport}
                className="glass-button p-2 hover:bg-spotify-green/20 transition-colors"
                title="Exportar datos"
              >
                <Download className="h-5 w-5 text-white" />
              </button>
              <Link href="/settings" className="glass-button p-2 hover:bg-spotify-green/20 transition-colors">
                <Settings className="h-5 w-5 text-white" />
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="glass-button p-2 hover:bg-red-500/20 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center space-x-4">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'Usuario'}
                  className="w-16 h-16 rounded-full border-2 border-spotify-green"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  ¡Hola, {session.user?.name}!
                </h2>
                <p className="text-gray-300">
                  Aquí tienes tus estadísticas de Spotify para {timeRanges.find(r => r.value === selectedTimeRange)?.label.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Minutos Escuchados</p>
                <p className="text-2xl font-bold text-white">{formatNumber(Math.round(stats.totalMinutes))}</p>
              </div>
              <Clock className="h-8 w-8 text-spotify-green" />
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Canciones Top</p>
                <p className="text-2xl font-bold text-white">{stats.topTracks.length}</p>
              </div>
              <Music className="h-8 w-8 text-spotify-green" />
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Artistas Únicos</p>
                <p className="text-2xl font-bold text-white">{stats.topArtists.length}</p>
              </div>
              <Users className="h-8 w-8 text-spotify-green" />
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Géneros</p>
                <p className="text-2xl font-bold text-white">{stats.topGenres.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-spotify-green" />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Tracks Chart */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Canciones Más Escuchadas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topTracks.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="#9CA3AF" 
                  fontSize={12}
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} tick={{ fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                  formatter={(value, name) => [value, 'Reproducciones']}
                  labelFormatter={(label) => `Canción: ${label}`}
                />
                <Bar dataKey="playCount" fill="#1DB954" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Genres Pie Chart */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Géneros Más Escuchados</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.topGenres}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  labelLine={false}
                >
                  {stats.topGenres.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Artists and Recent Tracks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Artists */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Artistas Favoritos</h3>
            <div className="space-y-4">
              {stats.topArtists.slice(0, 5).map((artist, index) => (
                <div key={artist.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  {artist.image && (
                    <img src={artist.image} alt={artist.name} className="w-12 h-12 rounded-full" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{artist.name}</p>
                    <p className="text-gray-400 text-sm">{artist.playCount} reproducciones</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tracks */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Reproducidas Recientemente</h3>
            <div className="space-y-4">
              {stats.recentTracks.slice(0, 5).map((track, index) => (
                <div key={`${track.id}-${index}`} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                  {track.image && (
                    <img src={track.image} alt={track.name} className="w-12 h-12 rounded-lg" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{track.name}</p>
                    <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {formatDuration(track.duration)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}