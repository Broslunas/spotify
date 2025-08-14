'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Music, Clock, Users, TrendingUp, Share2, Eye, EyeOff } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Link from 'next/link'
import { formatDuration, formatNumber } from '@/lib/utils'

interface PublicProfile {
  id: string
  name: string
  image?: string
  country?: string
  isPublic: boolean
  privacy: {
    showTopTracks: boolean
    showTopArtists: boolean
    showTopGenres: boolean
    showListeningTime: boolean
    showRecentTracks: boolean
  }
  stats: {
    topTracks: Array<{
      id: string
      name: string
      artist: string
      playCount: number
      duration: number
      image?: string
    }>
    topArtists: Array<{
      id: string
      name: string
      playCount: number
      genres: string[]
      image?: string
    }>
    topGenres: Array<{
      name: string
      count: number
      percentage: number
    }>
    totalMinutes: number
    recentTracks: Array<{
      id: string
      name: string
      artist: string
      playedAt: string
      image?: string
    }>
  }
}

const COLORS = ['#1DB954', '#1ed760', '#1fdf64', '#84fab0', '#8fd3f4', '#a8edea']

export default function ProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchProfile(params.id as string)
    }
  }, [params.id])

  const fetchProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/profile/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      } else if (response.status === 404) {
        setError('Perfil no encontrado')
      } else if (response.status === 403) {
        setError('Este perfil es privado')
      } else {
        setError('Error al cargar el perfil')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Perfil de ${profile?.name} en Spotify Dashboard`,
        text: `Mira las estadísticas de Spotify de ${profile?.name}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Enlace copiado al portapapeles')
    }
  }

  if (loading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-spotify-black via-gray-900 to-black flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <EyeOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">{error}</h1>
          <p className="text-gray-400 mb-6">
            {error === 'Este perfil es privado' 
              ? 'El usuario ha configurado su perfil como privado'
              : 'No pudimos cargar este perfil en este momento'
            }
          </p>
          <Link href="/dashboard" className="glass-button px-6 py-3 bg-spotify-green/20 hover:bg-spotify-green/30 transition-colors">
            Volver al Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!profile) {
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
              <button onClick={() => router.back()} className="glass-button p-2 hover:bg-white/10 transition-colors">
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              <div className="flex items-center space-x-2">
                <Music className="h-8 w-8 text-spotify-green" />
                <h1 className="text-2xl font-bold text-white">Perfil Público</h1>
              </div>
            </div>
            <button
              onClick={handleShare}
              className="glass-button p-2 hover:bg-spotify-green/20 transition-colors"
              title="Compartir perfil"
            >
              <Share2 className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="glass-card p-8 mb-8">
          <div className="flex items-center space-x-6">
            {profile.image && (
              <img
                src={profile.image}
                alt={profile.name}
                className="w-24 h-24 rounded-full border-4 border-spotify-green"
              />
            )}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{profile.name}</h2>
              {profile.country && (
                <p className="text-gray-400 mb-4">📍 {profile.country}</p>
              )}
              <div className="flex items-center space-x-2 text-spotify-green">
                <Eye className="h-4 w-4" />
                <span className="text-sm">Perfil público</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {profile.privacy.showListeningTime && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Minutos Escuchados</p>
                  <p className="text-2xl font-bold text-white">{formatNumber(Math.round(profile.stats.totalMinutes))}</p>
                </div>
                <Clock className="h-8 w-8 text-spotify-green" />
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Canciones Top</p>
                  <p className="text-2xl font-bold text-white">{profile.stats.topTracks.length}</p>
                </div>
                <Music className="h-8 w-8 text-spotify-green" />
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Artistas Únicos</p>
                  <p className="text-2xl font-bold text-white">{profile.stats.topArtists.length}</p>
                </div>
                <Users className="h-8 w-8 text-spotify-green" />
              </div>
            </div>
            <div className="glass-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Géneros</p>
                  <p className="text-2xl font-bold text-white">{profile.stats.topGenres.length}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-spotify-green" />
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Tracks Chart */}
          {profile.privacy.showTopTracks && (
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-6">Canciones Más Escuchadas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profile.stats.topTracks.slice(0, 5)}>
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
          )}

          {/* Top Genres Pie Chart */}
          {profile.privacy.showTopGenres && (
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-6">Géneros Más Escuchados</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={profile.stats.topGenres}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    labelLine={false}
                  >
                    {profile.stats.topGenres.map((entry, index) => (
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
          )}
        </div>

        {/* Top Artists and Recent Tracks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Artists */}
          {profile.privacy.showTopArtists && (
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-6">Artistas Favoritos</h3>
              <div className="space-y-4">
                {profile.stats.topArtists.slice(0, 5).map((artist, index) => (
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
          )}

          {/* Recent Tracks */}
          {profile.privacy.showRecentTracks && (
            <div className="glass-card p-6">
              <h3 className="text-xl font-bold text-white mb-6">Reproducidas Recientemente</h3>
              <div className="space-y-4">
                {profile.stats.recentTracks.slice(0, 5).map((track, index) => (
                  <div key={`${track.id}-${index}`} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    {track.image && (
                      <img src={track.image} alt={track.name} className="w-12 h-12 rounded-lg" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{track.name}</p>
                      <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                    </div>
                    <div className="text-gray-400 text-xs">
                      {new Date(track.playedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        {!profile.privacy.showTopTracks && !profile.privacy.showTopArtists && !profile.privacy.showTopGenres && !profile.privacy.showRecentTracks && (
          <div className="glass-card p-8 text-center mt-8">
            <EyeOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Información Limitada</h3>
            <p className="text-gray-400">
              Este usuario ha configurado su perfil para mostrar información limitada.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}