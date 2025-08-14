'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowLeft, User, Shield, Palette, Download, Trash2, Save, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/providers/ThemeProvider'

interface PrivacySettings {
  isPublic: boolean
  showTopTracks: boolean
  showTopArtists: boolean
  showTopGenres: boolean
  showListeningTime: boolean
  showRecentTracks: boolean
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  privacy: PrivacySettings
  notifications: {
    weeklyReport: boolean
    monthlyReport: boolean
    newFeatures: boolean
  }
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'system',
    privacy: {
      isPublic: false,
      showTopTracks: true,
      showTopArtists: true,
      showTopGenres: true,
      showListeningTime: false,
      showRecentTracks: false
    },
    notifications: {
      weeklyReport: true,
      monthlyReport: true,
      newFeatures: false
    }
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      loadUserPreferences()
    }
  }, [session])

  const loadUserPreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences')
      if (response.ok) {
        const data = await response.json()
        setPreferences(data)
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      })
      
      if (response.ok) {
        // Show success message
        alert('Configuración guardada exitosamente')
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      alert('Error al guardar la configuración')
    } finally {
      setSaving(false)
    }
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    setPreferences(prev => ({ ...prev, theme: newTheme }))
  }

  const handlePrivacyChange = (key: keyof PrivacySettings, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }))
  }

  const handleNotificationChange = (key: keyof UserPreferences['notifications'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }))
  }

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/user/export')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `spotify-data-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      alert('Error al exportar los datos')
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      try {
        const response = await fetch('/api/user/delete', {
          method: 'DELETE'
        })
        
        if (response.ok) {
          alert('Cuenta eliminada exitosamente')
          router.push('/')
        }
      } catch (error) {
        console.error('Error deleting account:', error)
        alert('Error al eliminar la cuenta')
      }
    }
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
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="glass-button p-2 hover:bg-white/10 transition-colors">
                <ArrowLeft className="h-5 w-5 text-white" />
              </Link>
              <h1 className="text-2xl font-bold text-white">Configuración</h1>
            </div>
            <button
              onClick={savePreferences}
              disabled={saving}
              className="glass-button px-4 py-2 bg-spotify-green/20 hover:bg-spotify-green/30 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Guardando...' : 'Guardar'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Profile Section */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <User className="h-6 w-6 text-spotify-green" />
            <h2 className="text-xl font-bold text-white">Perfil</h2>
          </div>
          <div className="flex items-center space-x-6">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt={session.user.name || 'Usuario'}
                className="w-20 h-20 rounded-full border-2 border-spotify-green"
              />
            )}
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{session.user?.name}</h3>
              <p className="text-gray-400 mb-2">{session.user?.email}</p>
              <Link
                href={`/profile/${session.user?.id}`}
                className="inline-flex items-center space-x-2 text-spotify-green hover:text-spotify-green/80 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Ver perfil público</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Palette className="h-6 w-6 text-spotify-green" />
            <h2 className="text-xl font-bold text-white">Apariencia</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-3">Tema</label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'light', label: 'Claro' },
                  { value: 'dark', label: 'Oscuro' },
                  { value: 'system', label: 'Sistema' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleThemeChange(option.value as 'light' | 'dark' | 'system')}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      theme === option.value
                        ? 'border-spotify-green bg-spotify-green/10'
                        : 'border-white/20 hover:border-white/40 bg-white/5'
                    }`}
                  >
                    <span className="text-white font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="h-6 w-6 text-spotify-green" />
            <h2 className="text-xl font-bold text-white">Privacidad</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Perfil Público</h3>
                <p className="text-gray-400 text-sm">Permite que otros usuarios vean tu perfil</p>
              </div>
              <button
                onClick={() => handlePrivacyChange('isPublic', !preferences.privacy.isPublic)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  preferences.privacy.isPublic ? 'bg-spotify-green' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    preferences.privacy.isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {preferences.privacy.isPublic && (
              <div className="ml-4 space-y-4 border-l-2 border-spotify-green/30 pl-4">
                <h4 className="text-white font-medium">Información visible en el perfil público:</h4>
                {[
                  { key: 'showTopTracks', label: 'Canciones favoritas', desc: 'Muestra tus canciones más escuchadas' },
                  { key: 'showTopArtists', label: 'Artistas favoritos', desc: 'Muestra tus artistas más escuchados' },
                  { key: 'showTopGenres', label: 'Géneros favoritos', desc: 'Muestra tus géneros más escuchados' },
                  { key: 'showListeningTime', label: 'Tiempo de escucha', desc: 'Muestra tus minutos totales escuchados' },
                  { key: 'showRecentTracks', label: 'Reproducciones recientes', desc: 'Muestra tu actividad reciente' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <h5 className="text-white text-sm font-medium">{item.label}</h5>
                      <p className="text-gray-400 text-xs">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange(item.key as keyof PrivacySettings, !preferences.privacy[item.key as keyof PrivacySettings])}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        preferences.privacy[item.key as keyof PrivacySettings] ? 'bg-spotify-green' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          preferences.privacy[item.key as keyof PrivacySettings] ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Data Management */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Download className="h-6 w-6 text-spotify-green" />
            <h2 className="text-xl font-bold text-white">Gestión de Datos</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <h3 className="text-white font-medium">Exportar mis datos</h3>
                <p className="text-gray-400 text-sm">Descarga todos tus datos en formato JSON</p>
              </div>
              <button
                onClick={handleExportData}
                className="glass-button px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-card p-6 border border-red-500/30">
          <div className="flex items-center space-x-2 mb-6">
            <Trash2 className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-bold text-white">Zona de Peligro</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/30">
              <div>
                <h3 className="text-white font-medium">Eliminar cuenta</h3>
                <p className="text-gray-400 text-sm">Elimina permanentemente tu cuenta y todos tus datos</p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="glass-button px-4 py-2 bg-red-500/20 hover:bg-red-500/30 transition-colors flex items-center space-x-2 text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-4 w-4" />
                <span>Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}